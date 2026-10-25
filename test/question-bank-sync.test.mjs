import test from "node:test";
import assert from "node:assert/strict";
import { QuizGame } from "../src/game-engine.mjs";
import { replaceQuestionBank } from "../src/question-bank-sync.mjs";

const first = { prompt: "First?", options: { a: "A", b: "B", c: "C", d: "D" }, correct: "a" };
const second = { prompt: "Second?", options: { a: "1", b: "2", c: "3", d: "4" }, correct: "b" };

test("question bank changes automatically reset an active game", () => {
  const game = new QuizGame([first]);
  game.startNext();
  assert.equal(game.publicState().status, "open");

  const state = replaceQuestionBank(game, [first, second]);

  assert.equal(state.status, "ready");
  assert.equal(state.question, null);
  assert.equal(state.totalQuestions, 2);
  assert.deepEqual(state.leaderboard, []);
});
