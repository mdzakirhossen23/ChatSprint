import { questionManagerTranslations, translations } from "./i18n.js";

const stateEl = document.querySelector("#state");
const questionEl = document.querySelector("#question");
const optionsEl = document.querySelector("#options");
const leaderboardEl = document.querySelector("#leaderboard");
const connectionEl = document.querySelector("#connection");
const countEl = document.querySelector("#answer-count");
const toastEl = document.querySelector("#toast");
const whyPanel = document.querySelector("#why-panel");
const supportedLanguages = Object.keys(translations);
const verdictCopy = {
  bn: { correct: "সত্য", wrong: "ভুল" }, en: { correct: "CORRECT", wrong: "WRONG" },
  ar: { correct: "صحيح", wrong: "خطأ" }, nl: { correct: "JUIST", wrong: "FOUT" },
  de: { correct: "RICHTIG", wrong: "FALSCH" }
};
const scoreDetailsCopy = {
  bn: { correct: "সঠিক", wrong: "ভুল", answered: "উত্তর", question: "প্রশ্ন" },
  en: { correct: "Correct", wrong: "Wrong", answered: "Answers", question: "Question" },
  ar: { correct: "صحيح", wrong: "خطأ", answered: "إجابات", question: "السؤال" },
  nl: { correct: "Juist", wrong: "Fout", answered: "Antwoorden", question: "Vraag" },
  de: { correct: "Richtig", wrong: "Falsch", answered: "Antworten", question: "Frage" }
};
const desktopCopy = {
  bn: { studio: "লাইভ স্টুডিও", broadcast: "OBS সম্প্রচার", questions: "প্রশ্ন ব্যাংক", about: "অ্যাপের তথ্য", control: "স্ট্রিমার কন্ট্রোল রুম", chat: "Twitch চ্যাট", host: "হোস্ট নিয়ন্ত্রণ", viewer: "দর্শক পরীক্ষা", room: "লাইভ চ্যাট", hint: "নিচের একটি উত্তর চাপুন। Twitch চ্যাটের মতো বার্তাটি এখানে দেখা যাবে।", output: "সম্প্রচারের আউটপুট", broadcastTitle: "OBS সম্প্রচার ওভারলে", broadcastDescription: "OBS-তে দর্শক যে লাইভ দৃশ্য দেখবেন এটি সেটিই।", openOverlay: "সম্পূর্ণ ওভারলে খুলুন ↗", viewerName: "দর্শকের নাম", chatSent: "চ্যাট উত্তর পাঠানো হয়েছে", points: "পয়েন্ট" },
  en: { studio: "Live Studio", broadcast: "OBS Broadcast", questions: "Question Bank", about: "About the app", control: "Streamer Control Room", chat: "Twitch Chat", host: "HOST CONTROL", viewer: "VIEWER TEST", room: "LIVE CHAT", hint: "Choose an answer below. It will appear here like a Twitch chat message.", output: "BROADCAST OUTPUT", broadcastTitle: "OBS Broadcast Overlay", broadcastDescription: "This is the live view your audience will see in OBS.", openOverlay: "Open full overlay ↗", viewerName: "Viewer name", chatSent: "Chat answer sent", points: "points" },
  ar: { studio: "الاستوديو المباشر", broadcast: "بث OBS", questions: "بنك الأسئلة", about: "عن التطبيق", control: "غرفة تحكم البث", chat: "دردشة Twitch", host: "تحكم المضيف", viewer: "اختبار المشاهد", room: "الدردشة المباشرة", hint: "اختر إجابة أدناه لتظهر كرسالة في دردشة Twitch.", output: "مخرج البث", broadcastTitle: "طبقة بث OBS", broadcastDescription: "هذه هي الشاشة المباشرة التي يراها جمهورك في OBS.", openOverlay: "فتح الطبقة كاملة ↗", viewerName: "اسم المشاهد", chatSent: "تم إرسال إجابة الدردشة", points: "نقطة" },
  nl: { studio: "Live Studio", broadcast: "OBS-uitzending", questions: "Vragenbank", about: "Over de app", control: "Streamerbediening", chat: "Twitch-chat", host: "HOSTBEDIENING", viewer: "KIJKERSTEST", room: "LIVE CHAT", hint: "Kies hieronder een antwoord. Het verschijnt als Twitch-chatbericht.", output: "UITZENDOUTPUT", broadcastTitle: "OBS-uitzendoverlay", broadcastDescription: "Dit is het livebeeld dat je publiek in OBS ziet.", openOverlay: "Volledige overlay openen ↗", viewerName: "Naam van kijker", chatSent: "Chatantwoord verstuurd", points: "punten" },
  de: { studio: "Live-Studio", broadcast: "OBS-Sendung", questions: "Fragenbank", about: "Über die App", control: "Streamer-Steuerung", chat: "Twitch-Chat", host: "HOST-STEUERUNG", viewer: "ZUSCHAUERTEST", room: "LIVE-CHAT", hint: "Wähle unten eine Antwort. Sie erscheint wie eine Twitch-Chatnachricht.", output: "SENDEAUSGABE", broadcastTitle: "OBS-Sende-Overlay", broadcastDescription: "Dies ist die Live-Ansicht, die dein Publikum in OBS sieht.", openOverlay: "Vollständiges Overlay öffnen ↗", viewerName: "Name des Zuschauers", chatSent: "Chat-Antwort gesendet", points: "Punkte" }
};
const compactNavCopy = {
  bn: { setup: "লাইভ", studio: "স্টুডিও", broadcast: "OBS", questions: "প্রশ্ন", about: "তথ্য" },
  en: { setup: "Go live", studio: "Studio", broadcast: "OBS", questions: "Questions", about: "About" },
  ar: { setup: "بث", studio: "استوديو", broadcast: "OBS", questions: "أسئلة", about: "حول" },
  nl: { setup: "Live", studio: "Studio", broadcast: "OBS", questions: "Vragen", about: "Info" },
  de: { setup: "Live", studio: "Studio", broadcast: "OBS", questions: "Fragen", about: "Info" }
};
const twitchAnswerHelpCopy = {
  bn: "Twitch চ্যাটে a, b, c, d অথবা !a, !b, !c, !d লিখে উত্তর দিন।",
  en: "Answer in Twitch chat with a, b, c, d or !a, !b, !c, !d.",
  ar: "أجب في دردشة Twitch بـ a أو b أو c أو d، مع ! أو بدونها.",
  nl: "Antwoord in Twitch-chat met a, b, c, d of !a, !b, !c, !d.",
  de: "Antworte im Twitch-Chat mit a, b, c, d oder !a, !b, !c, !d."
};
const controlGuideCopy = {
  bn: {
    flow: ["১ প্রশ্ন চালু", "২ দর্শকের উত্তর", "৩ ফল দেখান", "৪ পরের প্রশ্ন"],
    ready: ["ধাপ ১", "প্রথম প্রশ্ন চালু করুন", "নিচের উজ্জ্বল ‘প্রথম প্রশ্ন চালু করুন’ বাটনটি চাপুন।"],
    waiting: ["ধাপ ২", "এখন দর্শকের উত্তর নিন", "দর্শক Twitch চ্যাটে a, b, c, d অথবা !a, !b, !c, !d লিখবে। উত্তর না এলেও ‘সঠিক উত্তর দেখান’ চাপতে পারবেন।"],
    reveal: ["ধাপ ৩", "এখন সঠিক উত্তর দেখান", (count) => `${count}টি উত্তর এসেছে। উজ্জ্বল ‘সঠিক উত্তর দেখান’ বাটনটি চাপুন।`],
    next: ["ধাপ ৪", "এখন পরবর্তী প্রশ্ন চালু করুন", "ফল দেখানো হয়েছে। উজ্জ্বল ‘পরবর্তী প্রশ্ন চালু করুন’ বাটনটি চাপুন।"],
    firstButton: "১. প্রথম প্রশ্ন চালু করুন", revealButton: "৩. সঠিক উত্তর দেখান", revealedButton: "৩. সঠিক উত্তর দেখানো হয়েছে ✓", nextButton: "৪. পরবর্তী প্রশ্ন চালু করুন", resetTitle: "শুধু সম্পূর্ণ নতুন গেম শুরু করতে গেম রিসেট চাপুন"
  },
  en: {
    flow: ["1 Start question", "2 Viewer answers", "3 Reveal result", "4 Next question"],
    ready: ["STEP 1", "Start the first question", "Press the glowing ‘Start first question’ button below."],
    waiting: ["STEP 2", "Collect viewer answers", "Viewers may answer with a, b, c, d or !a, !b, !c, !d. You can reveal even with zero answers."],
    reveal: ["STEP 3", "Reveal the correct answer", (count) => `${count} answer${count === 1 ? "" : "s"} received. Press the glowing ‘Reveal answer’ button.`],
    next: ["STEP 4", "Start the next question", "The result is visible. Press the glowing ‘Next question’ button."],
    firstButton: "1. Start first question", revealButton: "3. Reveal answer", revealedButton: "3. Answer revealed ✓", nextButton: "4. Start next question", resetTitle: "Use Reset game only to start a completely new game"
  },
  ar: {
    flow: ["١ ابدأ السؤال", "٢ إجابة المشاهد", "٣ أظهر النتيجة", "٤ السؤال التالي"],
    ready: ["الخطوة ١", "ابدأ السؤال الأول", "اضغط زر بدء السؤال الأول المضيء أدناه."],
    waiting: ["الخطوة ٢", "اجمع إجابات المشاهدين", "يجيب المشاهدون في دردشة Twitch باستخدام !a أو !b أو !c أو !d."],
    reveal: ["الخطوة ٣", "أظهر الإجابة الصحيحة", (count) => `وصلت ${count} إجابة. اضغط زر إظهار الإجابة المضيء.`],
    next: ["الخطوة ٤", "ابدأ السؤال التالي", "ظهرت النتيجة. اضغط زر السؤال التالي المضيء."],
    firstButton: "١. ابدأ السؤال الأول", revealButton: "٣. أظهر الإجابة", revealedButton: "٣. تم إظهار الإجابة ✓", nextButton: "٤. ابدأ السؤال التالي", resetTitle: "استخدم إعادة الضبط فقط لبدء لعبة جديدة بالكامل"
  },
  nl: {
    flow: ["1 Vraag starten", "2 Kijker antwoordt", "3 Resultaat tonen", "4 Volgende vraag"],
    ready: ["STAP 1", "Start de eerste vraag", "Klik hieronder op de oplichtende knop."],
    waiting: ["STAP 2", "Verzamel kijkersantwoorden", "Kijkers antwoorden in Twitch-chat met !a, !b, !c of !d."],
    reveal: ["STAP 3", "Toon het juiste antwoord", (count) => `${count} antwoord(en) ontvangen. Klik op de oplichtende knop.`],
    next: ["STAP 4", "Start de volgende vraag", "Het resultaat is zichtbaar. Klik op de oplichtende knop."],
    firstButton: "1. Eerste vraag starten", revealButton: "3. Antwoord tonen", revealedButton: "3. Antwoord getoond ✓", nextButton: "4. Volgende vraag starten", resetTitle: "Gebruik Reset alleen voor een volledig nieuw spel"
  },
  de: {
    flow: ["1 Frage starten", "2 Zuschauer antwortet", "3 Ergebnis zeigen", "4 Nächste Frage"],
    ready: ["SCHRITT 1", "Erste Frage starten", "Klicke unten auf die leuchtende Schaltfläche."],
    waiting: ["SCHRITT 2", "Zuschauerantworten sammeln", "Zuschauer antworten im Twitch-Chat mit !a, !b, !c oder !d."],
    reveal: ["SCHRITT 3", "Richtige Antwort zeigen", (count) => `${count} Antwort(en) erhalten. Klicke auf die leuchtende Schaltfläche.`],
    next: ["SCHRITT 4", "Nächste Frage starten", "Das Ergebnis ist sichtbar. Klicke auf die leuchtende Schaltfläche."],
    firstButton: "1. Erste Frage starten", revealButton: "3. Antwort zeigen", revealedButton: "3. Antwort gezeigt ✓", nextButton: "4. Nächste Frage starten", resetTitle: "Reset nur für ein vollständig neues Spiel verwenden"
  }
};
const answerTimerCopy = {
  bn: { label: "উত্তরের সময়", unit: "সেকেন্ড", auto: "অটো ফল দেখান", waiting: "প্রশ্নের অপেক্ষা", off: "টাইমার বন্ধ", revealed: "ফল প্রকাশিত", revealing: "ফল প্রকাশ হচ্ছে…", remaining: (seconds) => `${seconds} সেকেন্ড বাকি`, nextLabel: "পরের প্রশ্নের বিরতি", nextAuto: "অটো পরের প্রশ্ন", nextWaiting: "ফল প্রকাশের অপেক্ষা", nextStarting: "পরের প্রশ্ন চালু হচ্ছে…", nextRemaining: (seconds) => `${seconds} সেকেন্ড পর পরের প্রশ্ন`, finished: "সব প্রশ্ন শেষ" },
  en: { label: "Answer time", unit: "seconds", auto: "Auto reveal", waiting: "Waiting for question", off: "Timer off", revealed: "Result revealed", revealing: "Revealing result…", remaining: (seconds) => `${seconds}s remaining`, nextLabel: "Next question delay", nextAuto: "Auto next", nextWaiting: "Waiting for result", nextStarting: "Starting next question…", nextRemaining: (seconds) => `Next question in ${seconds}s`, finished: "All questions finished" },
  ar: { label: "وقت الإجابة", unit: "ثانية", auto: "إظهار تلقائي", waiting: "بانتظار السؤال", off: "المؤقت متوقف", revealed: "ظهرت النتيجة", revealing: "جارٍ إظهار النتيجة…", remaining: (seconds) => `${seconds} ثانية متبقية`, nextLabel: "مهلة السؤال التالي", nextAuto: "التالي تلقائياً", nextWaiting: "بانتظار النتيجة", nextStarting: "جارٍ بدء السؤال التالي…", nextRemaining: (seconds) => `السؤال التالي خلال ${seconds} ثانية`, finished: "انتهت جميع الأسئلة" },
  nl: { label: "Antwoordtijd", unit: "seconden", auto: "Automatisch tonen", waiting: "Wachten op vraag", off: "Timer uit", revealed: "Resultaat getoond", revealing: "Resultaat tonen…", remaining: (seconds) => `${seconds}s resterend`, nextLabel: "Pauze volgende vraag", nextAuto: "Automatisch volgende", nextWaiting: "Wachten op resultaat", nextStarting: "Volgende vraag starten…", nextRemaining: (seconds) => `Volgende vraag over ${seconds}s`, finished: "Alle vragen zijn klaar" },
  de: { label: "Antwortzeit", unit: "Sekunden", auto: "Automatisch zeigen", waiting: "Warte auf Frage", off: "Timer aus", revealed: "Ergebnis gezeigt", revealing: "Ergebnis wird gezeigt…", remaining: (seconds) => `${seconds}s verbleibend`, nextLabel: "Pause bis nächste Frage", nextAuto: "Automatisch weiter", nextWaiting: "Warte auf Ergebnis", nextStarting: "Nächste Frage startet…", nextRemaining: (seconds) => `Nächste Frage in ${seconds}s`, finished: "Alle Fragen beendet" }
};
const gameStatsCopy = {
  bn: { question: "প্রশ্ন", answer: "উত্তর", unanswered: "নিরুত্তর", correct: "সঠিক", wrong: "ভুল" },
  en: { question: "Question", answer: "Answers", unanswered: "No answer", correct: "Correct", wrong: "Wrong" },
  ar: { question: "السؤال", answer: "الإجابات", unanswered: "بلا إجابة", correct: "صحيح", wrong: "خطأ" },
  nl: { question: "Vraag", answer: "Antwoorden", unanswered: "Onbeantwoord", correct: "Goed", wrong: "Fout" },
  de: { question: "Frage", answer: "Antworten", unanswered: "Unbeantwortet", correct: "Richtig", wrong: "Falsch" }
};
const windowCopy = {
  bn: { size: "অ্যাপ সাইজ", normal: "নরমাল", max: "ম্যাক্স", close: "ক্লোজ", closed: "অ্যাপ উইন্ডো বন্ধ আছে।", reopen: "ChatSprint খুলুন", footer: "© ২০২৬ ChatSprint · সর্বস্বত্ব সংরক্ষিত", footerStatus: "লাইভ কুইজ স্টুডিও", resize: "টেনে অ্যাপ ছোট–বড় করুন" },
  en: { size: "App size", normal: "Normal", max: "Max", close: "Close", closed: "The app window is closed.", reopen: "Open ChatSprint", footer: "© 2026 ChatSprint · All rights reserved", footerStatus: "Live quiz studio", resize: "Drag to resize the app" },
  ar: { size: "حجم التطبيق", normal: "عادي", max: "تكبير", close: "إغلاق", closed: "نافذة التطبيق مغلقة.", reopen: "فتح ChatSprint", footer: "© 2026 ChatSprint · جميع الحقوق محفوظة", footerStatus: "استوديو مسابقات مباشر", resize: "اسحب لتغيير حجم التطبيق" },
  nl: { size: "App-grootte", normal: "Normaal", max: "Max", close: "Sluiten", closed: "Het appvenster is gesloten.", reopen: "ChatSprint openen", footer: "© 2026 ChatSprint · Alle rechten voorbehouden", footerStatus: "Live quizstudio", resize: "Sleep om de app te vergroten of verkleinen" },
  de: { size: "App-Größe", normal: "Normal", max: "Max", close: "Schließen", closed: "Das App-Fenster ist geschlossen.", reopen: "ChatSprint öffnen", footer: "© 2026 ChatSprint · Alle Rechte vorbehalten", footerStatus: "Live-Quizstudio", resize: "Ziehen, um die App-Größe zu ändern" }
};
const twitchDockCopy = {
  bn: { open: "Twitch পরীক্ষা", title: "Twitch পরীক্ষার ব্রাউজার", close: "Twitch পরীক্ষার ব্রাউজার বন্ধ করুন", obs: "OBS সম্প্রচার", viewer: "দর্শকের পর্দা", openObs: "সম্পূর্ণ OBS ওভারলে খুলুন" },
  en: { open: "Twitch test", title: "Twitch test browser", close: "Close Twitch test browser", obs: "OBS Broadcast", viewer: "Viewer screen", openObs: "Open full OBS overlay" },
  ar: { open: "اختبار Twitch", title: "متصفح اختبار Twitch", close: "إغلاق متصفح اختبار Twitch", obs: "بث OBS", viewer: "شاشة المشاهد", openObs: "فتح طبقة OBS كاملة" },
  nl: { open: "Twitch-test", title: "Twitch-testbrowser", close: "Twitch-testbrowser sluiten", obs: "OBS-uitzending", viewer: "Kijkersscherm", openObs: "Volledige OBS-overlay openen" },
  de: { open: "Twitch-Test", title: "Twitch-Testbrowser", close: "Twitch-Testbrowser schließen", obs: "OBS-Sendung", viewer: "Zuschaueransicht", openObs: "Vollständiges OBS-Overlay öffnen" }
};
const setupCopy = {
  bn: { nav:"লাইভ চালু করুন", kicker:"লাইভ চালুর সহকারী", title:"না ভেবেই লাইভ চালু করুন", intro:"ক্রম অনুসারে চারটি কাজ করুন। ক্যামেরার প্রয়োজন নেই।", ready:"প্রস্তুত", needs:"আরও কাজ বাকি", step1:"OBS Browser URL কপি করুন", step1Text:"OBS-এ Sources → + → Browser চাপুন, এই URL বসিয়ে 1920 × 1080 দিন এবং OK চাপুন।", copy:"URL কপি", copied:"URL কপি হয়েছে", preview:"প্রিভিউ ↗", step2:"Twitch Stream Manager খুলুন", step2Text:"চ্যানেল Online হয়েছে কি না দেখতে dashboard খোলা রাখুন। ক্যামেরা ছাড়াই ChatSprint চলবে।", dashboard:"Twitch dashboard খুলুন ↗", step3:"OBS-এ Start Streaming চাপুন", step3Text:"OBS Browser Source বর্তমান প্রশ্ন, উত্তর ও স্কোর Twitch-এ পাঠাবে।", confirm:"Browser Source যোগ করে streaming চালু করেছি", step4:"দর্শকের ভিডিও ও chat পরীক্ষা করুন", step4Text:"পরীক্ষায় ChatSprint, OBS-এর দর্শক পর্দা ও Twitch chat একসঙ্গে খুলবে।", test:"লাইভ পরীক্ষা খুলুন", studio:"কন্ট্রোল রুম খুলুন", check:"স্বয়ংক্রিয় পরীক্ষা", before:"লাইভের আগে", overlay:"OBS overlay", questions:"প্রশ্ন", chat:"Twitch chat", camera:"ক্যামেরা", checking:"পরীক্ষা হচ্ছে…", overlayReady:"Overlay প্রস্তুত", overlayFail:"Overlay পাওয়া যায়নি", questionsReady:(n)=>`${n}টি প্রশ্ন প্রস্তুত`, questionsFail:"অন্তত একটি প্রশ্ন যোগ করুন", chatReady:"Twitch chat যুক্ত", chatDemo:"Demo mode—Twitch সংযোগ নেই", cameraState:"প্রয়োজন নেই", help:"Twitch player-এ Offline দেখালে OBS-এ streaming চালু করে কয়েক সেকেন্ড অপেক্ষা করুন।" },
  en: { nav:"Go Live", kicker:"GO LIVE ASSISTANT", title:"Go live without guessing", intro:"Follow the four actions in order. A camera is not required.", ready:"READY", needs:"ACTION NEEDED", step1:"Copy the OBS Browser URL", step1Text:"In OBS choose Sources → + → Browser, paste this URL, set 1920 × 1080 and press OK.", copy:"Copy URL", copied:"URL copied", preview:"Preview ↗", step2:"Open Twitch Stream Manager", step2Text:"Keep the dashboard open to check whether the channel is online. ChatSprint works without a camera.", dashboard:"Open Twitch dashboard ↗", step3:"Press Start Streaming in OBS", step3Text:"The OBS Browser Source sends the current question, answers and scores to Twitch.", confirm:"I added the Browser Source and started streaming", step4:"Test viewer video and chat", step4Text:"The test opens ChatSprint, the OBS viewer screen and Twitch chat together.", test:"Open live test", studio:"Open control room", check:"AUTOMATIC CHECK", before:"Before going live", overlay:"OBS overlay", questions:"Questions", chat:"Twitch chat", camera:"Camera", checking:"Checking…", overlayReady:"Overlay ready", overlayFail:"Overlay not found", questionsReady:(n)=>`${n} questions ready`, questionsFail:"Add at least one question", chatReady:"Twitch chat connected", chatDemo:"Demo mode—Twitch not connected", cameraState:"Not required", help:"If the Twitch player says Offline, start streaming in OBS and wait a few seconds." },
  ar: { nav:"بدء البث", kicker:"مساعد البث المباشر", title:"ابدأ البث دون تخمين", intro:"اتبع الإجراءات الأربعة بالترتيب. لا تحتاج إلى كاميرا.", ready:"جاهز", needs:"إجراء مطلوب", step1:"انسخ رابط متصفح OBS", step1Text:"في OBS اختر Sources ثم + ثم Browser، الصق الرابط واضبط 1920 × 1080 ثم اضغط OK.", copy:"نسخ الرابط", copied:"تم نسخ الرابط", preview:"معاينة ↗", step2:"افتح مدير بث Twitch", step2Text:"اترك لوحة التحكم مفتوحة للتحقق من أن القناة متصلة. يعمل ChatSprint بلا كاميرا.", dashboard:"فتح لوحة Twitch ↗", step3:"اضغط Start Streaming في OBS", step3Text:"يرسل مصدر المتصفح السؤال والإجابات والنتائج إلى Twitch.", confirm:"أضفت مصدر المتصفح وبدأت البث", step4:"اختبر الفيديو والدردشة", step4Text:"يفتح الاختبار ChatSprint وشاشة OBS ودردشة Twitch معاً.", test:"فتح الاختبار المباشر", studio:"فتح غرفة التحكم", check:"فحص تلقائي", before:"قبل البث", overlay:"طبقة OBS", questions:"الأسئلة", chat:"دردشة Twitch", camera:"الكاميرا", checking:"جارٍ الفحص…", overlayReady:"الطبقة جاهزة", overlayFail:"الطبقة غير موجودة", questionsReady:(n)=>`${n} أسئلة جاهزة`, questionsFail:"أضف سؤالاً واحداً على الأقل", chatReady:"دردشة Twitch متصلة", chatDemo:"وضع تجريبي—Twitch غير متصل", cameraState:"غير مطلوبة", help:"إذا ظهر Offline في Twitch، ابدأ البث في OBS وانتظر بضع ثوانٍ." },
  nl: { nav:"Live gaan", kicker:"LIVE-ASSISTENT", title:"Ga live zonder te twijfelen", intro:"Volg de vier acties op volgorde. Een camera is niet nodig.", ready:"GEREED", needs:"ACTIE NODIG", step1:"Kopieer de OBS-browser-URL", step1Text:"Kies in OBS Sources → + → Browser, plak de URL, stel 1920 × 1080 in en druk op OK.", copy:"URL kopiëren", copied:"URL gekopieerd", preview:"Voorbeeld ↗", step2:"Open Twitch Stream Manager", step2Text:"Laat het dashboard open om te zien of het kanaal online is. ChatSprint werkt zonder camera.", dashboard:"Twitch-dashboard openen ↗", step3:"Klik op Start Streaming in OBS", step3Text:"De OBS-browserbron stuurt de vraag, antwoorden en scores naar Twitch.", confirm:"Browser Source toegevoegd en streaming gestart", step4:"Test video en chat", step4Text:"De test opent ChatSprint, het OBS-kijkersscherm en Twitch-chat samen.", test:"Live test openen", studio:"Bedieningsruimte openen", check:"AUTOMATISCHE CONTROLE", before:"Voor livegang", overlay:"OBS-overlay", questions:"Vragen", chat:"Twitch-chat", camera:"Camera", checking:"Controleren…", overlayReady:"Overlay gereed", overlayFail:"Overlay niet gevonden", questionsReady:(n)=>`${n} vragen gereed`, questionsFail:"Voeg minstens één vraag toe", chatReady:"Twitch-chat verbonden", chatDemo:"Demomodus—Twitch niet verbonden", cameraState:"Niet nodig", help:"Als de Twitch-speler Offline toont, start streaming in OBS en wacht enkele seconden." },
  de: { nav:"Live starten", kicker:"LIVE-ASSISTENT", title:"Ohne Rätselraten live gehen", intro:"Folge den vier Schritten. Eine Kamera ist nicht erforderlich.", ready:"BEREIT", needs:"AKTION NÖTIG", step1:"OBS-Browser-URL kopieren", step1Text:"In OBS Sources → + → Browser wählen, URL einfügen, 1920 × 1080 einstellen und OK drücken.", copy:"URL kopieren", copied:"URL kopiert", preview:"Vorschau ↗", step2:"Twitch Stream Manager öffnen", step2Text:"Dashboard geöffnet lassen, um den Online-Status zu prüfen. ChatSprint funktioniert ohne Kamera.", dashboard:"Twitch-Dashboard öffnen ↗", step3:"In OBS Start Streaming drücken", step3Text:"Die OBS-Browserquelle sendet Frage, Antworten und Punkte an Twitch.", confirm:"Browser Source hinzugefügt und Streaming gestartet", step4:"Video und Chat testen", step4Text:"Der Test öffnet ChatSprint, OBS-Zuschaueransicht und Twitch-Chat zusammen.", test:"Live-Test öffnen", studio:"Kontrollraum öffnen", check:"AUTOMATISCHE PRÜFUNG", before:"Vor dem Livestream", overlay:"OBS-Overlay", questions:"Fragen", chat:"Twitch-Chat", camera:"Kamera", checking:"Prüfung…", overlayReady:"Overlay bereit", overlayFail:"Overlay nicht gefunden", questionsReady:(n)=>`${n} Fragen bereit`, questionsFail:"Mindestens eine Frage hinzufügen", chatReady:"Twitch-Chat verbunden", chatDemo:"Demo-Modus—Twitch nicht verbunden", cameraState:"Nicht erforderlich", help:"Wenn der Twitch-Player Offline zeigt, Streaming in OBS starten und einige Sekunden warten." }
};
const setupCompanionCopy = {
  bn: { step3:"OBS চালিয়ে লাইভ শুরু করুন", step3Text:"ChatSprint সংরক্ষিত overlay, scene ও Twitch profile নিয়ে OBS-কে background-এ চালাবে।", start:"▶ লাইভ শুরু করুন", stop:"■ লাইভ বন্ধ করুন", status:"OBS অবস্থা দেখুন", install:"Companion ইনস্টল", confirm:"OBS Companion প্রস্তুত" },
  en: { step3:"Start OBS and go live", step3Text:"ChatSprint launches OBS in the background with the saved overlay, scene and Twitch profile.", start:"▶ Start live", stop:"■ Stop live", status:"Check OBS", install:"Install companion", confirm:"OBS Companion is ready" },
  ar: { step3:"تشغيل OBS وبدء البث", step3Text:"يشغل ChatSprint برنامج OBS في الخلفية باستخدام الإعدادات المحفوظة.", start:"▶ بدء البث", stop:"■ إيقاف البث", status:"حالة OBS", install:"تثبيت المرافق", confirm:"مرافق OBS جاهز" },
  nl: { step3:"Start OBS en ga live", step3Text:"ChatSprint start OBS op de achtergrond met de opgeslagen instellingen.", start:"▶ Live starten", stop:"■ Live stoppen", status:"OBS-status", install:"Companion installeren", confirm:"OBS Companion is gereed" },
  de: { step3:"OBS starten und live gehen", step3Text:"ChatSprint startet OBS im Hintergrund mit den gespeicherten Einstellungen.", start:"▶ Live starten", stop:"■ Live stoppen", status:"OBS-Status", install:"Companion installieren", confirm:"OBS Companion ist bereit" }
};

const setupCoachCopy = {
  bn: {
    label:"এখন যা চাপবেন", restart:"আবার শুরু", complete:"লাইভ সেটিং প্রস্তুত", completeHelp:"সব ধাপ শেষ। এখন কন্ট্রোল রুম থেকে প্রশ্ন পরিচালনা করুন।",
    titles:["লাল ‘URL কপি’ বাটন চাপুন","লাল ‘Twitch dashboard খুলুন’ বাটন চাপুন","লাল ‘লাইভ শুরু করুন’ বাটন চাপুন","লাল ‘লাইভ পরীক্ষা খুলুন’ বাটন চাপুন"],
    helps:["URL কপি হলে পরের ধাপ নিজে দেখাবে।","Dashboard নতুন ট্যাবে খুলবে; তারপর পরের লাল বাটন চাপুন।","এটি সংরক্ষিত সেটিং দিয়ে OBS চালিয়ে streaming শুরু করবে।","ভিডিও, overlay ও Twitch chat একসঙ্গে দেখে নিশ্চিত করুন।"]
  },
  en: {
    label:"PRESS THIS NOW", restart:"Start again", complete:"Live setup is ready", completeHelp:"All steps are complete. Run the quiz from the control room.",
    titles:["Press the red “Copy URL” button","Press the red “Open Twitch dashboard” button","Press the red “Start live” button","Press the red “Open live test” button"],
    helps:["The next step appears automatically after the URL is copied.","The dashboard opens in a new tab; then press the next red button.","This launches OBS with the saved settings and starts streaming.","Confirm the video, overlay and Twitch chat together."]
  },
  ar: {
    label:"اضغط الآن", restart:"ابدأ من جديد", complete:"إعداد البث جاهز", completeHelp:"اكتملت الخطوات. شغّل الأسئلة من غرفة التحكم.",
    titles:["اضغط زر «نسخ الرابط» الأحمر","اضغط زر «فتح لوحة Twitch» الأحمر","اضغط زر «بدء البث» الأحمر","اضغط زر «فتح الاختبار المباشر» الأحمر"],
    helps:["ستظهر الخطوة التالية تلقائياً بعد النسخ.","تفتح اللوحة في تبويب جديد، ثم اضغط الزر الأحمر التالي.","يشغّل OBS بالإعدادات المحفوظة ويبدأ البث.","تحقق من الفيديو والطبقة ودردشة Twitch معاً."]
  },
  nl: {
    label:"DRUK NU HIER", restart:"Opnieuw beginnen", complete:"Live-instelling is gereed", completeHelp:"Alle stappen zijn klaar. Bedien de quiz vanuit de controlekamer.",
    titles:["Druk op de rode knop ‘URL kopiëren’","Druk op de rode knop ‘Twitch-dashboard openen’","Druk op de rode knop ‘Live starten’","Druk op de rode knop ‘Live test openen’"],
    helps:["Na het kopiëren verschijnt automatisch de volgende stap.","Het dashboard opent in een nieuw tabblad; druk daarna op de volgende rode knop.","Hiermee start OBS met de opgeslagen instellingen en begint de stream.","Controleer video, overlay en Twitch-chat samen."]
  },
  de: {
    label:"JETZT DRÜCKEN", restart:"Neu beginnen", complete:"Live-Einrichtung ist bereit", completeHelp:"Alle Schritte sind fertig. Steuere das Quiz im Kontrollraum.",
    titles:["Drücke den roten Button „URL kopieren“","Drücke den roten Button „Twitch-Dashboard öffnen“","Drücke den roten Button „Live starten“","Drücke den roten Button „Live-Test öffnen“"],
    helps:["Nach dem Kopieren erscheint automatisch der nächste Schritt.","Das Dashboard öffnet sich in einem neuen Tab; drücke danach den nächsten roten Button.","OBS startet mit den gespeicherten Einstellungen und beginnt zu streamen.","Prüfe Video, Overlay und Twitch-Chat gemeinsam."]
  }
};
let currentLanguage = supportedLanguages.includes(localStorage.getItem("chatsprint-language")) ? localStorage.getItem("chatsprint-language") : "en";
let latestState = null;
let questionBank = [];
let editingQuestionId = null;
let currentView = "studio";
let setupGuideStep = Math.min(4, Math.max(0, Number(localStorage.getItem("chatsprint-live-guide-step") || 0)));
let answerTimerSeconds = Math.min(300, Math.max(5, Number(localStorage.getItem("chatsprint-answer-seconds") || 30)));
let answerTimerEnabled = localStorage.getItem("chatsprint-answer-timer-enabled") !== "0";
let answerTimerRoundKey = null;
let answerTimerDeadline = 0;
let autoRevealInFlight = false;
let autoRevealedRoundKey = null;
let nextTimerSeconds = Math.min(300, Math.max(3, Number(localStorage.getItem("chatsprint-next-seconds") || 10)));
let nextTimerEnabled = localStorage.getItem("chatsprint-next-timer-enabled") !== "0";
let nextTimerRoundKey = null;
let nextTimerDeadline = 0;
let autoNextInFlight = false;
let autoStartedNextKey = null;

function text(key) {
  return translations[currentLanguage][key] ?? questionManagerTranslations[currentLanguage][key];
}

function setText(selector, value) {
  const element = document.querySelector(selector);
  if (element) element.textContent = value;
}

function updateDesktopNavLabels() {
  const compact = document.body.classList.contains("twitch-dock-open");
  const labels = compact ? compactNavCopy[currentLanguage] : {
    setup: setupCopy[currentLanguage].nav,
    studio: desktopCopy[currentLanguage].studio,
    broadcast: desktopCopy[currentLanguage].broadcast,
    questions: desktopCopy[currentLanguage].questions,
    about: desktopCopy[currentLanguage].about
  };
  setText("#nav-setup", labels.setup);
  setText("#nav-studio", labels.studio);
  setText("#nav-broadcast", labels.broadcast);
  setText("#nav-questions", labels.questions);
  setText("#nav-about", labels.about);
}

function applyStaticTranslations() {
  const t = translations[currentLanguage];
  document.documentElement.lang = currentLanguage;
  document.documentElement.dir = currentLanguage === "ar" ? "rtl" : "ltr";
  document.title = t.title;
  setText(".brand p", t.tagline);
  setText("#next", t.next);
  setText("#close", t.reveal);
  setText("#reset", t.reset);
  setText("#top-players-label", t.topPlayers);
  setText("#overlay-link", t.overlay);
  setText("#compare-link", t.compare);
  setText("#demo-mode-label", t.demoMode);
  setText("#demo-title", t.demoTitle);
  setText("#demo-description", t.demoDescription);
  setText("#viewer-name-label", t.viewerName);
  setText("#chat-answer-label", t.chatAnswer);
  setText("#send-answer", t.sendAnswer);
  setText("#leaderboard-label", t.leaderboard);
  setText("#why-open", t.whyButton);
  setText(".why-heading .tag", t.whyTag);
  setText(".why-heading h2", t.whyTitle);
  setText("#why-intro", t.whyIntro);
  setText("#why-audience", t.whyAudience);
  const timerText = answerTimerCopy[currentLanguage];
  setText("#answer-timer-label", timerText.label);
  setText("#answer-timer-unit", timerText.unit);
  setText("#answer-timer-auto-label", timerText.auto);
  setText("#next-timer-label", timerText.nextLabel);
  setText("#next-timer-unit", timerText.unit);
  setText("#next-timer-auto-label", timerText.nextAuto);
  const statsText = gameStatsCopy[currentLanguage];
  setText("#stat-question-label", statsText.question);
  setText("#stat-answer-label", statsText.answer);
  setText("#stat-unanswered-label", statsText.unanswered);
  setText("#stat-correct-label", statsText.correct);
  setText("#stat-wrong-label", statsText.wrong);
  const manager = questionManagerTranslations[currentLanguage];
  const desktop = desktopCopy[currentLanguage];
  const windowText = windowCopy[currentLanguage];
  setText("#app-size-label", windowText.size);
  setText("#window-normal-label", windowText.normal);
  setText("#window-max-label", windowText.max);
  setText("#window-close-label", windowText.close);
  setText("#app-closed-message", windowText.closed);
  setText("#window-reopen", windowText.reopen);
  setText("#footer-copy", windowText.footer);
  setText("#footer-status", windowText.footerStatus);
  setText("#twitch-dock-open-label", twitchDockCopy[currentLanguage].open);
  setText("#twitch-dock-title", twitchDockCopy[currentLanguage].title);
  setText("#obs-test-dock-title", twitchDockCopy[currentLanguage].obs);
  setText("#obs-test-dock-caption", twitchDockCopy[currentLanguage].viewer);
  const obsTestOpenFull = document.querySelector("#obs-test-open-full");
  if (obsTestOpenFull) {
    obsTestOpenFull.title = twitchDockCopy[currentLanguage].openObs;
    obsTestOpenFull.setAttribute("aria-label", twitchDockCopy[currentLanguage].openObs);
  }
  const twitchDockClose = document.querySelector("#twitch-dock-close");
  if (twitchDockClose) {
    twitchDockClose.title = twitchDockCopy[currentLanguage].close;
    twitchDockClose.setAttribute("aria-label", twitchDockCopy[currentLanguage].close);
  }
  const resizeGrip = document.querySelector("#window-resize-grip");
  if (resizeGrip) {
    resizeGrip.title = windowText.resize;
    resizeGrip.setAttribute("aria-label", windowText.resize);
  }
  const setup = setupCopy[currentLanguage];
  updateDesktopNavLabels();
  setText("#setup-kicker", setup.kicker); setText("#setup-title", setup.title); setText("#setup-intro", setup.intro);
  setText("#setup-step1-title", setup.step1); setText("#setup-step1-text", setup.step1Text); setText("#setup-copy-overlay", setup.copy); setText("#setup-preview-overlay", setup.preview);
  setText("#setup-step2-title", setup.step2); setText("#setup-step2-text", setup.step2Text); setText("#setup-open-dashboard", setup.dashboard);
  const companion = setupCompanionCopy[currentLanguage];
  setText("#setup-step3-title", companion.step3); setText("#setup-step3-text", companion.step3Text); setText("#setup-obs-confirm-label", companion.confirm);
  setText("#setup-start-live", companion.start); setText("#setup-stop-live", companion.stop); setText("#setup-obs-status", companion.status); setText("#setup-install-companion", companion.install);
  setText("#setup-step4-title", setup.step4); setText("#setup-step4-text", setup.step4Text); setText("#setup-open-test", setup.test); setText("#setup-open-studio", setup.studio);
  setText("#setup-check-title", setup.check); setText("#setup-check-heading", setup.before); setText("#setup-check-overlay-title", setup.overlay); setText("#setup-check-questions-title", setup.questions); setText("#setup-check-chat-title", setup.chat); setText("#setup-check-camera-title", setup.camera); setText("#setup-check-camera-state", setup.cameraState); setText("#setup-help-note", setup.help);
  updateSetupCoach();
  updateSetupReadiness();
  setText("#control-title", desktop.control);
  setText("#control-kicker", desktop.host);
  setText("#chat-title", desktop.chat);
  setText("#chat-kicker", desktop.viewer);
  setText("#chat-room-label", desktop.room);
  setText("#chat-hint", desktop.hint);
  setText("#studio-viewer-name-label", desktop.viewerName);
  setText("#broadcast-kicker", desktop.output);
  setText("#broadcast-title", desktop.broadcastTitle);
  setText("#broadcast-description", desktop.broadcastDescription);
  setText("#broadcast-open", desktop.openOverlay);
  setText("#question-bank-tag", manager.questionBankTag);
  setText("#question-bank-title", manager.questionBankTitle);
  setText("#question-bank-note", manager.questionBankNote);
  setText("#add-question", manager.addQuestion);
  setText("#question-search-label", manager.searchQuestions);
  setText("#question-form-tag", manager.editorTag);
  setText("#question-language-note", manager.languageNote);
  setText("#question-prompt-label", manager.questionLabel);
  setText("#correct-answer-label", manager.correctAnswerLabel);
  setText("#question-cancel", manager.cancel);
  setText("#question-save", manager.saveQuestion);
  const searchInput = document.querySelector("#question-search");
  if (searchInput) searchInput.placeholder = manager.searchPlaceholder;
  document.querySelectorAll(".question-option-grid label span").forEach((label, index) => { label.textContent = `${manager.answerLabel} ${"ABCD"[index]}`; });
  const benefitGrid = document.querySelector("#why-benefits");
  if (benefitGrid) benefitGrid.innerHTML = t.benefits.map(([title, description]) => `<article><strong>${escapeHtml(title)}</strong><p>${escapeHtml(description)}</p></article>`).join("");
  document.querySelectorAll(".language-button").forEach((button) => {
    const active = button.dataset.lang === currentLanguage;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  renderQuestionBank();
  updateAnswerTimer();
}

function setLanguage(language, persist = true) {
  if (!supportedLanguages.includes(language)) return;
  currentLanguage = language;
  if (persist) localStorage.setItem("chatsprint-language", language);
  const obsFrame = document.querySelector("#obs-test-frame");
  obsFrame?.contentWindow?.postMessage({ type: "chatsprint-language", language }, window.location.origin);
  applyStaticTranslations();
  if (latestState) render(latestState);
}

function showToast(message) {
  toastEl.textContent = message;
  toastEl.classList.add("show");
  setTimeout(() => toastEl.classList.remove("show"), 1800);
}

function render(state) {
  if (latestState && Number(state.version ?? 0) < Number(latestState.version ?? 0)) return;
  latestState = state;
  const t = translations[currentLanguage];
  stateEl.textContent = state.status === "open" ? t.live : state.status === "closed" ? t.revealed : t.ready;
  stateEl.dataset.status = state.status;
  if (connectionEl) {
    connectionEl.textContent = state.connection.state === "demo" ? t.demoActive : state.connection.message || t.starting;
    connectionEl.dataset.state = state.connection.state;
  }
  const sidebarConnection = document.querySelector("#sidebar-connection");
  if (sidebarConnection) {
    sidebarConnection.textContent = state.connection.state === "demo" ? t.demoActive : state.connection.message || t.starting;
    sidebarConnection.dataset.state = state.connection.state;
  }
  updateSetupReadiness();
  if (countEl) countEl.textContent = state.answerCount === 1 ? t.oneAnswer : t.answers(state.answerCount);
  const stats = state.stats || { totalAnswers: 0, unansweredQuestions: 0, correctAnswers: 0, wrongAnswers: 0 };
  const visibleAnswerTotal = Number(stats.totalAnswers || 0) + (state.status === "open" ? Number(state.answerCount || 0) : 0);
  setText("#stat-question", `${Math.max(0, Number(state.questionNumber || 0))}/${Number(state.totalQuestions || 0)}`);
  setText("#stat-answer", visibleAnswerTotal);
  setText("#stat-unanswered", Number(stats.unansweredQuestions || 0));
  setText("#stat-correct", Number(stats.correctAnswers || 0));
  setText("#stat-wrong", Number(stats.wrongAnswers || 0));
  const localizedQuestion = state.question?.translations?.[currentLanguage];
  questionEl.textContent = localizedQuestion?.prompt || state.question?.prompt || (document.body.classList.contains("overlay-page") ? t.waiting : t.start);
  const optionValues = localizedQuestion?.options || state.question?.options;
  optionsEl.innerHTML = state.question
    ? Object.entries(optionValues).map(([key, value]) => `
        <li class="option ${state.status === "closed" && state.question.correct === key ? "correct" : state.status === "closed" && state.counts[key] ? "wrong" : ""}">
          <span>${key.toUpperCase()}</span><strong>${escapeHtml(value)}</strong><small>${state.counts[key] || 0}</small>
        </li>`).join("")
    : "";
  leaderboardEl.innerHTML = state.leaderboard.length
    ? state.leaderboard.map((player, index) => {
        const verdict = state.status === "closed" && player.lastResult ? `<em class="verdict ${player.lastResult}">${escapeHtml(verdictCopy[currentLanguage][player.lastResult])}</em>` : "";
        const labels = scoreDetailsCopy[currentLanguage];
        const correctAnswers = player.correctAnswers || 0;
        const wrongAnswers = player.wrongAnswers || 0;
        const totalAnswers = player.totalAnswers ?? correctAnswers + wrongAnswers;
        const history = (player.answerHistory || []).map((item) => {
          const historyPrompt = item.translations?.[currentLanguage] || item.prompt;
          const resultKey = item.correct ? "correct" : "wrong";
          return `<span class="answer-history-item ${resultKey}"><span class="history-question"><b>${escapeHtml(labels.question)} ${item.questionNumber}:</b> ${escapeHtml(historyPrompt)}</span><em class="verdict ${resultKey}">${escapeHtml(verdictCopy[currentLanguage][resultKey])}</em></span>`;
        }).join("");
        return `<li class="leaderboard-player"><span class="player-heading"><b class="player-rank">${index + 1}</b><span class="player-name">${escapeHtml(player.displayName)}</span><strong class="player-score">${player.score}</strong></span><span class="player-meta">${verdict}<small class="score-details"><span class="score-detail correct">${labels.correct} ${correctAnswers}</span><span class="score-detail wrong">${labels.wrong} ${wrongAnswers}</span><span class="score-detail answered">${labels.answered} ${totalAnswers}</span></small></span>${history ? `<span class="answer-history">${history}</span>` : ""}</li>`;
      }).join("")
    : `<li class="empty">${escapeHtml(t.scoresEmpty)}</li>`;
  const chatMessages = document.querySelector("#chat-messages");
  if (chatMessages) {
    chatMessages.innerHTML = state.roundAnswers?.length
      ? state.roundAnswers.map((entry) => {
          const result = entry.correct === null ? "" : `<em class="verdict ${entry.correct ? "correct" : "wrong"}">${escapeHtml(verdictCopy[currentLanguage][entry.correct ? "correct" : "wrong"])}</em>`;
          return `<p class="chat-message"><strong>${escapeHtml(entry.displayName)}</strong><span>!${escapeHtml(entry.answer)}</span>${result}</p>`;
        }).join("")
      : `<p id="chat-hint">${escapeHtml(twitchAnswerHelpCopy[currentLanguage])}</p>`;
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
  setText("#twitch-current-question", questionEl.textContent);
  setText("#twitch-answer-help", twitchAnswerHelpCopy[currentLanguage]);
  updateControlGuide(state);
  syncAnswerTimer(state);
  syncNextTimer(state);
}

function answerTimerKey(state) {
  if (!state || state.status !== "open" || !state.question) return null;
  return `${state.questionNumber}:${state.roundStartedAt || state.question.prompt}`;
}

function updateAnswerTimer() {
  const output = document.querySelector("#answer-timer-countdown");
  if (!output) return;
  const copy = answerTimerCopy[currentLanguage] || answerTimerCopy.en;
  if (!answerTimerEnabled) {
    output.textContent = copy.off;
    output.dataset.state = "off";
    return;
  }
  if (!latestState || latestState.status === "ready") {
    output.textContent = copy.waiting;
    output.dataset.state = "waiting";
    return;
  }
  if (latestState.status === "closed") {
    output.textContent = copy.revealed;
    output.dataset.state = "revealed";
    return;
  }
  const remaining = Math.max(0, Math.ceil((answerTimerDeadline - Date.now()) / 1000));
  output.textContent = autoRevealInFlight ? copy.revealing : copy.remaining(remaining);
  output.dataset.state = remaining <= 5 ? "ending" : "running";
}

function syncAnswerTimer(state) {
  const key = answerTimerKey(state);
  if (!key) {
    answerTimerRoundKey = null;
    answerTimerDeadline = 0;
    updateAnswerTimer();
    return;
  }
  if (key !== answerTimerRoundKey) {
    answerTimerRoundKey = key;
    autoRevealedRoundKey = null;
  }
  answerTimerDeadline = Number(state.roundStartedAt || Date.now()) + answerTimerSeconds * 1000;
  updateAnswerTimer();
}

async function tickAnswerTimer() {
  updateAnswerTimer();
  const key = answerTimerKey(latestState);
  if (!answerTimerEnabled || !key || autoRevealInFlight || autoRevealedRoundKey === key || Date.now() < answerTimerDeadline) return;
  const revealButton = document.querySelector("#close");
  if (!revealButton || revealButton.disabled) return;
  autoRevealInFlight = true;
  autoRevealedRoundKey = key;
  updateAnswerTimer();
  try {
    await runControlAction(revealButton, "/api/close");
  } finally {
    autoRevealInFlight = false;
    updateAnswerTimer();
  }
}

function nextTimerKey(state) {
  if (!state || state.status !== "closed" || !state.question) return null;
  return `${state.questionNumber}:${state.roundClosedAt || state.question.prompt}`;
}

function updateNextTimer() {
  const output = document.querySelector("#next-timer-countdown");
  if (!output) return;
  const copy = answerTimerCopy[currentLanguage] || answerTimerCopy.en;
  if (!nextTimerEnabled) {
    output.textContent = copy.off;
    output.dataset.state = "off";
    return;
  }
  if (!latestState || latestState.status !== "closed") {
    output.textContent = copy.nextWaiting;
    output.dataset.state = "waiting";
    return;
  }
  if (Number(latestState.questionNumber) >= Number(latestState.totalQuestions)) {
    output.textContent = copy.finished;
    output.dataset.state = "revealed";
    return;
  }
  const remaining = Math.max(0, Math.ceil((nextTimerDeadline - Date.now()) / 1000));
  output.textContent = autoNextInFlight ? copy.nextStarting : copy.nextRemaining(remaining);
  output.dataset.state = remaining <= 5 ? "ending" : "running";
}

function syncNextTimer(state) {
  const key = nextTimerKey(state);
  if (!key) {
    nextTimerRoundKey = null;
    nextTimerDeadline = 0;
    updateNextTimer();
    return;
  }
  if (key !== nextTimerRoundKey) {
    nextTimerRoundKey = key;
    autoStartedNextKey = null;
  }
  nextTimerDeadline = Number(state.roundClosedAt || Date.now()) + nextTimerSeconds * 1000;
  updateNextTimer();
}

async function tickNextTimer() {
  updateNextTimer();
  const key = nextTimerKey(latestState);
  const isLastQuestion = Number(latestState?.questionNumber) >= Number(latestState?.totalQuestions);
  if (!nextTimerEnabled || !key || isLastQuestion || autoNextInFlight || autoStartedNextKey === key || Date.now() < nextTimerDeadline) return;
  const nextButton = document.querySelector("#next");
  if (!nextButton || nextButton.disabled) return;
  autoNextInFlight = true;
  autoStartedNextKey = key;
  updateNextTimer();
  try {
    await runControlAction(nextButton, "/api/next");
  } finally {
    autoNextInFlight = false;
    updateNextTimer();
  }
}

function updateControlGuide(state) {
  const guide = document.querySelector("#control-guide");
  if (!guide || !state) return;
  const copy = controlGuideCopy[currentLanguage] || controlGuideCopy.en;
  const nextButton = document.querySelector("#next");
  const revealButton = document.querySelector("#close");
  const resetButton = document.querySelector("#reset");
  const answerCount = Number(state.answerCount || 0);
  let phase = "ready";
  let activeFlow = "start";
  if (state.status === "open") {
    phase = answerCount > 0 ? "reveal" : "waiting";
    activeFlow = answerCount > 0 ? "reveal" : "answer";
  } else if (state.status === "closed") {
    phase = "next";
    activeFlow = "next";
  }
  const content = copy[phase];
  setText("#control-guide-badge", content[0]);
  setText("#control-guide-title", content[1]);
  setText("#control-guide-help", typeof content[2] === "function" ? content[2](answerCount) : content[2]);
  ["start", "answer", "reveal", "next"].forEach((step, index) => {
    const element = document.querySelector(`[data-flow-step="${step}"]`);
    if (element) {
      element.textContent = copy.flow[index];
      element.classList.toggle("active", step === activeFlow);
      element.classList.toggle("complete", index < ["start", "answer", "reveal", "next"].indexOf(activeFlow));
    }
  });
  if (nextButton) {
    nextButton.textContent = state.status === "closed" ? copy.nextButton : copy.firstButton;
    nextButton.disabled = state.status === "open";
    nextButton.classList.toggle("recommended", state.status !== "open");
  }
  if (revealButton) {
    revealButton.textContent = state.status === "closed" ? copy.revealedButton : copy.revealButton;
    revealButton.disabled = state.status !== "open";
    revealButton.classList.toggle("recommended", state.status === "open");
  }
  if (resetButton) {
    resetButton.disabled = false;
    resetButton.classList.remove("recommended");
    resetButton.title = copy.resetTitle;
  }
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
}

async function post(path, body) {
  try {
    const response = await fetch(path, {
      method: "POST",
      headers: body ? { "Content-Type": "application/json" } : {},
      body: body ? JSON.stringify(body) : undefined,
      cache: "no-store"
    });
    const result = await response.json();
    if (!response.ok) {
      const reasons = { round_closed: "roundClosed", invalid_answer: "invalidAnswer", already_answered: "alreadyAnswered" };
      showToast(text(reasons[result.reason]) || result.error || text("failed"));
    }
    return result;
  } catch {
    showToast(text("failed"));
    return { ok: false, state: null };
  }
}

async function request(path, options = {}) {
  const response = await fetch(path, options);
  const result = await response.json();
  if (!response.ok) {
    showToast(result.code === "game_active" ? text("gameActiveEdit") : result.error || text("failed"));
    return null;
  }
  return result;
}

function localizedQuestion(question) {
  return question.translations?.[currentLanguage] || { prompt: question.prompt, options: question.options };
}

function renderQuestionBank() {
  const list = document.querySelector("#question-list");
  if (!list) return;
  const query = document.querySelector("#question-search")?.value.trim().toLocaleLowerCase(currentLanguage) || "";
  const visible = questionBank.filter((question) => {
    const value = localizedQuestion(question);
    return [value.prompt, ...Object.values(value.options)].join(" ").toLocaleLowerCase(currentLanguage).includes(query);
  });
  list.innerHTML = visible.length ? visible.map((question) => {
    const originalIndex = questionBank.findIndex((item) => item.id === question.id);
    const value = localizedQuestion(question);
    const answers = Object.entries(value.options).map(([key, option]) => `${key.toUpperCase()}: ${option}`).join(" · ");
    return `<article class="question-row"><span class="question-number">${originalIndex + 1}</span><div class="question-summary"><strong>${escapeHtml(value.prompt)}</strong><small>${escapeHtml(answers)}</small></div><div class="question-row-actions"><button type="button" data-edit-question="${question.id}">${escapeHtml(text("editQuestion"))}</button><button type="button" class="question-delete" data-delete-question="${question.id}">${escapeHtml(text("deleteQuestion"))}</button></div></article>`;
  }).join("") : `<p class="question-list-empty">${escapeHtml(text("noQuestionsFound"))}</p>`;
}

async function loadQuestionBank() {
  const result = await request("/api/questions");
  if (result) {
    questionBank = result.questions;
    renderQuestionBank();
    updateSetupReadiness();
  }
}

function openQuestionEditor(question = null) {
  editingQuestionId = question?.id || null;
  const form = document.querySelector("#question-form");
  form.reset();
  setText("#question-form-title", question ? text("editQuestionTitle") : text("addQuestionTitle"));
  if (question) {
    const value = localizedQuestion(question);
    form.elements.prompt.value = value.prompt;
    for (const key of ["a", "b", "c", "d"]) form.elements[key].value = value.options[key];
    form.elements.correct.value = question.correct;
  }
  document.querySelector("#question-dialog").showModal();
}

document.querySelector("#add-question")?.addEventListener("click", () => openQuestionEditor());
document.querySelector("#question-search")?.addEventListener("input", renderQuestionBank);
document.querySelector("#question-dialog-close")?.addEventListener("click", () => document.querySelector("#question-dialog").close());
document.querySelector("#question-cancel")?.addEventListener("click", () => document.querySelector("#question-dialog").close());
document.querySelector("#question-list")?.addEventListener("click", async (event) => {
  const editButton = event.target.closest("[data-edit-question]");
  if (editButton) return openQuestionEditor(questionBank.find((question) => question.id === editButton.dataset.editQuestion));
  const deleteButton = event.target.closest("[data-delete-question]");
  if (!deleteButton || !window.confirm(text("deleteConfirm"))) return;
  const result = await request(`/api/questions/${deleteButton.dataset.deleteQuestion}`, { method: "DELETE" });
  if (result) {
    await loadQuestionBank();
    if (result.state) render(result.state);
    showToast(text("questionDeleted"));
  }
});
document.querySelector("#question-form")?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const body = { language: currentLanguage, prompt: form.get("prompt"), options: { a: form.get("a"), b: form.get("b"), c: form.get("c"), d: form.get("d") }, correct: form.get("correct") };
  const result = await request(editingQuestionId ? `/api/questions/${editingQuestionId}` : "/api/questions", { method: editingQuestionId ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  if (result) {
    document.querySelector("#question-dialog").close();
    await loadQuestionBank();
    if (result.state) render(result.state);
    showToast(text("questionSaved"));
  }
});

function showDesktopView(view) {
  if (!document.querySelector(`[data-view-panel="${view}"]`)) return;
  currentView = view;
  document.querySelectorAll("[data-view-panel]").forEach((panel) => {
    const active = panel.dataset.viewPanel === view;
    panel.hidden = !active;
    panel.classList.toggle("active", active);
  });
  document.querySelectorAll(".desktop-nav-button").forEach((button) => {
    const active = button.dataset.view === view;
    button.classList.toggle("active", active);
    if (active) button.setAttribute("aria-current", "page"); else button.removeAttribute("aria-current");
  });
  localStorage.setItem("chatsprint-desktop-view", view);
}

let overlayReady = false;
let overlayChecked = false;
function setSetupCheck(selector, ready, message) {
  const item = document.querySelector(selector);
  if (!item) return;
  item.classList.toggle("ready", ready);
  item.classList.toggle("waiting", !ready);
  const state = item.querySelector("small");
  if (state) state.textContent = message;
}

const setupGuideTargets = ["#setup-copy-overlay", "#setup-open-dashboard", "#setup-start-live", "#setup-open-test"];

function updateSetupCoach() {
  const copy = setupCoachCopy[currentLanguage];
  if (!copy) return;
  const complete = setupGuideStep >= setupGuideTargets.length;
  setText("#setup-next-label", complete ? "✓" : copy.label);
  setText("#setup-next-title", complete ? copy.complete : copy.titles[setupGuideStep]);
  setText("#setup-next-help", complete ? copy.completeHelp : copy.helps[setupGuideStep]);
  setText("#setup-guide-reset", copy.restart);
  const panel = document.querySelector("#setup-next-action");
  panel?.classList.toggle("complete", complete);
  document.querySelectorAll("[data-setup-step]").forEach((card, index) => {
    card.classList.toggle("setup-current", !complete && index === setupGuideStep);
    card.classList.toggle("setup-complete", index < setupGuideStep || complete);
    card.classList.toggle("setup-pending", !complete && index > setupGuideStep);
  });
  setupGuideTargets.forEach((selector, index) => {
    const button = document.querySelector(selector);
    if (!button) return;
    const current = !complete && index === setupGuideStep;
    button.classList.toggle("setup-next-button", current);
    button.classList.toggle("setup-future-button", !complete && index > setupGuideStep);
    if (current) button.setAttribute("aria-describedby", "setup-next-title");
    else button.removeAttribute("aria-describedby");
  });
}

function completeSetupStep(step) {
  if (setupGuideStep !== step) return;
  setupGuideStep = Math.min(setupGuideTargets.length, step + 1);
  localStorage.setItem("chatsprint-live-guide-step", String(setupGuideStep));
  updateSetupCoach();
}

function restartSetupCoach() {
  setupGuideStep = 0;
  localStorage.setItem("chatsprint-live-guide-step", "0");
  updateSetupCoach();
}

function updateSetupReadiness() {
  const copy = setupCopy[currentLanguage];
  if (!copy) return;
  setSetupCheck("#setup-check-overlay", overlayReady, overlayReady ? copy.overlayReady : overlayChecked ? copy.overlayFail : copy.checking);
  setSetupCheck("#setup-check-questions", questionBank.length > 0, questionBank.length ? copy.questionsReady(questionBank.length) : copy.questionsFail);
  const chatState = latestState?.connection?.state;
  const chatReady = Boolean(chatState) && chatState !== "demo" && chatState !== "error";
  setSetupCheck("#setup-check-chat", chatReady, chatReady ? copy.chatReady : copy.chatDemo);
  const confirmed = Boolean(document.querySelector("#setup-obs-confirm")?.checked);
  const allReady = overlayReady && questionBank.length > 0 && chatReady && confirmed;
  const badge = document.querySelector("#setup-ready-badge");
  if (badge) { badge.textContent = allReady ? copy.ready : copy.needs; badge.classList.toggle("ready", allReady); }
}

async function checkOverlayReadiness() {
  try { overlayReady = (await fetch("/overlay", { cache: "no-store" })).ok; } catch { overlayReady = false; }
  overlayChecked = true;
  updateSetupReadiness();
}

const appWindow = document.querySelector("#app-window");
const appClosed = document.querySelector("#app-closed");
const appSize = document.querySelector("#app-size");
const resizeGrip = document.querySelector("#window-resize-grip");
const obsTestDock = document.querySelector("#obs-test-dock");
const twitchDock = document.querySelector("#twitch-dock");
const twitchDockOpen = document.querySelector("#twitch-dock-open");
let resizeState = null;

function twitchEmbedUrl(type) {
  const parent = encodeURIComponent(window.location.hostname || "localhost");
  if (type === "player") return `https://player.twitch.tv/?channel=chatsprintzakir&parent=${parent}&autoplay=false&muted=true`;
  return `https://www.twitch.tv/embed/chatsprintzakir/chat?parent=${parent}&darkpopout`;
}

function setTwitchDock(open) {
  if (!twitchDock) return;
  if (open) {
    setWindowMode("normal");
    const obs = document.querySelector("#obs-test-frame");
    const player = document.querySelector("#twitch-player-frame");
    const chat = document.querySelector("#twitch-chat-frame");
    if (obs && !obs.src) obs.src = "/overlay";
    if (!player.src) player.src = twitchEmbedUrl("player");
    if (!chat.src) chat.src = twitchEmbedUrl("chat");
  }
  if (obsTestDock) obsTestDock.hidden = !open;
  twitchDock.hidden = !open;
  document.body.classList.toggle("twitch-dock-open", open);
  if (!open && appWindow && !appWindow.classList.contains("window-maximized")) {
    setWindowMode("normal");
  }
  updateDesktopNavLabels();
  twitchDockOpen?.setAttribute("aria-expanded", String(open));
  twitchDockOpen?.classList.toggle("active", open);
  if (twitchDockOpen) {
    const copy = twitchDockCopy[currentLanguage];
    twitchDockOpen.title = open ? copy.close : copy.open;
    twitchDockOpen.setAttribute("aria-label", open ? copy.close : copy.open);
  }
  requestAnimationFrame(updateAppSize);
}

function updateAppSize() {
  if (!appWindow || appWindow.hidden) return;
  const bounds = appWindow.getBoundingClientRect();
  appSize.textContent = `${Math.round(bounds.width)} × ${Math.round(bounds.height)}`;
}

function setWindowMode(mode) {
  if (!appWindow) return;
  for (const property of ["position", "left", "top", "right", "bottom", "width", "height", "margin"]) appWindow.style.removeProperty(property);
  appWindow.hidden = false;
  appClosed.hidden = true;
  appWindow.classList.toggle("window-normal", mode === "normal");
  appWindow.classList.toggle("window-maximized", mode === "max");
  setText("#window-mode-label", windowCopy[currentLanguage][mode]);
  document.querySelector("#window-normal")?.setAttribute("aria-pressed", String(mode === "normal"));
  document.querySelector("#window-max")?.setAttribute("aria-pressed", String(mode === "max"));
  requestAnimationFrame(updateAppSize);
}

function resizeLimits(left, top) {
  const maxWidth = Math.max(320, window.innerWidth - left - 8);
  const maxHeight = Math.max(420, window.innerHeight - top - 8);
  return {
    minWidth: Math.min(760, maxWidth),
    minHeight: Math.min(520, maxHeight),
    maxWidth,
    maxHeight
  };
}

resizeGrip?.addEventListener("pointerdown", (event) => {
  if (!appWindow || appWindow.classList.contains("window-maximized")) return;
  event.preventDefault();
  const bounds = appWindow.getBoundingClientRect();
  resizeState = { pointerId: event.pointerId, x: event.clientX, y: event.clientY, width: bounds.width, height: bounds.height, left: bounds.left, top: bounds.top };
  appWindow.style.position = "fixed";
  appWindow.style.left = `${bounds.left}px`;
  appWindow.style.top = `${bounds.top}px`;
  appWindow.style.margin = "0";
  appWindow.style.width = `${bounds.width}px`;
  appWindow.style.height = `${bounds.height}px`;
  resizeGrip.setPointerCapture(event.pointerId);
  document.body.classList.add("is-resizing");
});

resizeGrip?.addEventListener("pointermove", (event) => {
  if (!resizeState || event.pointerId !== resizeState.pointerId) return;
  const limits = resizeLimits(resizeState.left, resizeState.top);
  const width = Math.min(limits.maxWidth, Math.max(limits.minWidth, resizeState.width + event.clientX - resizeState.x));
  const height = Math.min(limits.maxHeight, Math.max(limits.minHeight, resizeState.height + event.clientY - resizeState.y));
  appWindow.style.width = `${Math.round(width)}px`;
  appWindow.style.height = `${Math.round(height)}px`;
});

function finishResize(event) {
  if (!resizeState || (event?.pointerId != null && event.pointerId !== resizeState.pointerId)) return;
  if (resizeGrip?.hasPointerCapture(resizeState.pointerId)) resizeGrip.releasePointerCapture(resizeState.pointerId);
  resizeState = null;
  document.body.classList.remove("is-resizing");
  updateAppSize();
}

resizeGrip?.addEventListener("pointerup", finishResize);
resizeGrip?.addEventListener("pointercancel", finishResize);

document.querySelector("#window-normal")?.addEventListener("click", () => setWindowMode("normal"));
document.querySelector("#window-max")?.addEventListener("click", () => {
  setTwitchDock(false);
  setWindowMode("max");
});
document.querySelector("#twitch-dock-open")?.addEventListener("click", () => {
  setTwitchDock(!document.body.classList.contains("twitch-dock-open"));
});
document.querySelector("#twitch-dock-close")?.addEventListener("click", () => setTwitchDock(false));
document.querySelector("#setup-copy-overlay")?.addEventListener("click", async () => {
  const url = new URL("/overlay", window.location.href).href;
  document.querySelector("#setup-overlay-url").value = url;
  try { await navigator.clipboard.writeText(url); showToast(setupCopy[currentLanguage].copied); }
  catch { document.querySelector("#setup-overlay-url").select(); showToast(setupCopy[currentLanguage].copy); }
  completeSetupStep(0);
});
document.querySelector("#setup-open-dashboard")?.addEventListener("click", () => completeSetupStep(1));
document.querySelector("#setup-open-test")?.addEventListener("click", () => {
  completeSetupStep(3);
  setTwitchDock(true);
});
document.querySelector("#setup-open-studio")?.addEventListener("click", () => showDesktopView("studio"));
document.querySelector("#setup-guide-reset")?.addEventListener("click", restartSetupCoach);
document.querySelector("#setup-obs-confirm")?.addEventListener("change", (event) => {
  localStorage.setItem("chatsprint-obs-confirmed", event.currentTarget.checked ? "1" : "0");
  if (event.currentTarget.checked) completeSetupStep(2);
  updateSetupReadiness();
});
document.querySelector("#setup-start-live")?.addEventListener("click", () => {
  const confirmation = document.querySelector("#setup-obs-confirm");
  if (confirmation) confirmation.checked = true;
  localStorage.setItem("chatsprint-obs-confirmed", "1");
  completeSetupStep(2);
  updateSetupReadiness();
});
document.querySelector("#setup-stop-live")?.addEventListener("click", () => {
  const confirmation = document.querySelector("#setup-obs-confirm");
  if (confirmation) confirmation.checked = false;
  localStorage.setItem("chatsprint-obs-confirmed", "0");
  updateSetupReadiness();
});
document.querySelector("#window-close")?.addEventListener("click", () => {
  appWindow.hidden = true;
  appClosed.hidden = false;
});
document.querySelector("#window-reopen")?.addEventListener("click", () => setWindowMode("normal"));
if (appWindow && "ResizeObserver" in window) new ResizeObserver(updateAppSize).observe(appWindow);
window.addEventListener("resize", updateAppSize);

document.querySelectorAll(".desktop-nav-button").forEach((button) => button.addEventListener("click", () => showDesktopView(button.dataset.view)));

async function ensureDemoRoundOpen() {
  if (latestState?.status === "open") return true;
  if (latestState?.status === "closed") {
    const replay = await post("/api/replay");
    if (replay.state) render(replay.state);
    return Boolean(replay.ok);
  }
  const next = await post("/api/next");
  if (next.state) render(next.state);
  return Boolean(next.ok || next.state?.status === "open");
}

document.querySelector("#studio-chat-form")?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const answer = event.submitter?.value;
  const name = document.querySelector("#studio-chat-name").value.trim() || "Viewer";
  if (!answer) return;
  const buttons = document.querySelectorAll("#chat-answer-buttons button");
  buttons.forEach((button) => { button.disabled = true; });
  try {
    if (!(await ensureDemoRoundOpen())) throw new Error("round");
    let result = await post("/api/demo-answer", { displayName: name, answer });
    if (!result.accepted && result.reason === "already_answered") {
      const replay = await post("/api/replay");
      if (!replay.ok) throw new Error("replay");
      render(replay.state);
      result = await post("/api/demo-answer", { displayName: name, answer });
    }
    if (!result.accepted) return;
    const reveal = await post("/api/close");
    if (!reveal.ok) throw new Error("reveal");
    render(reveal.state);
    const entry = reveal.state.roundAnswers.find((item) => item.displayName === name && `!${item.answer}` === answer);
    const resultKey = entry?.correct ? "correct" : "wrong";
    setText("#chat-result", `${verdictCopy[currentLanguage][resultKey]} • ${entry?.points || 0} ${desktopCopy[currentLanguage].points}`);
  } catch {
    setText("#chat-result", text("failed"));
  } finally {
    buttons.forEach((button) => { button.disabled = false; });
  }
});

async function runControlAction(button, path) {
  if (!button || button.disabled) return;
  button.disabled = true;
  button.setAttribute("aria-busy", "true");
  try {
    const result = await post(path);
    if (result.state) render(result.state);
    if (result.ok) {
      toastEl.textContent = "";
      toastEl.classList.remove("show");
      setText("#chat-result", "");
    }
  } finally {
    button.removeAttribute("aria-busy");
    if (latestState) updateControlGuide(latestState);
  }
}

document.querySelector("#next")?.addEventListener("click", (event) => runControlAction(event.currentTarget, "/api/next"));
document.querySelector("#close")?.addEventListener("click", (event) => runControlAction(event.currentTarget, "/api/close"));
document.querySelector("#reset")?.addEventListener("click", (event) => runControlAction(event.currentTarget, "/api/reset"));
const answerTimerInput = document.querySelector("#answer-timer-seconds");
const answerTimerToggle = document.querySelector("#answer-timer-enabled");
const nextTimerInput = document.querySelector("#next-timer-seconds");
const nextTimerToggle = document.querySelector("#next-timer-enabled");
if (answerTimerInput) answerTimerInput.value = String(answerTimerSeconds);
if (answerTimerToggle) answerTimerToggle.checked = answerTimerEnabled;
if (nextTimerInput) nextTimerInput.value = String(nextTimerSeconds);
if (nextTimerToggle) nextTimerToggle.checked = nextTimerEnabled;
function saveAnswerTimerSeconds(event) {
  answerTimerSeconds = Math.min(300, Math.max(5, Number(event.currentTarget.value) || 30));
  localStorage.setItem("chatsprint-answer-seconds", String(answerTimerSeconds));
  if (latestState?.status === "open") answerTimerDeadline = Number(latestState.roundStartedAt || Date.now()) + answerTimerSeconds * 1000;
  updateAnswerTimer();
}
answerTimerInput?.addEventListener("input", saveAnswerTimerSeconds);
answerTimerInput?.addEventListener("change", (event) => {
  saveAnswerTimerSeconds(event);
  event.currentTarget.value = String(answerTimerSeconds);
});
answerTimerToggle?.addEventListener("change", (event) => {
  answerTimerEnabled = event.currentTarget.checked;
  localStorage.setItem("chatsprint-answer-timer-enabled", answerTimerEnabled ? "1" : "0");
  if (answerTimerEnabled && latestState?.status === "open") {
    answerTimerDeadline = Number(latestState.roundStartedAt || Date.now()) + answerTimerSeconds * 1000;
    autoRevealedRoundKey = null;
  }
  updateAnswerTimer();
});
function saveNextTimerSeconds(event) {
  nextTimerSeconds = Math.min(300, Math.max(3, Number(event.currentTarget.value) || 10));
  localStorage.setItem("chatsprint-next-seconds", String(nextTimerSeconds));
  if (latestState?.status === "closed") nextTimerDeadline = Number(latestState.roundClosedAt || Date.now()) + nextTimerSeconds * 1000;
  updateNextTimer();
}
nextTimerInput?.addEventListener("input", saveNextTimerSeconds);
nextTimerInput?.addEventListener("change", (event) => {
  saveNextTimerSeconds(event);
  event.currentTarget.value = String(nextTimerSeconds);
});
nextTimerToggle?.addEventListener("change", (event) => {
  nextTimerEnabled = event.currentTarget.checked;
  localStorage.setItem("chatsprint-next-timer-enabled", nextTimerEnabled ? "1" : "0");
  if (nextTimerEnabled && latestState?.status === "closed") {
    nextTimerDeadline = Number(latestState.roundClosedAt || Date.now()) + nextTimerSeconds * 1000;
    autoStartedNextKey = null;
  }
  updateNextTimer();
});
document.querySelectorAll(".language-button").forEach((button) => button.addEventListener("click", () => setLanguage(button.dataset.lang)));
window.addEventListener("storage", (event) => {
  if (event.key === "chatsprint-language" && event.newValue) setLanguage(event.newValue, false);
});
document.querySelector("#why-open")?.addEventListener("click", () => {
  whyPanel.hidden = !whyPanel.hidden;
  document.querySelector("#why-open").setAttribute("aria-expanded", String(!whyPanel.hidden));
});
document.querySelector("#why-close")?.addEventListener("click", () => {
  whyPanel.hidden = true;
  document.querySelector("#why-open").setAttribute("aria-expanded", "false");
});
document.querySelector("#demo-form")?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const result = await post("/api/demo-answer", { displayName: form.get("name"), answer: form.get("answer") });
  if (result.state) render(result.state);
  if (result.accepted) showToast(result.correct ? text("correct")(result.score) : text("accepted"));
});

const setupOverlayUrl = document.querySelector("#setup-overlay-url");
if (setupOverlayUrl) setupOverlayUrl.value = new URL("/overlay", window.location.href).href;
const setupObsConfirm = document.querySelector("#setup-obs-confirm");
if (setupObsConfirm) setupObsConfirm.checked = localStorage.getItem("chatsprint-obs-confirmed") === "1";
setLanguage(currentLanguage, false);
showDesktopView(localStorage.getItem("chatsprint-setup-seen") ? (localStorage.getItem("chatsprint-desktop-view") || currentView) : "setup");
localStorage.setItem("chatsprint-setup-seen", "1");
setWindowMode("normal");
let stateSyncBusy = false;
async function syncState() {
  if (stateSyncBusy) return;
  stateSyncBusy = true;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4500);
  try {
    const response = await fetch(`/api/state?desktop=${Date.now()}`, { cache: "no-store", signal: controller.signal });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    render(await response.json());
  } catch {
    // The next polling cycle retries automatically, so a temporary hosting delay cannot freeze the UI.
  } finally {
    clearTimeout(timeout);
    stateSyncBusy = false;
  }
}
syncState();
setInterval(syncState, 1200);
setInterval(tickAnswerTimer, 250);
setInterval(tickNextTimer, 250);
loadQuestionBank();
checkOverlayReadiness();
