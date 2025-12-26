let interval, motivationInterval;
let remainingTime;
let streak = Number(localStorage.getItem("streak")) || 0;
let sessions = Number(localStorage.getItem("sessions")) || 0;

const studyChallenges = {
  general: ["💧 Drink water", "🧍 Stretch", "🧠 Deep breathing"],
  dsa: [
    "📌 Revise an algorithm",
    "✍️ Write edge case",
    "🧠 Explain concept out loud",
  ],
  exam: [
    "📝 Recall 3 key points",
    "📖 Skim notes",
    "❓ Answer 1 practice question",
  ],
};
const motivationalWords = [
  "Keep going!",
  "You got this!",
  "Stay focused!",
  "Almost there!",
  "Great job!",
];

document.getElementById("streak").textContent = streak;
document.getElementById("sessions").textContent = sessions;

// Timer
function startTimer() {
  const h = Number(document.getElementById("durationHour").value) || 0;
  const m = Number(document.getElementById("durationMin").value) || 0;
  const s = Number(document.getElementById("durationSec").value) || 0;
  remainingTime = h * 3600 + m * 60 + s;
  if (remainingTime <= 0) {
    alert("Please enter duration.");
    return;
  }

  const purpose =
    document.getElementById("sessionPurpose").value || "No purpose";
  const mode = document.getElementById("studyMode").value;
  const startTime = new Date().toLocaleString();

  document.getElementById("preSession").style.display = "none";
  document.getElementById("sessionArea").style.display = "block";

  interval = setInterval(() => {
    remainingTime--;
    updateTimerDisplay();
    showMotivation();
    createParticle();
    if (remainingTime <= 0) finishSession(purpose, mode, startTime);
  }, 1000);
}

function updateTimerDisplay() {
  const h = Math.floor(remainingTime / 3600);
  const m = Math.floor((remainingTime % 3600) / 60);
  const s = remainingTime % 60;
  document.getElementById("timer").textContent = `${String(h).padStart(
    2,
    "0"
  )}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function showMotivation() {
  const msg =
    motivationalWords[Math.floor(Math.random() * motivationalWords.length)];
  const mot = document.getElementById("motivation");
  mot.textContent = msg;
  mot.style.opacity = 1;
  setTimeout(() => {
    mot.style.opacity = 0;
  }, 18000);
}

function createParticle() {
  const particle = document.createElement("div");
  particle.classList.add("particle");
  particle.style.left = Math.random() * window.innerWidth + "px";
  particle.style.top = window.innerHeight + "px";
  document.body.appendChild(particle);
  setTimeout(() => particle.remove(), 3000);
}

function pauseTimer() {
  clearInterval(interval);
}

function resumeTimer() {
  interval = setInterval(() => {
    remainingTime--;
    updateTimerDisplay();
    showMotivation();
    createParticle();
    if (remainingTime <= 0)
      finishSession(
        "Resumed session",
        document.getElementById("studyMode").value,
        new Date().toLocaleString()
      );
  }, 1000);
}

function finishSession(purpose, mode, startTime) {
  clearInterval(interval);
  document.getElementById("timer").textContent = "00:00:00";

  // Play sound once
  document.getElementById("sound").play();
  // Confetti
  confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });

  streak++;
  sessions++;
  localStorage.setItem("streak", streak);
  localStorage.setItem("sessions", sessions);
  document.getElementById("streak").textContent = streak;
  document.getElementById("sessions").textContent = sessions;

  const challengeList = studyChallenges[mode];
  const randomChallenge =
    challengeList[Math.floor(Math.random() * challengeList.length)];
  document.getElementById("challenge").textContent =
    "🎉 Session complete! " + randomChallenge;

  // History
  const endTime = new Date().toLocaleString();
  const durationUsed = formatDuration(h * 3600 + m * 60 + s);
  const history = JSON.parse(localStorage.getItem("history") || "[]");
  history.push({
    purpose,
    mode,
    duration: durationUsed,
    start: startTime,
    end: endTime,
  });
  localStorage.setItem("history", JSON.stringify(history));
  renderHistory();

  document.getElementById("preSession").style.display = "block";
  document.getElementById("sessionArea").style.display = "none";
}

function formatDuration(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h}h ${m}m ${s}s`;
}

function renderHistory() {
  const table = document.getElementById("historyTable");
  table.innerHTML = `<tr>
    <th>Purpose</th><th>Mode</th><th>Duration</th><th>Start</th><th>End</th>
  </tr>`;
  const history = JSON.parse(localStorage.getItem("history") || "[]");
  history.forEach((h) => {
    const row = table.insertRow();
    row.insertCell(0).textContent = h.purpose;
    row.insertCell(1).textContent = h.mode;
    row.insertCell(2).textContent = h.duration;
    row.insertCell(3).textContent = h.start;
    row.insertCell(4).textContent = h.end;
  });
}

renderHistory();

function resetTimer() {
  clearInterval(interval);
  remainingTime = 0;
  updateTimerDisplay();
  document.getElementById("sessionArea").style.display = "none";
  document.getElementById("preSession").style.display = "block";
  document.getElementById("challenge").textContent = "";
}
