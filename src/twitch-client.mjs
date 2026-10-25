import { parseChatAnswer } from "./game-engine.mjs";
import { WebSocket } from "ws";

const EVENTSUB_URL = "wss://eventsub.wss.twitch.tv/ws?keepalive_timeout_seconds=30";

export class TwitchChatClient {
  constructor({ clientId, token, channelLogin, onAnswer, onStatus }) {
    this.clientId = clientId;
    this.token = token?.replace(/^oauth:/, "");
    this.channelLogin = channelLogin?.toLowerCase();
    this.onAnswer = onAnswer;
    this.onStatus = onStatus;
    this.socket = null;
    this.identity = null;
  }

  async connect() {
    if (!this.clientId || !this.token || !this.channelLogin) {
      this.onStatus("demo", "Twitch settings are empty; Demo Mode is active.");
      return;
    }
    this.identity = await this.#validateAndResolveIdentity();
    this.#openSocket(EVENTSUB_URL);
  }

  #openSocket(url) {
    this.onStatus("connecting", `Connecting to #${this.channelLogin}…`);
    const socket = new WebSocket(url);
    this.socket = socket;
    socket.addEventListener("message", (event) => this.#handleMessage(JSON.parse(event.data)));
    socket.addEventListener("close", () => this.onStatus("disconnected", "Twitch connection closed."));
    socket.addEventListener("error", () => this.onStatus("error", "Could not connect to Twitch."));
  }

  async #validateAndResolveIdentity() {
    const validation = await fetch("https://id.twitch.tv/oauth2/validate", {
      headers: { Authorization: `OAuth ${this.token}` }
    });
    if (!validation.ok) throw new Error("Twitch token is invalid or expired.");
    const tokenInfo = await validation.json();
    if (tokenInfo.client_id !== this.clientId) throw new Error("TWITCH_CLIENT_ID does not match the token.");
    if (!tokenInfo.scopes?.includes("user:read:chat")) throw new Error("Twitch token needs the user:read:chat scope.");

    const response = await fetch(`https://api.twitch.tv/helix/users?login=${encodeURIComponent(this.channelLogin)}`, {
      headers: { Authorization: `Bearer ${this.token}`, "Client-Id": this.clientId }
    });
    if (!response.ok) throw new Error("Could not find the Twitch channel.");
    const body = await response.json();
    if (!body.data?.[0]) throw new Error(`Twitch channel #${this.channelLogin} was not found.`);
    return { botUserId: tokenInfo.user_id, broadcasterUserId: body.data[0].id };
  }

  async #subscribe(sessionId) {
    const response = await fetch("https://api.twitch.tv/helix/eventsub/subscriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Client-Id": this.clientId,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        type: "channel.chat.message",
        version: "1",
        condition: {
          broadcaster_user_id: this.identity.broadcasterUserId,
          user_id: this.identity.botUserId
        },
        transport: { method: "websocket", session_id: sessionId }
      })
    });
    if (!response.ok) throw new Error(`Twitch subscription failed (${response.status}).`);
    this.onStatus("live", `Listening to #${this.channelLogin}`);
  }

  async #handleMessage(message) {
    const type = message.metadata?.message_type;
    if (type === "session_welcome") {
      try {
        await this.#subscribe(message.payload.session.id);
      } catch (error) {
        this.onStatus("error", error.message);
      }
      return;
    }
    if (type === "session_reconnect") {
      this.socket?.close();
      this.#openSocket(message.payload.session.reconnect_url);
      return;
    }
    if (type !== "notification" || message.metadata?.subscription_type !== "channel.chat.message") return;
    const event = message.payload.event;
    const answer = parseChatAnswer(event.message.text);
    if (!answer) return;
    this.onAnswer({ userId: event.chatter_user_id, displayName: event.chatter_user_name, answer });
  }
}
