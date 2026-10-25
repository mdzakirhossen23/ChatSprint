# ChatSprint architecture

## Runtime components

1. **Host control room** (`public/index.html`, `public/app.js`) controls questions, timers, question-bank editing, live setup, and the test viewer.
2. **Quiz engine** (`src/game-engine.mjs`) owns the current round, first-answer rule, scoring, history, totals, and reset behavior.
3. **Twitch client** (`src/twitch-client.mjs`) validates the OAuth token, resolves the broadcaster, connects to EventSub WebSockets, and consumes `channel.chat.message` events.
4. **OBS overlay** (`public/overlay.html`, `public/overlay.js`) renders the current question, option counts, revealed result, and leaderboard without exposing host controls.
5. **Question store** (`src/question-store.mjs`) persists editable questions in `data/questions.json`.
6. **Optional OBS Companion** (`companion/`) configures the Browser Source and controls OBS through its local WebSocket API on Windows.

## Round lifecycle

```text
READY → OPEN → CLOSED → OPEN (next question) → …
```

- **READY:** no active question; the host can edit questions or start the first round.
- **OPEN:** Twitch answers are accepted. Only the first valid answer per viewer counts.
- **CLOSED:** the correct answer and verdicts are published, scores are awarded, and the next-question timer may start.
- **RESET:** returns to READY and clears scores, answer history, and game totals.

## Synchronization

`GET /api/state` returns the authoritative state and a monotonically increasing version. Clients poll it with `Cache-Control: no-store`. This avoids long-lived proxy connections on shared cPanel hosting and lets an overlay recover after a refresh.

## Security

- Twitch credentials come only from environment variables.
- `.env` and logs are excluded from Git.
- The public state hides the configured correct option while a round is open.
- Viewer display names and question text are HTML-escaped before rendering.
- The repository contains no stream key, OAuth token, password, or private Twitch credential.
