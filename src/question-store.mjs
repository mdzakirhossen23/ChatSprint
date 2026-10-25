import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

const ANSWERS = new Set(["a", "b", "c", "d"]);
const LANGUAGES = new Set(["bn", "en", "ar", "nl", "de"]);

const LANGUAGE_WORDS = {
  nl: new Set(["wat", "welke", "welk", "wie", "waar", "wanneer", "waarom", "zijn", "het", "een", "antwoord", "juist"]),
  de: new Set(["was", "welche", "welcher", "welches", "wer", "wo", "wann", "warum", "ist", "sind", "der", "die", "das", "eine", "antwort", "richtig"])
};

export function detectQuestionLanguage(value, fallback = "en") {
  const text = String(value ?? "").trim();
  if (/[\u0980-\u09ff]/u.test(text)) return "bn";
  if (/[\u0600-\u06ff]/u.test(text)) return "ar";
  if (/[äöüß]/iu.test(text)) return "de";

  const words = text.toLocaleLowerCase().match(/[\p{L}]+/gu) || [];
  const scores = Object.fromEntries(Object.entries(LANGUAGE_WORDS).map(([language, vocabulary]) => [language, words.filter((word) => vocabulary.has(word)).length]));
  if (scores.de >= 2 && scores.de > scores.nl) return "de";
  if (scores.nl >= 2 && scores.nl > scores.de) return "nl";
  if (/[a-z]/iu.test(text)) return "en";
  return LANGUAGES.has(fallback) ? fallback : "en";
}

function cleanText(value, name) {
  const text = String(value ?? "").trim();
  if (!text) throw new Error(`${name} is required.`);
  if (text.length > 300) throw new Error(`${name} is too long.`);
  return text;
}

function normalizeQuestion(question) {
  const correct = String(question.correct || "").toLowerCase();
  if (!ANSWERS.has(correct)) throw new Error("Correct answer must be a, b, c or d.");
  const prompt = cleanText(question.prompt, "Question");
  const options = Object.fromEntries(["a", "b", "c", "d"].map((key) => [key, cleanText(question.options?.[key], `Option ${key.toUpperCase()}`)]));
  const translations = {};
  for (const [language, value] of Object.entries(question.translations || {})) {
    if (!LANGUAGES.has(language)) continue;
    translations[language] = {
      prompt: cleanText(value.prompt, "Question"),
      options: Object.fromEntries(["a", "b", "c", "d"].map((key) => [key, cleanText(value.options?.[key], `Option ${key.toUpperCase()}`)]))
    };
  }
  return { id: String(question.id || randomUUID()), prompt, options, translations, correct };
}

export class QuestionStore {
  constructor(file, defaults) {
    this.file = file;
    this.defaults = defaults;
    this.questions = [];
  }

  async load() {
    try {
      const stored = JSON.parse(await readFile(this.file, "utf8"));
      this.questions = stored.map(normalizeQuestion);
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
      this.questions = this.defaults.map(normalizeQuestion);
      await this.save();
    }
    if (!this.questions.length) throw new Error("At least one question is required.");
    return this.list();
  }

  list() {
    return structuredClone(this.questions);
  }

  async add({ language, prompt, options, correct }) {
    const question = this.#fromEditor({ language, prompt, options, correct });
    this.questions.push(question);
    await this.save();
    return structuredClone(question);
  }

  async update(id, { language, prompt, options, correct }) {
    const index = this.questions.findIndex((question) => question.id === id);
    if (index < 0) throw new Error("Question not found.");
    const current = this.questions[index];
    const localized = this.#editorFields({ language, prompt, options, correct });
    current.translations[localized.language] = { prompt: localized.prompt, options: localized.options };
    current.prompt = localized.prompt;
    current.options = localized.options;
    current.correct = localized.correct;
    this.questions[index] = normalizeQuestion(current);
    await this.save();
    return structuredClone(this.questions[index]);
  }

  async remove(id) {
    if (this.questions.length === 1) throw new Error("At least one question must remain.");
    const index = this.questions.findIndex((question) => question.id === id);
    if (index < 0) throw new Error("Question not found.");
    const [removed] = this.questions.splice(index, 1);
    await this.save();
    return structuredClone(removed);
  }

  #fromEditor(input) {
    const value = this.#editorFields(input);
    const translations = Object.fromEntries([...LANGUAGES].map((language) => [language, { prompt: value.prompt, options: value.options }]));
    return normalizeQuestion({ prompt: value.prompt, options: value.options, translations, correct: value.correct });
  }

  #editorFields({ language, prompt, options, correct }) {
    const combinedText = [prompt, ...Object.values(options || {})].join(" ");
    const safeLanguage = detectQuestionLanguage(combinedText, language);
    const requestedCorrect = String(correct || "").trim().toLowerCase();
    const safeCorrect = requestedCorrect.match(/[a-d]/)?.[0] || "a";
    return {
      language: safeLanguage,
      prompt: cleanText(prompt, "Question"),
      options: Object.fromEntries(["a", "b", "c", "d"].map((key) => [key, cleanText(options?.[key], `Option ${key.toUpperCase()}`)])),
      correct: safeCorrect
    };
  }

  async save() {
    await mkdir(dirname(this.file), { recursive: true });
    const temporary = `${this.file}.tmp`;
    await writeFile(temporary, `${JSON.stringify(this.questions, null, 2)}\n`, "utf8");
    await rename(temporary, this.file);
  }
}
