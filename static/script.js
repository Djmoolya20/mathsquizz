'use strict';
// ── State ──
let timeLeft, timerInterval, timePerQ, totalQ = 10, hintUsed = false;
const DIFF_NOTES = {
  easy:   "Easy: numbers 1–30 • 20 sec/question",
  normal: "Normal: numbers 30–100 • 15 sec/question",
  hard:   "Hard: numbers 100–1000 • 8 sec/question"
};

// ── Helpers ──
const $  = id => document.getElementById(id);
const show = id => {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  $(id).classList.add("active");
};
const getActive = gid => document.querySelector(`#${gid} .pill.active`)?.dataset.val;

// ── Setup: pill groups ──
document.querySelectorAll(".pill-group").forEach(grp => {
  grp.querySelectorAll(".pill").forEach(btn => {
    btn.addEventListener("click", () => {
      grp.querySelectorAll(".pill").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      if (grp.id === "diff-group") $("diff-note").textContent = DIFF_NOTES[btn.dataset.val];
    });
  });
});

// ── Question stepper ──
$("q-minus").addEventListener("click", () => { if (totalQ > 1) $("q-display").textContent = --totalQ; });
$("q-plus" ).addEventListener("click", () => { if (totalQ < 50) $("q-display").textContent = ++totalQ; });

// ── Start ──
$("start-btn").addEventListener("click", async () => {
  const body = { difficulty: getActive("diff-group") || "easy",
                 operator:   getActive("op-group")   || "+",
                 total:      totalQ };
  const res  = await fetch("/api/start", { method:"POST",
    headers:{"Content-Type":"application/json"}, body: JSON.stringify(body) });
  const data = await res.json();
  timePerQ = data.time_per_q;
  show("quiz");
  loadQuestion();
});

// ── Load question ──
async function loadQuestion() {
  hintUsed = false;
  $("hint-box").classList.add("hidden");
  $("feedback").classList.add("hidden");
  $("answer-input").value = "";
  $("answer-input").disabled = false;
  $("submit-btn").disabled = false;

  const res  = await fetch("/api/question");
  const data = await res.json();

  $("question-text").textContent = data.question;
  $("q-label").textContent = `Question ${data.num} of ${data.total}`;
  $("progress-fill").style.width = `${((data.num - 1) / data.total) * 100}%`;

  startTimer(data.time_per_q || timePerQ);
  $("answer-input").focus();
}

// ── Timer ──
function startTimer(seconds) {
  clearInterval(timerInterval);
  timeLeft = seconds;
  updateTimerUI(timeLeft, seconds);
  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerUI(timeLeft, seconds);
    if (timeLeft <= 0) { clearInterval(timerInterval); handleTimeout(); }
  }, 1000);
}

function updateTimerUI(t, total) {
  $("timer-num").textContent = t;
  const circ = 214, pct = t / total;
  $("ring-fg").style.strokeDashoffset = circ * (1 - pct);
  $("ring-fg").style.stroke =
    pct > .5 ? "var(--green)" : pct > .25 ? "var(--orange)" : "var(--red)";
  if (t <= 5) $("timer-num").style.color = "var(--red)";
  else        $("timer-num").style.color = "var(--text)";
}

async function handleTimeout() {
  $("answer-input").disabled = true;
  $("submit-btn").disabled   = true;
  const res  = await fetch("/api/answer", { method:"POST",
    headers:{"Content-Type":"application/json"}, body: JSON.stringify({answer:"", timed_out:true}) });
  const data = await res.json();
  showFeedback("timeout", `⏰ Time's up! Answer was ${data.answer}`);
  updateTopBar(data.score, data.streak);
  if (data.done) setTimeout(showResult, 1400);
  else           setTimeout(loadQuestion, 1400);
}

// ── Submit ──
async function submitAnswer() {
  const val = $("answer-input").value.trim();
  if (val === "" || $("submit-btn").disabled) return;
  clearInterval(timerInterval);
  $("answer-input").disabled = true;
  $("submit-btn").disabled   = true;

  const res  = await fetch("/api/answer", { method:"POST",
    headers:{"Content-Type":"application/json"}, body: JSON.stringify({answer: val}) });
  const data = await res.json();

  if (data.correct) showFeedback("correct", `✅ Correct! +1 point${data.streak > 1 ? ` 🔥 ${data.streak} streak!` : ""}`);
  else              showFeedback("wrong",   `❌ Oops! Answer was ${data.answer}`);

  updateTopBar(data.score, data.streak);
  if (data.done) setTimeout(showResult, 1100);
  else           setTimeout(loadQuestion, 1100);
}

$("submit-btn").addEventListener("click", submitAnswer);
$("answer-input").addEventListener("keydown", e => { if (e.key === "Enter") submitAnswer(); });

function showFeedback(type, msg) {
  const fb = $("feedback");
  fb.textContent = msg;
  fb.className   = `feedback ${type}`;
}

function updateTopBar(score, streak) {
  $("live-score").textContent   = score;
  $("streak-count").textContent = streak;
  $("streak-chip").style.opacity = streak > 0 ? "1" : ".4";
}

// ── Hint ──
$("hint-btn").addEventListener("click", async () => {
  if (hintUsed) return;
  hintUsed = true;
  const res  = await fetch("/api/hint");
  const data = await res.json();
  const box  = $("hint-box");
  box.textContent = "💡 " + data.hint;
  box.classList.remove("hidden");
});

// ── Quit modal ──
$("quit-btn").addEventListener("click", () => {
  $("modal-attempted").textContent = $("q-label").textContent.split(" ")[1] - 1 || 0;
  $("quit-modal").classList.remove("hidden");
  clearInterval(timerInterval);
});
$("modal-cancel").addEventListener("click", () => {
  $("quit-modal").classList.add("hidden");
  startTimer(timeLeft > 0 ? timeLeft : timePerQ);
});
$("modal-quit").addEventListener("click", async () => {
  $("quit-modal").classList.add("hidden");
  clearInterval(timerInterval);
  await fetch("/api/quit", { method:"POST" });
  showResult();
});

// ── Result ──
async function showResult() {
  clearInterval(timerInterval);
  const res  = await fetch("/api/score");
  const data = await res.json();

  const emojis = { "PERFECT":["🏆","gold"], "AMAZING":["🌟","gold"],
                   "GREAT":["🎉","green"], "GOOD":["👍","blue"], "KEEP":["💪","purple"] };
  const key    = Object.keys(emojis).find(k => data.grade.includes(k)) || "KEEP";
  $("result-emoji").textContent  = emojis[key][0];
  $("grade-text").textContent    = data.grade;
  $("final-score").textContent   = data.correct;
  $("final-total").textContent   = data.total;
  $("pct-label").textContent     = data.pct + "%";
  $("best-streak").textContent   = data.best_streak;
  $("result-diff").textContent   = sessionDiff();

  show("result");
  setTimeout(() => { $("pct-fill").style.width = data.pct + "%"; }, 100);

  // Review list
  const list = $("review-list");
  list.innerHTML = "";
  data.history.forEach((item, i) => {
    const div = document.createElement("div");
    div.className = `review-item ${item.is_correct ? "ok" : "bad"}`;
    div.innerHTML = `
      <span>${item.is_correct ? "✅" : item.timed_out ? "⏰" : "❌"}</span>
      <span class="ri-q">Q${i+1}: ${item.q} = ?</span>
      <span class="ri-ans">${item.is_correct ? item.correct_ans : `${item.timed_out?"(timeout)":item.player_ans} → ${item.correct_ans}`}</span>`;
    list.appendChild(div);
  });
}

function sessionDiff() {
  const a = document.querySelector("#diff-group .pill.active");
  return a ? a.textContent.trim() : "—";
}

$("restart-btn").addEventListener("click", () => {
  $("pct-fill").style.width = "0%";
  $("progress-fill").style.width = "0%";
  $("live-score").textContent = $("streak-count").textContent = "0";
  show("setup");
});