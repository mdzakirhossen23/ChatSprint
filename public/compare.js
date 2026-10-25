import { translations } from "./i18n.js";

const copy = {
  bn: { title: "ChatSprint — পাশাপাশি তিনটি অংশ", tag: "একসাথে যুক্ত তিনটি অংশ", heading: "সম্পূর্ণ কাজটি পাশাপাশি বুঝুন", description: "বামে হোস্ট প্রশ্ন চালান, মাঝখানে দর্শক Twitch চ্যাটে উত্তর দেন, ডানে OBS-তে ফল দেখা যায়। তিনটি অংশই একসঙ্গে আপডেট হয়।", back: "← কন্ট্রোল রুমে ফিরুন", hostTitle: "স্ট্রিমার কন্ট্রোল রুম", hostDescription: "হোস্ট এখান থেকে প্রশ্ন চালু করেন, সঠিক উত্তর দেখান এবং গেম রিসেট করেন।", hostBadge: "১. প্রশ্ন পরিচালনা", chatTitle: "Twitch চ্যাট", chatDescription: "দর্শক !a, !b, !c বা !d লিখে উত্তর দেন। এখান থেকে পুরো কাজটি পরীক্ষা করুন।", chatBadge: "২. দর্শকের উত্তর", chatRoom: "লাইভ চ্যাট", chatHint: "নিচের একটি উত্তর চাপুন। Twitch চ্যাটের মতো বার্তাটি এখানে দেখা যাবে।", chatName: "দর্শকের নাম", chatSent: "চ্যাট উত্তর পাঠানো হয়েছে", audienceTitle: "OBS সম্প্রচার ওভারলে", audienceDescription: "লাইভ সম্প্রচারে প্রশ্ন, উত্তরসংখ্যা, স্কোর ও লিডারবোর্ড দেখা যায়।", audienceBadge: "৩. সম্প্রচারের ফল" },
  en: { title: "ChatSprint — Three connected parts", tag: "THREE CONNECTED PARTS", heading: "Understand the complete flow side by side", description: "The host starts a question on the left, viewers answer in Twitch chat in the middle, and OBS shows the result on the right. All three update together.", back: "← Back to control room", hostTitle: "Streamer Control Room", hostDescription: "The host starts questions, reveals answers and resets the game.", hostBadge: "1. CONTROL", chatTitle: "Twitch Chat", chatDescription: "Viewers answer with !a, !b, !c or !d. Test the complete flow here.", chatBadge: "2. VIEWER ANSWER", chatRoom: "LIVE CHAT", chatHint: "Choose an answer below. It will appear here like a Twitch chat message.", chatName: "Viewer name", chatSent: "Chat answer sent", audienceTitle: "OBS Broadcast Overlay", audienceDescription: "The broadcast shows the question, answer count, scores and leaderboard live.", audienceBadge: "3. BROADCAST RESULT" },
  ar: { title: "ChatSprint — ثلاثة أجزاء مترابطة", tag: "ثلاثة أجزاء مترابطة", heading: "افهم سير العمل كاملًا جنبًا إلى جنب", description: "يبدأ المضيف السؤال يسارًا، ويجيب المشاهد في دردشة Twitch بالوسط، وتظهر النتيجة في OBS يمينًا. تتحدث الأجزاء معًا.", back: "العودة إلى غرفة التحكم →", hostTitle: "غرفة تحكم البث", hostDescription: "يبدأ المضيف الأسئلة ويكشف الإجابات ويعيد ضبط اللعبة.", hostBadge: "١. التحكم", chatTitle: "دردشة Twitch", chatDescription: "يجيب المشاهدون باستخدام !a أو !b أو !c أو !d. اختبر المسار كاملًا هنا.", chatBadge: "٢. إجابة المشاهد", chatRoom: "الدردشة المباشرة", chatHint: "اختر إجابة أدناه لتظهر كرسالة في دردشة Twitch.", chatName: "اسم المشاهد", chatSent: "تم إرسال إجابة الدردشة", audienceTitle: "طبقة بث OBS", audienceDescription: "يعرض البث السؤال وعدد الإجابات والنتائج ولوحة المتصدرين مباشرة.", audienceBadge: "٣. نتيجة البث" },
  nl: { title: "ChatSprint — Drie verbonden onderdelen", tag: "DRIE VERBONDEN ONDERDELEN", heading: "Begrijp de volledige stroom naast elkaar", description: "Links start de host de vraag, in het midden antwoordt de kijker via Twitch-chat en rechts toont OBS het resultaat. Alles werkt samen.", back: "← Terug naar de bediening", hostTitle: "Streamerbediening", hostDescription: "De host start vragen, toont antwoorden en reset het spel.", hostBadge: "1. BEDIENING", chatTitle: "Twitch-chat", chatDescription: "Kijkers antwoorden met !a, !b, !c of !d. Test hier de volledige stroom.", chatBadge: "2. KIJKERSANTWOORD", chatRoom: "LIVE CHAT", chatHint: "Kies hieronder een antwoord. Het verschijnt als Twitch-chatbericht.", chatName: "Naam van kijker", chatSent: "Chatantwoord verstuurd", audienceTitle: "OBS-uitzendoverlay", audienceDescription: "De uitzending toont live de vraag, antwoorden, scores en het klassement.", audienceBadge: "3. UITZENDRESULTAAT" },
  de: { title: "ChatSprint — Drei verbundene Bereiche", tag: "DREI VERBUNDENE BEREICHE", heading: "Den vollständigen Ablauf nebeneinander verstehen", description: "Links startet der Host die Frage, in der Mitte antworten Zuschauer im Twitch-Chat und rechts zeigt OBS das Ergebnis. Alles aktualisiert sich gemeinsam.", back: "← Zurück zur Steuerung", hostTitle: "Streamer-Steuerung", hostDescription: "Der Host startet Fragen, zeigt Antworten und setzt das Spiel zurück.", hostBadge: "1. STEUERUNG", chatTitle: "Twitch-Chat", chatDescription: "Zuschauer antworten mit !a, !b, !c oder !d. Teste hier den ganzen Ablauf.", chatBadge: "2. ZUSCHAUERANTWORT", chatRoom: "LIVE-CHAT", chatHint: "Wähle unten eine Antwort. Sie erscheint wie eine Twitch-Chatnachricht.", chatName: "Name des Zuschauers", chatSent: "Chat-Antwort gesendet", audienceTitle: "OBS-Sende-Overlay", audienceDescription: "Die Übertragung zeigt Frage, Antworten, Punkte und Bestenliste live.", audienceBadge: "3. SENDEERGEBNIS" }
};

const verdictCopy = {
  bn: { correct: "সত্য", wrong: "ভুল" },
  en: { correct: "CORRECT", wrong: "WRONG" },
  ar: { correct: "صحيح", wrong: "خطأ" },
  nl: { correct: "JUIST", wrong: "FOUT" },
  de: { correct: "RICHTIG", wrong: "FALSCH" }
};

const pointsCopy = {
  bn: "পয়েন্ট",
  en: "points",
  ar: "نقطة",
  nl: "punten",
  de: "Punkte"
};

const scoreDetailsCopy = {
  bn: { correct: "সঠিক", wrong: "ভুল", answered: "উত্তর", question: "প্রশ্ন" },
  en: { correct: "Correct", wrong: "Wrong", answered: "Answers", question: "Question" },
  ar: { correct: "صحيح", wrong: "خطأ", answered: "إجابات", question: "السؤال" },
  nl: { correct: "Juist", wrong: "Fout", answered: "Antwoorden", question: "Vraag" },
  de: { correct: "Richtig", wrong: "Falsch", answered: "Antworten", question: "Frage" }
};

const supportedLanguages = Object.keys(copy);
let language = supportedLanguages.includes(localStorage.getItem("chatsprint-language")) ? localStorage.getItem("chatsprint-language") : "en";
let latestState = null;

function setText(selector, value) {
  const element = document.querySelector(selector);
  if (element) element.textContent = value;
}

function applyLanguage(nextLanguage, persist = true) {
  if (!supportedLanguages.includes(nextLanguage)) return;
  language = nextLanguage;
  if (persist) localStorage.setItem("chatsprint-language", language);
  const t = copy[language];
  document.documentElement.lang = language;
  document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  document.title = t.title;
  setText("#compare-tag", t.tag);
  setText("#compare-title", t.heading);
  setText("#compare-description", t.description);
  setText("#compare-back", t.back);
  setText("#host-title", t.hostTitle);
  setText("#host-description", t.hostDescription);
  setText("#host-badge", t.hostBadge);
  setText("#chat-title", t.chatTitle);
  setText("#chat-description", t.chatDescription);
  setText("#chat-badge", t.chatBadge);
  setText("#chat-room-label", t.chatRoom);
  setText("#chat-hint", t.chatHint);
  setText("#chat-name-label", t.chatName);
  setText("#audience-title", t.audienceTitle);
  setText("#audience-description", t.audienceDescription);
  setText("#audience-badge", t.audienceBadge);
  const ui = translations[language];
  setText("#preview-next", ui.next);
  setText("#preview-close", ui.reveal);
  setText("#preview-reset", ui.reset);
  setText("#host-board-label", ui.topPlayers);
  setText("#audience-board-label", ui.leaderboard);
  document.querySelectorAll(".language-button").forEach((button) => {
    const active = button.dataset.lang === language;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  if (latestState) renderPreview(latestState);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
}

function renderPreview(state) {
  if (latestState && Number(state.version ?? 0) < Number(latestState.version ?? 0)) return;
  latestState = state;
  const ui = translations[language];
  const status = state.status === "open" ? ui.live : state.status === "closed" ? ui.revealed : ui.ready;
  const answerCount = state.answerCount === 1 ? ui.oneAnswer : ui.answers(state.answerCount);
  const localizedQuestion = state.question?.translations?.[language];
  const prompt = localizedQuestion?.prompt || state.question?.prompt || ui.start;
  const options = localizedQuestion?.options || state.question?.options;
  setText("#preview-status", state.connection?.state === "demo" ? ui.demoMode : status);
  ["#host-state", "#audience-state"].forEach((selector) => setText(selector, status));
  ["#host-count", "#audience-count"].forEach((selector) => setText(selector, answerCount));
  ["#host-question", "#audience-question"].forEach((selector) => setText(selector, prompt));
  const optionHtml = state.question ? Object.entries(options).map(([key, value]) => {
    const optionClass = state.question.correct === key ? "correct" : state.status === "closed" && state.counts[key] ? "wrong" : "";
    return `<li class="${optionClass}"><span>${key.toUpperCase()}</span><strong>${escapeHtml(value)}</strong><small>${state.counts[key] || 0}</small></li>`;
  }).join("") : "";
  document.querySelector("#host-options").innerHTML = optionHtml;
  document.querySelector("#audience-options").innerHTML = optionHtml;
  const verdict = (player) => state.status === "closed" && player.lastResult
    ? `<em class="verdict ${player.lastResult}">${escapeHtml(verdictCopy[language][player.lastResult])}</em>`
    : "";
  const scoreLabels = scoreDetailsCopy[language];
  const leaderboardHtml = state.leaderboard.length ? state.leaderboard.map((player, index) => {
    const correctAnswers = player.correctAnswers || 0;
    const wrongAnswers = player.wrongAnswers || 0;
    const totalAnswers = player.totalAnswers ?? correctAnswers + wrongAnswers;
    const history = (player.answerHistory || []).map((item) => {
      const historyPrompt = item.translations?.[language] || item.prompt;
      const resultKey = item.correct ? "correct" : "wrong";
      return `<span class="answer-history-item"><span><b>${escapeHtml(scoreLabels.question)} ${item.questionNumber}:</b> ${escapeHtml(historyPrompt)}</span><em class="verdict ${resultKey}">${escapeHtml(verdictCopy[language][resultKey])}</em></span>`;
    }).join("");
    return `<li><b>${index + 1}</b><span>${escapeHtml(player.displayName)}${verdict(player)}<small class="score-details"><span class="score-detail correct">${scoreLabels.correct} ${correctAnswers}</span><span class="score-detail wrong">${scoreLabels.wrong} ${wrongAnswers}</span><span class="score-detail answered">${scoreLabels.answered} ${totalAnswers}</span></small><span class="answer-history">${history}</span></span><strong>${player.score}</strong></li>`;
  }).join("") : `<li class="empty">${escapeHtml(ui.scoresEmpty)}</li>`;
  document.querySelector("#host-leaderboard").innerHTML = leaderboardHtml;
  document.querySelector("#audience-leaderboard").innerHTML = leaderboardHtml;
  const messages = document.querySelector("#chat-messages");
  messages.innerHTML = state.roundAnswers?.length
    ? state.roundAnswers.map((entry) => {
        const result = entry.correct === null ? "" : `<em class="verdict ${entry.correct ? "correct" : "wrong"}">${escapeHtml(verdictCopy[language][entry.correct ? "correct" : "wrong"])}</em>`;
        return `<p class="chat-message"><strong>${escapeHtml(entry.displayName)}</strong><span>!${escapeHtml(entry.answer)}</span>${result}</p>`;
      }).join("")
    : `<p id="chat-hint">${escapeHtml(copy[language].chatHint)}</p>`;
  messages.scrollTop = messages.scrollHeight;
}

function post(path, body) {
  return fetch(path, { method: "POST", headers: body ? { "Content-Type": "application/json" } : {}, body: body ? JSON.stringify(body) : undefined }).then((response) => response.json());
}

document.querySelectorAll(".language-button").forEach((button) => button.addEventListener("click", () => applyLanguage(button.dataset.lang)));
window.addEventListener("storage", (event) => {
  if (event.key === "chatsprint-language" && event.newValue) applyLanguage(event.newValue, false);
});
document.querySelector("#preview-next").addEventListener("click", async () => {
  const result = await post("/api/next");
  if (result.ok) {
    setText("#chat-result", "");
    renderPreview(result.state);
  }
});
document.querySelector("#preview-close").addEventListener("click", async () => {
  const result = await post("/api/close");
  if (result.ok) renderPreview(result.state);
});
document.querySelector("#preview-reset").addEventListener("click", async () => {
  const result = await post("/api/reset");
  if (result.ok) {
    setText("#chat-result", "");
    renderPreview(result.state);
  }
});

async function ensureDemoRoundOpen() {
  if (latestState?.status === "open") return true;
  if (latestState?.status === "closed") {
    const replay = await post("/api/replay");
    if (!replay.ok) return false;
    renderPreview(replay.state);
    setText("#chat-result", "");
    return true;
  }
  const next = await post("/api/next");
  if (next.state) renderPreview(next.state);
  if (!next.ok) return next.state?.status === "open";
  return true;
}

document.querySelector("#compare-chat-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const submitter = event.submitter;
  const answer = submitter?.value;
  const name = document.querySelector("#compare-chat-name").value.trim() || "Viewer";
  if (!answer) return;
  const answerButtons = document.querySelectorAll("#chat-answer-buttons button");
  answerButtons.forEach((button) => { button.disabled = true; });
  try {
    if (!(await ensureDemoRoundOpen())) {
      setText("#chat-result", translations[language].failed);
      return;
    }
    let result = await post("/api/demo-answer", { displayName: name, answer });
    if (!result.accepted && result.reason === "already_answered") {
      const replay = await post("/api/replay");
      if (!replay.ok) throw new Error("Could not replay the demo round.");
      renderPreview(replay.state);
      result = await post("/api/demo-answer", { displayName: name, answer });
    }
    if (result.state) renderPreview(result.state);
    if (result.accepted) {
      const reveal = await post("/api/close");
      if (!reveal.ok) throw new Error("Could not reveal the demo result.");
      result.state = reveal.state;
      renderPreview(reveal.state);
    }
    const failureKey = {
      round_closed: "roundClosed",
      invalid_answer: "invalidAnswer",
      already_answered: "alreadyAnswered"
    }[result.reason] || "failed";
    const submittedAnswer = result.state?.roundAnswers?.find((entry) => entry.displayName === name && `!${entry.answer}` === answer);
    const immediateResult = submittedAnswer?.correct === null || submittedAnswer?.correct === undefined
      ? copy[language].chatSent
      : `${verdictCopy[language][submittedAnswer.correct ? "correct" : "wrong"]} • ${submittedAnswer.points} ${pointsCopy[language]}`;
    setText("#chat-result", result.accepted ? immediateResult : translations[language][failureKey]);
  } catch {
    setText("#chat-result", translations[language].failed);
  } finally {
    answerButtons.forEach((button) => { button.disabled = false; });
  }
});
applyLanguage(language, false);
new EventSource("/events").onmessage = (event) => renderPreview(JSON.parse(event.data));
fetch("/api/state").then((response) => response.json()).then(renderPreview);
