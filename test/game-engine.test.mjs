import test from "node:test";
import assert from "node:assert/strict";
import { QuizGame, parseChatAnswer } from "../src/game-engine.mjs";

const questions = [{ prompt: "Test?", options: { a: "A", b: "B", c: "C", d: "D" }, correct: "b" }];

test("parses only supported chat commands", () => {
  assert.equal(parseChatAnswer("!B"), "b");
  assert.equal(parseChatAnswer(" !a "), "a");
  assert.equal(parseChatAnswer("a"), "a");
  assert.equal(parseChatAnswer(" C "), "c");
  assert.equal(parseChatAnswer("hello !a"), null);
  assert.equal(parseChatAnswer("answer a"), null);
  assert.equal(parseChatAnswer("!e"), null);
});

test("accepts one answer per viewer in a round", () => {
  const game = new QuizGame(questions);
  game.startNext();
  assert.equal(game.submitAnswer({ userId: "1", displayName: "Zakir", answer: "!b" }).accepted, true);
  assert.equal(game.submitAnswer({ userId: "1", displayName: "Zakir", answer: "!a" }).reason, "already_answered");
  assert.equal(game.publicState().answerCount, 1);
});

test("publishes the round start time for a persistent answer timer", () => {
  const game = new QuizGame(questions);
  assert.equal(game.publicState().roundStartedAt, null);
  game.startNext();
  assert.equal(typeof game.publicState().roundStartedAt, "number");
  assert.ok(game.publicState().roundStartedAt <= Date.now());
});

test("publishes the round close time for a persistent next-question timer", () => {
  const game = new QuizGame(questions);
  assert.equal(game.publicState().roundClosedAt, null);
  game.startNext();
  assert.equal(game.publicState().roundClosedAt, null);
  game.closeRound();
  assert.equal(typeof game.publicState().roundClosedAt, "number");
  assert.ok(game.publicState().roundClosedAt <= Date.now());
});

test("scores correct answers and reveals the answer only after closing", () => {
  const game = new QuizGame(questions);
  game.startNext();
  const result = game.submitAnswer({ userId: "1", displayName: "Bahar", answer: "b" });
  assert.deepEqual(result, { accepted: true });
  assert.deepEqual(game.publicState().leaderboard, []);
  assert.equal(game.publicState().question.correct, null);
  game.closeRound();
  assert.equal(game.publicState().question.correct, "b");
  assert.equal(game.publicState().leaderboard[0].score, 100);
});

test("does not publish the current round score before the host reveals the result", () => {
  const game = new QuizGame(questions);
  game.startNext();
  game.submitAnswer({ userId: "1", displayName: "Viewer", answer: "b" });
  assert.equal(game.publicState().answerCount, 1);
  assert.equal(game.publicState().question.correct, null);
  assert.equal(game.publicState().leaderboard.length, 0);
  game.closeRound();
  assert.equal(game.publicState().leaderboard[0].score, 100);
});

test("marks correct and wrong answers and only scores the correct viewer", () => {
  const game = new QuizGame(questions);
  game.startNext();
  game.submitAnswer({ userId: "correct", displayName: "CorrectViewer", answer: "b" });
  game.submitAnswer({ userId: "wrong", displayName: "WrongViewer", answer: "c" });
  assert.deepEqual(game.publicState().roundAnswers.map((entry) => entry.correct), [null, null]);
  game.closeRound();
  const state = game.publicState();
  assert.deepEqual(state.roundAnswers.map(({ displayName, correct, points }) => ({ displayName, correct, points })), [
    { displayName: "CorrectViewer", correct: true, points: 100 },
    { displayName: "WrongViewer", correct: false, points: 0 }
  ]);
  assert.deepEqual(state.leaderboard.map(({ displayName, score, lastResult }) => ({ displayName, score, lastResult })), [
    { displayName: "CorrectViewer", score: 100, lastResult: "correct" },
    { displayName: "WrongViewer", score: 0, lastResult: "wrong" }
  ]);
});

test("keeps the configured correct answer fixed when a viewer chooses another option", () => {
  const game = new QuizGame(questions);
  game.startNext();
  assert.equal(game.publicState().question.correct, null);
  game.submitAnswer({ userId: "viewer", displayName: "Viewer", answer: "a" });
  assert.equal(game.publicState().question.correct, null);
  game.closeRound();
  const state = game.publicState();
  assert.equal(state.question.correct, "b");
  assert.equal(state.roundAnswers[0].correct, false);
  assert.equal(state.roundAnswers[0].points, 0);
});

test("replays the same question without changing its correct answer", () => {
  const game = new QuizGame(questions);
  game.startNext();
  game.submitAnswer({ userId: "viewer", displayName: "Viewer", answer: "a" });
  game.closeRound();
  assert.equal(game.publicState().question.correct, "b");

  assert.equal(game.replayCurrent(), true);
  const replay = game.publicState();
  assert.equal(replay.questionNumber, 1);
  assert.equal(replay.question.correct, null);
  assert.equal(replay.answerCount, 0);

  game.submitAnswer({ userId: "viewer", displayName: "Viewer", answer: "b" });
  game.closeRound();
  const result = game.publicState();
  assert.equal(result.questionNumber, 1);
  assert.equal(result.question.correct, "b");
  assert.equal(result.roundAnswers[0].correct, true);
  assert.equal(result.leaderboard[0].correctAnswers, 1);
  assert.equal(result.leaderboard[0].wrongAnswers, 1);
  assert.equal(result.leaderboard[0].totalAnswers, 2);
  assert.equal(result.leaderboard[0].score, 100);
  assert.deepEqual(result.leaderboard[0].answerHistory, [
    { questionNumber: 1, prompt: "Test?", translations: null, answer: "a", correctAnswer: "b", correct: false, points: 0 },
    { questionNumber: 1, prompt: "Test?", translations: null, answer: "b", correctAnswer: "b", correct: true, points: 100 }
  ]);
});

test("keeps the question number, question text and verdict for every answer", () => {
  const game = new QuizGame([
    ...questions,
    { prompt: "Second?", options: { a: "A", b: "B", c: "C", d: "D" }, correct: "c" }
  ]);
  game.startNext();
  game.submitAnswer({ userId: "viewer", displayName: "Viewer", answer: "a" });
  game.closeRound();
  game.startNext();
  game.submitAnswer({ userId: "viewer", displayName: "Viewer", answer: "c" });
  game.closeRound();

  assert.deepEqual(game.publicState().leaderboard[0].answerHistory.map(({ questionNumber, prompt, correct }) => ({ questionNumber, prompt, correct })), [
    { questionNumber: 1, prompt: "Test?", correct: false },
    { questionNumber: 2, prompt: "Second?", correct: true }
  ]);
});

test("rejects answers while the round is closed", () => {
  const game = new QuizGame(questions);
  assert.equal(game.submitAnswer({ userId: "1", displayName: "Viewer", answer: "a" }).reason, "round_closed");
});

test("reset clears a completed round and starts the first question fresh", () => {
  const game = new QuizGame(questions);
  game.startNext();
  game.submitAnswer({ userId: "1", displayName: "Viewer", answer: "b" });
  game.closeRound();
  assert.equal(game.publicState().leaderboard[0].score, 100);

  game.reset();
  assert.deepEqual(game.publicState(), {
    status: "ready",
    roundStartedAt: null,
    roundClosedAt: null,
    questionNumber: 0,
    totalQuestions: 1,
    question: null,
    answerCount: 0,
    counts: { a: 0, b: 0, c: 0, d: 0 },
    stats: {
      completedQuestions: 0,
      answeredQuestions: 0,
      unansweredQuestions: 0,
      totalAnswers: 0,
      correctAnswers: 0,
      wrongAnswers: 0
    },
    roundAnswers: [],
    leaderboard: []
  });

  assert.equal(game.startNext(), true);
  assert.equal(game.publicState().questionNumber, 1);
  assert.equal(game.publicState().answerCount, 0);
  assert.deepEqual(game.publicState().leaderboard, []);
});

test("counts questions, answers, unanswered rounds, correct and wrong answers", () => {
  const game = new QuizGame([
    ...questions,
    { prompt: "Second?", options: { a: "A", b: "B", c: "C", d: "D" }, correct: "c" }
  ]);
  game.startNext();
  game.submitAnswer({ userId: "1", displayName: "Correct", answer: "b" });
  game.submitAnswer({ userId: "2", displayName: "Wrong", answer: "a" });
  game.closeRound();
  game.startNext();
  game.closeRound();
  assert.deepEqual(game.publicState().stats, {
    completedQuestions: 2,
    answeredQuestions: 1,
    unansweredQuestions: 1,
    totalAnswers: 2,
    correctAnswers: 1,
    wrongAnswers: 1
  });
});

test("reset clears scores after multiple questions", () => {
  const multiQuestionGame = new QuizGame([
    ...questions,
    { prompt: "Second?", options: { a: "A", b: "B", c: "C", d: "D" }, correct: "c" }
  ]);

  multiQuestionGame.startNext();
  multiQuestionGame.submitAnswer({ userId: "1", displayName: "Viewer", answer: "b" });
  multiQuestionGame.closeRound();
  multiQuestionGame.startNext();
  multiQuestionGame.submitAnswer({ userId: "1", displayName: "Viewer", answer: "c" });
  multiQuestionGame.closeRound();
  assert.equal(multiQuestionGame.publicState().leaderboard[0].score, 225);

  multiQuestionGame.reset();
  const state = multiQuestionGame.publicState();
  assert.equal(state.status, "ready");
  assert.equal(state.question, null);
  assert.equal(state.answerCount, 0);
  assert.deepEqual(state.roundAnswers, []);
  assert.deepEqual(state.leaderboard, []);
});

test("replaces the question bank only while the game is ready", () => {
  const game = new QuizGame(questions);
  const replacement = [{ prompt: "New?", options: { a: "1", b: "2", c: "3", d: "4" }, correct: "a" }];
  assert.equal(game.setQuestions(replacement), true);
  assert.equal(game.publicState().totalQuestions, 1);
  game.startNext();
  assert.equal(game.setQuestions(questions), false);
  assert.equal(game.publicState().question.prompt, "New?");
});
