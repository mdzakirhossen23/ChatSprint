import http from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { QuizGame } from "./game-engine.mjs";
import { replaceQuestionBank } from "./question-bank-sync.mjs";
import { questions } from "./questions.mjs";
import { QuestionStore } from "./question-store.mjs";
import { TwitchChatClient } from "./twitch-client.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const publicDir = join(root, "public");
const port = Number(process.env.PORT || 3000);
const host = process.env.HOST || "127.0.0.1";
const questionStore = new QuestionStore(join(root, "data", "questions.json"), questions);
const game = new QuizGame(await questionStore.load());
const streams = new Set();
let connection = { state: "demo", message: "Demo Mode is active." };
let stateVersion = 0;

const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml"
};

function snapshot() {
  return { ...game.publicState(), connection, version: stateVersion };
}

function broadcast() {
  const payload = `data: ${JSON.stringify(snapshot())}\n\n`;
  for (const stream of streams) stream.write(payload);
}

function syncQuestionBank() {
  replaceQuestionBank(game, questionStore.list());
  stateVersion += 1;
  broadcast();
}

function json(response, status, body) {
  response.writeHead(status, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
  response.end(JSON.stringify(body));
}

async function readBody(request) {
  let value = "";
  for await (const chunk of request) {
    value += chunk;
    if (value.length > 10_000) throw new Error("Request is too large.");
  }
  return value ? JSON.parse(value) : {};
}

async function serveStatic(pathname, response) {
  const routes = { "/": "index.html", "/overlay": "overlay.html", "/compare": "compare.html" };
  const file = routes[pathname] || pathname.slice(1);
  if (!/^[a-zA-Z0-9._/-]+$/.test(file) || file.includes("..")) return false;
  try {
    const content = await readFile(join(publicDir, file));
    const headers = { "Content-Type": mime[extname(file)] || "application/octet-stream" };
    if (file === "overlay.html" || file === "overlay.js") {
      headers["Cache-Control"] = "no-store, no-cache, must-revalidate";
      headers.Pragma = "no-cache";
      headers.Expires = "0";
    }
    response.writeHead(200, headers);
    response.end(content);
    return true;
  } catch {
    return false;
  }
}

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url, `http://${request.headers.host}`);
  try {
    if (request.method === "GET" && url.pathname === "/api/state") return json(response, 200, snapshot());
    if (request.method === "GET" && url.pathname === "/api/questions") return json(response, 200, { questions: questionStore.list() });
    if (request.method === "GET" && url.pathname === "/events") {
      // Event streams can occupy the limited proxy slots on shared cPanel hosting.
      // Current clients use short polling, and 204 also tells older EventSource clients
      // to stop reconnecting instead of keeping the application unavailable.
      response.writeHead(204, { "Cache-Control": "no-store" });
      return response.end();
    }
    if (request.method === "POST" && url.pathname === "/api/next") {
      const advanced = game.startNext();
      if (advanced) stateVersion += 1;
      broadcast();
      return json(response, advanced ? 200 : 409, { ok: advanced, state: snapshot() });
    }
    if (request.method === "POST" && url.pathname === "/api/close") {
      if (game.closeRound()) stateVersion += 1;
      broadcast();
      return json(response, 200, { ok: true, state: snapshot() });
    }
    if (request.method === "POST" && url.pathname === "/api/replay") {
      const replayed = game.replayCurrent();
      if (replayed) stateVersion += 1;
      broadcast();
      return json(response, replayed ? 200 : 409, { ok: replayed, state: snapshot() });
    }
    if (request.method === "POST" && url.pathname === "/api/reset") {
      game.reset();
      stateVersion += 1;
      broadcast();
      return json(response, 200, { ok: true, state: snapshot() });
    }
    if (request.method === "POST" && url.pathname === "/api/demo-answer") {
      const body = await readBody(request);
      const displayName = String(body.displayName || "Viewer").slice(0, 25);
      const result = game.submitAnswer({ userId: `demo:${displayName.toLowerCase()}`, displayName, answer: body.answer });
      if (result.accepted) stateVersion += 1;
      broadcast();
      return json(response, result.accepted ? 200 : 409, { ...result, state: snapshot() });
    }
    if (request.method === "POST" && url.pathname === "/api/questions") {
      const question = await questionStore.add(await readBody(request));
      syncQuestionBank();
      return json(response, 201, { ok: true, question, state: snapshot() });
    }
    const questionRoute = url.pathname.match(/^\/api\/questions\/([a-zA-Z0-9-]+)$/);
    if (questionRoute && request.method === "PUT") {
      const question = await questionStore.update(questionRoute[1], await readBody(request));
      syncQuestionBank();
      return json(response, 200, { ok: true, question, state: snapshot() });
    }
    if (questionRoute && request.method === "DELETE") {
      const question = await questionStore.remove(questionRoute[1]);
      syncQuestionBank();
      return json(response, 200, { ok: true, question, state: snapshot() });
    }
    if (request.method === "GET" && (await serveStatic(url.pathname, response))) return;
    json(response, 404, { error: "Not found" });
  } catch (error) {
    json(response, 400, { error: error.message });
  }
});

const twitch = new TwitchChatClient({
  clientId: process.env.TWITCH_CLIENT_ID,
  token: process.env.TWITCH_USER_TOKEN,
  channelLogin: process.env.TWITCH_CHANNEL_LOGIN,
  onAnswer: (entry) => {
    const result = game.submitAnswer(entry);
    if (result.accepted) stateVersion += 1;
    broadcast();
  },
  onStatus: (state, message) => {
    connection = { state, message };
    stateVersion += 1;
    broadcast();
  }
});

server.listen(port, host, async () => {
  console.log(`ChatSprint is listening on ${host}:${port}`);
  console.log("OBS overlay path: /overlay");
  try {
    await twitch.connect();
  } catch (error) {
    connection = { state: "error", message: error.message };
    broadcast();
    console.error(`Twitch: ${error.message}`);
  }
});
