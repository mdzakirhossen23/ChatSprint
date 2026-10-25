# ChatSprint — Devpost submission copy

## Tagline

Turn Twitch chat into a multilingual live quiz with automatic scoring and an OBS-ready show.

## Inspiration

The best livestreams feel like a shared event, but many audience-participation tools force viewers to open another site and force streamers to manage several disconnected windows. We wanted a game that works in the chat viewers already use and gives the streamer one clear place to run the show.

## What it does

ChatSprint is a real-time quiz studio for Twitch. The host launches a multiple-choice question, and viewers answer directly in Twitch chat with A, B, C, or D. ChatSprint accepts each viewer's first answer, reveals correct and wrong verdicts, awards points and streak bonuses, and synchronizes the question and leaderboard to an OBS browser overlay.

The app also includes:

- independent auto-reveal and auto-next timers;
- an editable and searchable question bank;
- question, answer, unanswered-round, correct, and wrong totals;
- Bangla, English, Arabic, Dutch, and German controls;
- responsive desktop and mobile layouts;
- a guided Twitch/OBS setup flow;
- a built-in viewer simulator for judges who do not want to use a Twitch account;
- an optional Windows OBS Companion for one-click scene configuration and streaming control.

## How we built it

The Node.js server owns the quiz state, accepts API actions from the host, validates Twitch chat events, and persists the question bank as JSON. The Twitch client uses Helix plus EventSub WebSockets with the `channel.chat.message` subscription. The browser client uses short polling so the control room and OBS overlay stay synchronized and reliably recover on shared hosting.

The quiz engine enforces one answer per viewer, hides the correct option until reveal, records per-question verdict history, calculates streak bonuses, and publishes compact state for every view. The interface is built with responsive HTML, CSS, and vanilla JavaScript. Automated Node tests cover 19 core behaviors.

## How we used Codex

Codex was our primary build collaborator throughout the project. We used it to turn the initial product idea into a working state machine, implement and debug Twitch EventSub chat, build the OBS overlay and Windows companion, design the multilingual responsive UI, add question management and automatic language handling, create the test suite, deploy to cPanel, and run repeated live QA across the control room, Twitch chat, and OBS.

Codex also helped diagnose subtle live-state problems—for example, preserving the configured correct answer after a viewer clicks another option, ensuring reset reaches every screen, preventing stale browser cache from masking releases, and making automatic timers fire exactly once per round.

Primary Codex Session ID: `01a16deb-13cf-7051-946e-daaf110204e0`

## Challenges

The hardest part was synchronizing three different experiences: the streamer's controls, real Twitch chat, and the OBS output. Shared hosting also made long-lived browser event streams unreliable, so we changed the browser synchronization strategy to versioned short polling while keeping Twitch itself on EventSub WebSockets. Another challenge was keeping the control room readable when Twitch and OBS previews are docked beside it; responsive layouts and compact status components solved that.

## Accomplishments

- Real Twitch EventSub chat participation works live.
- The correct answer stays private until reveal.
- Each viewer receives a per-question correct/wrong history and cumulative score.
- Two optional timers can run an entire quiz after the first question starts.
- Streamers can manage multilingual questions without restarting or manually switching the UI language.
- The OBS overlay, embedded Twitch test browser, and host controls can be tested together.
- Judges can exercise the full scoring flow without any credentials.
- Nineteen automated tests pass.

## What we learned

We learned that a live-stream tool needs more than correct business logic: every state change must be obvious to the host, safe to show on stream, recoverable after refresh, and testable without a complicated account setup. We also learned how Twitch EventSub identity and chat scopes fit together, and how to design a browser-source UI that remains legible at broadcast resolution.

## What's next

- Cloud-hosted question packs and community sharing.
- Team-vs-team rounds and tournament brackets.
- More streamer-controlled animation and sound themes.
- Moderation roles and channel-point powered game actions.
- Analytics for participation, retention, and question difficulty.

## Built with

Node.js, JavaScript, HTML, CSS, Twitch Helix API, Twitch EventSub WebSockets, OBS Browser Source, OBS WebSocket, C#/.NET, and OpenAI Codex.

## Links

- Live app: https://chattprint.baharsoftbd.com/
- OBS overlay: https://chattprint.baharsoftbd.com/overlay
- Twitch channel: https://www.twitch.tv/chatsprintzakir
- Code repository: **add GitHub/GitLab/Bitbucket URL**
- YouTube demo: **add public or unlisted YouTube URL**

## Submission checklist

- [x] New project built during the submission period
- [x] Interactive Twitch chat/EventSub integration
- [x] Stream overlay
- [x] Complete local setup and judging instructions
- [x] English project description and testing instructions
- [x] Codex Session ID
- [x] License and secret-safe `.gitignore`
- [x] Passing automated tests
- [ ] Repository URL
- [ ] Public/unlisted YouTube demo under three minutes
- [ ] Devpost final submission
