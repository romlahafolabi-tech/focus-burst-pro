// SCREENS
let screens = document.querySelectorAll(".screen");

// SESSIONS
let sessions = Number(localStorage.getItem("sessions")) || 0;

// ELEMENTS
const sessionCount = document.getElementById("sessionCount");
const timeDisplay = document.getElementById("timeDisplay");
const quoteBox = document.getElementById("quoteBox");
const sound = document.getElementById("sound");
const purposeInput = document.getElementById("purpose");
const timeValue = document.getElementById("timeValue");
const timeUnit = document.getElementById("timeUnit");

sessionCount.textContent = sessions;

// TIMER VARIABLES
let remainingTime = 0;
let timerInterval;
let quoteIndex = 0;
let quoteInterval;
let quoteList = [
  "Stay with it.",
  "You chose this purpose.",
  "Don’t quit now.",
  "This is discipline.",
  "You’re building focus.",
];

// NAVIGATION
function goTo(id) {
  screens.forEach((s) => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

// START SESSION
function startSession() {
  let value = Number(timeValue.value);
  if (!value) return alert("Set a time");

  let unit = timeUnit.value;
  if (unit === "seconds") remainingTime = value;
  if (unit === "minutes") remainingTime = value * 60;
  if (unit === "hours") remainingTime = value * 3600;

  goTo("timer");
  runTimer();
  rotateQuotes();
}

// TIMER LOGIC
function runTimer() {
  updateDisplay();
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    remainingTime--;
    if (remainingTime < 0) remainingTime = 0; // Fix negative countdown
    updateDisplay();
    if (remainingTime <= 0) finishSession();
  }, 1000);
}

function updateDisplay() {
  let m = Math.floor(remainingTime / 60);
  let s = remainingTime % 60;
  timeDisplay.textContent = `${String(m).padStart(2, "0")}:${String(s).padStart(
    2,
    "0"
  )}`;
}

// PAUSE / RESUME
function pause() {
  clearInterval(timerInterval);
}
function resume() {
  runTimer();
}

// FINISH SESSION
function finishSession() {
  clearInterval(timerInterval);
  remainingTime = 0;
  updateDisplay();
  sound.play();
  confetti();

  // SESSIONS
  sessions++;
  localStorage.setItem("sessions", sessions);
  sessionCount.textContent = sessions;

  saveHistory(true);
  goTo("setup");

  // VIBRATION (MOBILE)
  if ("vibrate" in navigator) navigator.vibrate([100, 50, 100]);
}

// END SESSION
function endSession() {
  clearInterval(timerInterval);
  saveHistory(false);
  goTo("setup");
}

// QUOTES ROTATION (GLIDE UP SLOWLY)
function rotateQuotes() {
  clearInterval(quoteInterval);

  quoteBox.textContent = quoteList[quoteIndex % quoteList.length];
  quoteBox.classList.add("slide-up");
  quoteIndex++;

  quoteInterval = setInterval(() => {
    // slide out current quote
    quoteBox.classList.remove("slide-up");
    quoteBox.classList.add("slide-out");

    setTimeout(() => {
      quoteBox.textContent = quoteList[quoteIndex % quoteList.length];
      quoteBox.classList.remove("slide-out");
      quoteBox.classList.add("slide-up");
      quoteIndex++;
    }, 1000); // match CSS animation duration
  }, 6000);
}

// HISTORY
function saveHistory(completed) {
  let history = JSON.parse(localStorage.getItem("history") || "[]");
  history.push({
    purpose: purposeInput.value || "No purpose",
    completed,
    date: new Date().toLocaleString(),
  });
  localStorage.setItem("history", JSON.stringify(history));
  renderHistory();
}

function renderHistory() {
  let list = document.getElementById("historyList");
  list.innerHTML = "";
  let history = JSON.parse(localStorage.getItem("history") || "[]");
  history.reverse().forEach((h) => {
    let div = document.createElement("div");
    div.textContent = `${h.date} - ${h.purpose} - ${
      h.completed ? "Completed" : "Broken"
    }`;
    list.appendChild(div);
  });
}

// RESET MODAL
function openReset() {
  document.getElementById("resetModal").style.display = "flex";
}
function closeReset() {
  document.getElementById("resetModal").style.display = "none";
}
function resetHistory() {
  localStorage.removeItem("history");
  renderHistory();
  closeReset();
}
function resetSessions() {
  localStorage.removeItem("sessions");
  sessionCount.textContent = 0;
  closeReset();
}
function resetAll() {
  localStorage.clear();
  location.reload();
}
