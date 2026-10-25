const ANSWERS = new Set(["a", "b", "c", "d"]);

export class QuizGame {
  constructor(questions) {
    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error("At least one question is required.");
    }
    this.questions = questions;
    this.reset();
  }

  reset() {
    this.questionIndex = -1;
    this.roundOpen = false;
    this.roundStartedAt = null;
    this.roundClosedAt = null;
    this.answers = new Map();
    this.players = new Map();
    this.stats = {
      completedQuestions: 0,
      answeredQuestions: 0,
      unansweredQuestions: 0,
      totalAnswers: 0,
      correctAnswers: 0,
      wrongAnswers: 0
    };
  }

  setQuestions(questions) {
    if (!Array.isArray(questions) || questions.length === 0) throw new Error("At least one question is required.");
    if (this.questionIndex >= 0 || this.roundOpen) return false;
    this.questions = questions;
    return true;
  }

  startNext() {
    if (this.questionIndex + 1 >= this.questions.length) return false;
    this.questionIndex += 1;
    this.roundOpen = true;
    this.roundStartedAt = Date.now();
    this.roundClosedAt = null;
    this.answers = new Map();
    return true;
  }

  replayCurrent() {
    if (this.questionIndex < 0) return false;
    this.roundOpen = true;
    this.roundStartedAt = Date.now();
    this.roundClosedAt = null;
    this.answers = new Map();
    return true;
  }

  closeRound() {
    if (!this.roundOpen) return false;
    this.roundOpen = false;
    this.roundClosedAt = Date.now();
    this.stats.completedQuestions += 1;
    this.stats.totalAnswers += this.answers.size;
    if (this.answers.size > 0) this.stats.answeredQuestions += 1;
    else this.stats.unansweredQuestions += 1;
    const question = this.questions[this.questionIndex];
    for (const [userId, entry] of this.answers) {
      const correct = entry.answer === question.correct;
      const previous = this.players.get(userId) ?? {
        userId,
        displayName: entry.displayName,
        score: 0,
        streak: 0,
        correctAnswers: 0,
        wrongAnswers: 0,
        totalAnswers: 0,
        answerHistory: []
      };
      previous.displayName = entry.displayName;
      previous.correctAnswers ??= 0;
      previous.wrongAnswers ??= 0;
      previous.totalAnswers ??= previous.correctAnswers + previous.wrongAnswers;
      previous.answerHistory ??= [];
      previous.totalAnswers += 1;
      previous.streak = correct ? previous.streak + 1 : 0;
      const points = correct ? 100 + Math.min((previous.streak - 1) * 25, 100) : 0;
      if (correct) {
        this.stats.correctAnswers += 1;
        previous.correctAnswers += 1;
        previous.score += points;
      } else {
        this.stats.wrongAnswers += 1;
        previous.wrongAnswers += 1;
      }
      previous.lastResult = correct ? "correct" : "wrong";
      previous.lastPoints = points;
      previous.answerHistory.push({
        questionNumber: this.questionIndex + 1,
        prompt: question.prompt,
        translations: question.translations
          ? Object.fromEntries(Object.entries(question.translations).map(([language, value]) => [language, value.prompt]))
          : null,
        answer: entry.answer,
        correctAnswer: question.correct,
        correct,
        points
      });
      entry.correct = correct;
      entry.points = points;
      this.players.set(userId, previous);
    }
    return true;
  }

  submitAnswer({ userId, displayName, answer }) {
    const normalized = String(answer).trim().toLowerCase().replace(/^!/, "");
    if (!this.roundOpen) return { accepted: false, reason: "round_closed" };
    if (!ANSWERS.has(normalized)) return { accepted: false, reason: "invalid_answer" };
    if (this.answers.has(userId)) return { accepted: false, reason: "already_answered" };

    this.answers.set(userId, { answer: normalized, displayName });
    return { accepted: true };
  }

  publicState() {
    const question = this.questionIndex >= 0 ? this.questions[this.questionIndex] : null;
    const counts = { a: 0, b: 0, c: 0, d: 0 };
    for (const entry of this.answers.values()) counts[entry.answer] += 1;
    return {
      status: this.roundOpen ? "open" : question ? "closed" : "ready",
      roundStartedAt: this.roundStartedAt,
      roundClosedAt: this.roundClosedAt,
      questionNumber: this.questionIndex + 1,
      totalQuestions: this.questions.length,
      question: question
        ? {
            prompt: question.prompt,
            options: question.options,
            translations: question.translations ?? null,
            correct: this.roundOpen ? null : question.correct
          }
        : null,
      answerCount: this.answers.size,
      counts,
      stats: { ...this.stats },
      roundAnswers: [...this.answers.entries()].map(([userId, entry]) => ({
        userId,
        displayName: entry.displayName,
        answer: entry.answer,
        correct: this.roundOpen ? null : entry.correct,
        points: this.roundOpen ? null : entry.points
      })),
      leaderboard: [...this.players.values()]
        .sort((a, b) => b.score - a.score || b.correctAnswers - a.correctAnswers || a.displayName.localeCompare(b.displayName))
        .slice(0, 10)
    };
  }
}

export function parseChatAnswer(message) {
  // Viewers naturally type either `a` or `!a`; accept both forms.
  const match = String(message).trim().toLowerCase().match(/^!?([abcd])(?:\s|$)/);
  return match?.[1] ?? null;
}
