# Judge testing guide

## Fastest path: live demo

1. Open https://chattprint.baharsoftbd.com/.
2. Select **Live Studio**.
3. Select **Start first question**.
4. In the viewer panel, keep `TestViewer` or enter another name and choose `!a`, `!b`, `!c`, or `!d`.
5. The demo reveals the verdict and updates the score and game totals.
6. Select **Start next question** to continue.
7. Open https://chattprint.baharsoftbd.com/overlay in another tab to verify the broadcast view.

## Automatic mode

- Set **Answer time** and leave **Auto reveal** enabled.
- Set **Next question delay** and leave **Auto next** enabled.
- Start the first question once. ChatSprint will reveal each result and advance until the question bank is finished.
- Either automatic option can be disabled; the host buttons remain available for manual control.

## Twitch mode

1. Start a question in ChatSprint.
2. From any logged-in Twitch viewer account, send `a`, `b`, `c`, or `d` in the `chatsprintzakir` channel chat. Prefixing with `!` also works.
3. Confirm that the viewer appears in ChatSprint.
4. Reveal the answer and confirm that the same verdict and leaderboard appear in the OBS overlay.

## Local test

```bash
npm ci
npm test
npm start
```

Then open http://127.0.0.1:3000. Twitch credentials are optional.

## Expected automated result

The suite should report 19 passing tests and zero failures.
