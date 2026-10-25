import { translations } from "./i18n.js";

const stateEl = document.querySelector("#state");
const questionEl = document.querySelector("#question");
const optionsEl = document.querySelector("#options");
const leaderboardEl = document.querySelector("#leaderboard");
const countEl = document.querySelector("#answer-count");
const leaderboardLabelEl = document.querySelector("#leaderboard-label");

const verdictCopy = {
  bn: { correct: "সত্য", wrong: "ভুল" },
  en: { correct: "CORRECT", wrong: "WRONG" },
  ar: { correct: "صحيح", wrong: "خطأ" },
  nl: { correct: "JUIST", wrong: "FOUT" },
  de: { correct: "RICHTIG", wrong: "FALSCH" }
};

const scoreCopy = {
  bn: { correct: "সঠিক", wrong: "ভুল", answers: "উত্তর", question: "প্রশ্ন", reconnecting: "আবার সংযোগ হচ্ছে…" },
  en: { correct: "Correct", wrong: "Wrong", answers: "Answers", question: "Question", reconnecting: "Reconnecting…" },
  ar: { correct: "صحيح", wrong: "خطأ", answers: "إجابات", question: "السؤال", reconnecting: "جارٍ إعادة الاتصال…" },
  nl: { correct: "Juist", wrong: "Fout", answers: "Antwoorden", question: "Vraag", reconnecting: "Opnieuw verbinden…" },
  de: { correct: "Richtig", wrong: "Falsch", answers: "Antworten", question: "Frage", reconnecting: "Verbindung wird wiederhergestellt…" }
};

function getLanguage() {
  try {
    const saved = localStorage.getItem("chatsprint-language");
    return translations[saved] ? saved : "en";
  } catch {
    return "en";
  }
}

let language = getLanguage();
let t = translations[language];
let labels = scoreCopy[language];
let latestState = null;

function applyLanguage(nextLanguage) {
  if (!translations[nextLanguage]) return;
  language = nextLanguage;
  t = translations[language];
  labels = scoreCopy[language];
  document.documentElement.lang = language;
  document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  document.title = t.title;
  leaderboardLabelEl.textContent = t.leaderboard;
}

applyLanguage(language);

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
}

function render(state) {
  latestState = state;
  stateEl.textContent = state.status === "open" ? t.live : state.status === "closed" ? t.revealed : t.ready;
  stateEl.dataset.status = state.status;
  countEl.textContent = state.answerCount === 1 ? t.oneAnswer : t.answers(state.answerCount);

  const localizedQuestion = state.question?.translations?.[language];
  questionEl.textContent = localizedQuestion?.prompt || state.question?.prompt || t.waiting;
  const optionValues = localizedQuestion?.options || state.question?.options;
  optionsEl.innerHTML = state.question
    ? Object.entries(optionValues).map(([key, value]) => `
        <li class="option ${state.status === "closed" && state.question.correct === key ? "correct" : state.status === "closed" && state.counts[key] ? "wrong" : ""}">
          <span>${key.toUpperCase()}</span><strong>${escapeHtml(value)}</strong><small>${state.counts[key] || 0}</small>
        </li>`).join("")
    : "";

  leaderboardEl.innerHTML = state.leaderboard.length
    ? state.leaderboard.map((player, index) => {
        const verdict = state.status === "closed" && player.lastResult
          ? `<em class="verdict ${player.lastResult}">${escapeHtml(verdictCopy[language][player.lastResult])}</em>`
          : "";
        const correctAnswers = player.correctAnswers || 0;
        const wrongAnswers = player.wrongAnswers || 0;
        const totalAnswers = player.totalAnswers ?? correctAnswers + wrongAnswers;
        const history = (player.answerHistory || []).map((item) => {
          const prompt = item.translations?.[language] || item.prompt;
          const result = item.correct ? "correct" : "wrong";
          return `<span class="answer-history-item ${result}"><span class="history-question"><b>${escapeHtml(labels.question)} ${item.questionNumber}:</b> ${escapeHtml(prompt)}</span><em class="verdict ${result}">${escapeHtml(verdictCopy[language][result])}</em></span>`;
        }).join("");
        return `<li class="leaderboard-player"><span class="player-heading"><b class="player-rank">${index + 1}</b><span class="player-name">${escapeHtml(player.displayName)}</span><strong class="player-score">${player.score}</strong></span><span class="player-meta">${verdict}<small class="score-details"><span class="score-detail correct">${labels.correct} ${correctAnswers}</span><span class="score-detail wrong">${labels.wrong} ${wrongAnswers}</span><span class="score-detail answered">${labels.answers} ${totalAnswers}</span></small></span>${history ? `<span class="answer-history">${history}</span>` : ""}</li>`;
      }).join("")
    : `<li class="empty">${escapeHtml(t.scoresEmpty)}</li>`;
}

function syncLanguage(nextLanguage) {
  if (!translations[nextLanguage] || nextLanguage === language) return;
  applyLanguage(nextLanguage);
  if (latestState) render(latestState);
}

window.addEventListener("storage", (event) => {
  if (event.key === "chatsprint-language") syncLanguage(event.newValue);
});

window.addEventListener("message", (event) => {
  if (event.origin !== window.location.origin || event.data?.type !== "chatsprint-language") return;
  syncLanguage(event.data.language);
});

let requestInProgress = false;

async function refreshState() {
  if (requestInProgress) return;
  requestInProgress = true;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4500);
  try {
    const response = await fetch(`/api/state?overlay=${Date.now()}`, {
      cache: "no-store",
      signal: controller.signal
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const state = await response.json();
    // Requests never overlap, so every successful response is the newest state we
    // know about. Always render it: the server's version counter starts from zero
    // after a restart, and rejecting a lower number would leave OBS frozen on the
    // question that was visible before the restart.
    render(state);
  } catch {
    stateEl.textContent = labels.reconnecting;
  } finally {
    clearTimeout(timeout);
    requestInProgress = false;
  }
}

refreshState();
setInterval(refreshState, 1200);
