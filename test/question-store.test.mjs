import test from "node:test";
import assert from "node:assert/strict";
import { mkdir, mkdtemp, rm } from "node:fs/promises";
import { join } from "node:path";
import { QuestionStore, detectQuestionLanguage } from "../src/question-store.mjs";

const seed = [{ prompt: "Seed?", options: { a: "A", b: "B", c: "C", d: "D" }, correct: "a" }];

test("detects all supported question languages without changing the interface", () => {
  assert.equal(detectQuestionLanguage("বাংলাদেশের রাজধানী কী?"), "bn");
  assert.equal(detectQuestionLanguage("ما هي عاصمة بنغلاديش؟"), "ar");
  assert.equal(detectQuestionLanguage("What is the capital of Bangladesh?", "bn"), "en");
  assert.equal(detectQuestionLanguage("Wat is het juiste antwoord?", "en"), "nl");
  assert.equal(detectQuestionLanguage("Was ist die richtige Antwort?", "en"), "de");
});

test("uses the detected language when editing and repairs a missing correct answer", async () => {
  const testRoot = join(process.cwd(), "work", "test-data");
  await mkdir(testRoot, { recursive: true });
  const folder = await mkdtemp(join(testRoot, "chatsprint-language-"));
  const file = join(folder, "questions.json");
  try {
    const store = new QuestionStore(file, seed);
    await store.load();
    const original = store.list()[0];
    const edited = await store.update(original.id, {
      language: "en",
      prompt: "বাংলাদেশের রাজধানী কী?",
      options: { a: "ঢাকা", b: "চট্টগ্রাম", c: "খুলনা", d: "রাজশাহী" },
      correct: ""
    });
    assert.equal(edited.translations.bn.prompt, "বাংলাদেশের রাজধানী কী?");
    assert.equal(edited.correct, "a");
  } finally {
    await rm(folder, { recursive: true, force: true });
  }
});

test("adds, edits, deletes and persists questions", async () => {
  const testRoot = join(process.cwd(), "work", "test-data");
  await mkdir(testRoot, { recursive: true });
  const folder = await mkdtemp(join(testRoot, "chatsprint-"));
  const file = join(folder, "questions.json");
  try {
    const store = new QuestionStore(file, seed);
    await store.load();
    const added = await store.add({ language: "bn", prompt: "নতুন?", options: { a: "ক", b: "খ", c: "গ", d: "ঘ" }, correct: "b" });
    assert.equal(store.list().length, 2);
    await store.update(added.id, { language: "en", prompt: "New?", options: { a: "One", b: "Two", c: "Three", d: "Four" }, correct: "c" });
    assert.equal(store.list()[1].translations.en.prompt, "New?");
    assert.equal(store.list()[1].correct, "c");
    await store.remove(added.id);
    const reloaded = new QuestionStore(file, []);
    await reloaded.load();
    assert.equal(reloaded.list().length, 1);
  } finally {
    await rm(folder, { recursive: true, force: true });
  }
});
