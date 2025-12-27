// Sections
const sections = document.querySelectorAll(".section");
function showSection(id) {
  sections.forEach((s) => (s.style.display = "none"));
  document.getElementById(id).style.display = "flex";
}

// Back buttons
document.querySelectorAll(".backBtn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const target = btn.dataset.back;
    showSection(target);
    clearInterval(timerInterval);
    quoteContainer.innerHTML = "";
  });
});

// Home buttons
document
  .getElementById("getStartedBtn")
  .addEventListener("click", () => showSection("setupSection"));
document
  .getElementById("howItWorksBtn")
  .addEventListener("click", () => showSection("howItWorksSection"));
document
  .getElementById("historyBtn")
  .addEventListener("click", () => showSection("historySection"));

// Streak
let streakCount = Number(localStorage.getItem("streakCount") || 0);
document.getElementById("streakCount").textContent = streakCount;

// Timer Setup
const beginBtn = document.getElementById("beginBtn");
const purposeInput = document.getElementById("purpose");
const durationInput = document.getElementById("duration");
const unitSelect = document.getElementById("unit");
const timeDisplay = document.getElementById("time");
const quoteContainer = document.getElementById("quoteContainer");
const progressCircle = document.querySelector(".progress");
const sound = document.getElementById("sound");

let remainingTime = 0;
let totalTime = 0;
let timerInterval = null;

// History
function updateHistory(purpose, startTime, endTime, duration) {
  const history = JSON.parse(localStorage.getItem("history") || "[]");
  history.push({ purpose, start: startTime, end: endTime, duration });
  localStorage.setItem("history", JSON.stringify(history));
  renderHistory();
}

function renderHistory() {
  const table = document.getElementById("historyTable");
  table.innerHTML = `<tr>
    <th>Purpose</th><th>Duration</th><th>Start</th><th>End</th>
  </tr>`;
  const history = JSON.parse(localStorage.getItem("history") || "[]");
  history.forEach((h) => {
    const row = table.insertRow();
    row.insertCell(0).textContent = h.purpose;
    row.insertCell(1).textContent = h.duration;
    row.insertCell(2).textContent = h.start;
    row.insertCell(3).textContent = h.end;
  });
}

renderHistory();

// Timer
beginBtn.addEventListener("click", () => {
  let time = Number(durationInput.value);
  if (unitSelect.value === "minutes") time *= 60;
  if (unitSelect.value === "hours") time *= 3600;
  remainingTime = totalTime = time;
  showSection("timerSection");
  startTimer();
});

// Timer functions
const quotes = [
  "Keep going!",
  "Stay Focused!",
  "You got this!",
  "Almost there!",
  "Focus!",
];
function startTimer() {
  timerInterval = setInterval(() => {
    if (remainingTime <= 0) {
      finishTimer();
      return;
    }
    remainingTime--;
    updateDisplay();
    updateProgress();
  }, 1000);
  showNextQuote(0);
}

function updateDisplay() {
  const m = Math.floor(remainingTime / 60);
  const s = remainingTime % 60;
  timeDisplay.textContent = `${String(m).padStart(2, "0")}:${String(s).padStart(
    2,
    "0"
  )}`;
}

function updateProgress() {
  const circumference = 2 * Math.PI * 90;
  const offset = circumference * (1 - remainingTime / totalTime);
  progressCircle.style.strokeDasharray = circumference;
  progressCircle.style.strokeDashoffset = offset;
}

function showNextQuote(index) {
  if (remainingTime <= 0) return;
  quoteContainer.innerHTML = "";
  const quoteText = document.createElement("div");
  quoteText.classList.add("quote");
  quoteText.textContent = quotes[index];
  quoteContainer.appendChild(quoteText);
  let bottom = -50;
  const move = setInterval(() => {
    bottom += 1;
    quoteText.style.bottom = bottom + "px";
    if (bottom > 50) {
      clearInterval(move);
      showNextQuote((index + 1) % quotes.length);
    }
  }, 150);
}

// Controls
document
  .getElementById("pauseBtn")
  .addEventListener("click", () => clearInterval(timerInterval));
document
  .getElementById("resumeBtn")
  .addEventListener("click", () => startTimer());
document.getElementById("endBtn").addEventListener("click", finishTimer);

function finishTimer() {
  clearInterval(timerInterval);
  remainingTime = 0;
  updateDisplay();
  sound.play();
  confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });

  streakCount++;
  localStorage.setItem("streakCount", streakCount);
  document.getElementById("streakCount").textContent = streakCount;

  // Add history
  const purpose = purposeInput.value || "No Purpose";
  const startTime = new Date().toLocaleString();
  const endTime = new Date().toLocaleString();
  const durationUsed = `${Math.floor(totalTime / 60)} min`;
  updateHistory(purpose, startTime, endTime, durationUsed);

  showSection("setupSection");
  quoteContainer.innerHTML = "";
}
