let role = null;
let timerRed = 0;
let timerBlue = 0;
let activeTeam = null;
let interval = null;
let soundsEnabled = true;

const soundSwitch = document.getElementById("sound-switch");
const soundGoat = document.getElementById("sound-goat");
const soundTick = document.getElementById("sound-tick");

document.addEventListener("DOMContentLoaded", () => {
  // Mostrar selector de rol
  document.getElementById("role-selection").style.display = "block";
  document.getElementById("screen-view").style.display = "none";
  document.getElementById("remote-view").style.display = "none";
});

function setRole(selectedRole) {
  role = selectedRole;
  sessionStorage.setItem("role", role);

  document.getElementById("role-selection").style.display = "none";

  if (role === "screen") {
    document.getElementById("screen-view").style.display = "block";
    activateSoundsOnInteraction();
  } else if (role === "remote") {
    document.getElementById("remote-view").style.display = "block";
  }
}

function activateSoundsOnInteraction() {
  // Safari requiere interacción para activar audio
  document.body.addEventListener("click", () => {
    [soundSwitch, soundGoat, soundTick].forEach(s => {
      s.play().catch(() => {});
      s.pause();
      s.currentTime = 0;
    });
  }, { once: true });
}

function startGame() {
  const minutes = parseInt(document.getElementById("time-input").value);
  if (isNaN(minutes) || minutes <= 0) {
    alert("Por favor ingresa un tiempo válido (minutos).");
    return;
  }

  timerRed = minutes * 60;
  timerBlue = minutes * 60;
  activeTeam = "red";
  updateTimers();
  playSound("switch");

  if (interval) clearInterval(interval);
  interval = setInterval(tick, 1000);
}

function tick() {
  if (activeTeam === "red") {
    timerRed--;
    if (timerRed <= 0) {
      timerRed = 0;
      endTurn();
    }
  } else if (activeTeam === "blue") {
    timerBlue--;
    if (timerBlue <= 0) {
      timerBlue = 0;
      endTurn();
    }
  }
  updateTimers();
  playTickSoundIfNeeded();
}

function playTickSoundIfNeeded() {
  let timeLeft = activeTeam === "red" ? timerRed : timerBlue;
  if (timeLeft <= 30 && timeLeft > 0) {
    playSound("tick");
  }
}

function endTurn() {
  playSound("goat");
  clearInterval(interval);
  interval = null;
  alert(`¡Se acabó el tiempo del equipo ${activeTeam === "red" ? "Rojo" : "Azul"}!`);
}

function switchTurn() {
  if (!activeTeam) return;
  activeTeam = activeTeam === "red" ? "blue" : "red";
  playSound("switch");
  updateTimers();
}

function resetGame() {
  clearInterval(interval);
  interval = null;
  timerRed = 0;
  timerBlue = 0;
  activeTeam = null;
  updateTimers();
}

function updateTimers() {
  const redEl = document.getElementById("team-red");
  const blueEl = document.getElementById("team-blue");

  redEl.textContent = formatTime(timerRed);
  blueEl.textContent = formatTime(timerBlue);

  redEl.style.backgroundColor = activeTeam === "red" ? "#c62828" : "#666";
  blueEl.style.backgroundColor = activeTeam === "blue" ? "#1565c0" : "#666";
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function toggleSound() {
  soundsEnabled = !soundsEnabled;
  alert(`Sonidos ${soundsEnabled ? "activados" : "silenciados"}`);
}

function playSound(type) {
  if (!soundsEnabled) return;
  switch (type) {
    case "switch":
      soundSwitch.play().catch(() => {});
      break;
    case "goat":
      soundGoat.play().catch(() => {});
      break;
    case "tick":
      soundTick.play().catch(() => {});
      break;
  }
}
