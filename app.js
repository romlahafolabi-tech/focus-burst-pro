let interval;
let time;
let streak = Number(localStorage.getItem("streak")) || 0;
let sessions = Number(localStorage.getItem("sessions")) || 0;

const challenges = [
  "💧 Drink water",
  "🧍 Stretch for 30 seconds",
  "✍️ Write what you learned",
  "👀 Rest your eyes",
  "📖 Review notes briefly",
  "🧠 Breathe deeply 5 times",
];

document.getElementById("streak").textContent = streak;
document.getElementById("sessions").textContent = sessions;

function startTimer() {
  if (interval) return;

  const minutes = document.getElementById("duration").value;
  time = minutes * 60;

  interval = setInterval(() => {
    time--;

    const m = Math.floor(time / 60);
    const s = time % 60;

    document.getElementById("timer").textContent = `${m}:${
      s < 10 ? "0" : ""
    }${s}`;

    if (time <= 0) finishSession();
  }, 1000);
}

function finishSession() {
  clearInterval(interval);
  interval = null;

  streak++;
  sessions++;

  localStorage.setItem("streak", streak);
  localStorage.setItem("sessions", sessions);

  document.getElementById("streak").textContent = streak;
  document.getElementById("sessions").textContent = sessions;

  document.getElementById("sound").play();
  if (navigator.vibrate) navigator.vibrate([200, 100, 200]);

  const random = challenges[Math.floor(Math.random() * challenges.length)];

  document.getElementById("challenge").textContent =
    "🎉 Session complete! " + random;
}

function resetTimer() {
  clearInterval(interval);
  interval = null;
  document.getElementById("timer").textContent = "25:00";
}

function toggleTheme() {
  document.body.classList.toggle("light");
}
