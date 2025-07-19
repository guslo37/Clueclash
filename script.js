let isRemote = false;
let currentTurn = null;
let timers = { red: 0, blue: 0 };
let intervalId = null;
let soundsEnabled = true;
let isFinalCountdown = false;

window.socket = new WebSocket("wss://clueclash-server.onrender.com");

// Elementos de la interfaz
const redTimer = document.getElementById("red-timer");
const blueTimer = document.getElementById("blue-timer");
const redBar = document.getElementById("red-bar");
const blueBar = document.getElementById("blue-bar");
const turnIndicator = document.getElementById("turn-indicator");
const finalCountdownSound = document.getElementById("final-countdown");
const timeoutSound = document.getElementById("timeout-sound");
const switchSound = document.getElementById("switch-sound");

// Pantalla de rol
const roleSelector = document.getElementById("role-selector");
const screenContainer = document.getElementById("screen-container");
const remoteContainer = document.getElementById("remote-container");

// Control remoto
const redTimeInput = document.getElementById("red-time");
const blueTimeInput = document.getElementById("blue-time");

function playSound(sound) {
  if (soundsEnabled && sound) {
    sound.currentTime = 0;
    sound.play().catch(() => {});
  }
}

function updateDisplay() {
  redTimer.textContent = formatTime(timers.red);
  blueTimer.textContent = formatTime(timers.blue);
  const total = timers.red + timers.blue;
  const redPercent = total ? (timers.red / total) * 100 : 50;
  redBar.style.width = `${redPercent}%`;
  blueBar.style.width = `${100 - redPercent}%`;
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function startTurn(team) {
  stopTimer();
  currentTurn = team;
  turnIndicator.className = team;
  intervalId = setInterval(() => {
    if (timers[team] > 0) {
      timers[team]--;
      updateDisplay();

      if (timers[team] === 30) {
        isFinalCountdown = true;
      }

      if (isFinalCountdown && timers[team] <= 30) {
        playSound(finalCountdownSound);
      }
    } else {
      stopTimer();
      playSound(timeoutSound);
    }
  }, 1000);
  playSound(switchSound);
  updateDisplay();
}

function stopTimer() {
  clearInterval(intervalId);
  isFinalCountdown = false;
}

function handleRemoteAction(action) {
  switch (action.type) {
    case "start":
      timers = { red: action.red, blue: action.blue };
      startTurn("red");
      break;
    case "switch":
      startTurn(currentTurn === "red" ? "blue" : "red");
      break;
    case "reset":
      timers = { red: action.red, blue: action.blue };
      currentTurn = null;
      stopTimer();
      updateDisplay();
      break;
    case "sound":
      soundsEnabled = action.enabled;
      break;
  }
}

socket.addEventListener("open", () => {
  console.log("Conectado al servidor WebSocket");
});

socket.addEventListener("message", (event) => {
  const data = JSON.parse(event.data);
  if (!isRemote) {
    handleRemoteAction(data);
  }
});

// --- Interfaz control remoto ---
document.getElementById("start-btn").addEventListener("click", () => {
  const red = parseInt(redTimeInput.value, 10) * 60 || 180;
  const blue = parseInt(blueTimeInput.value, 10) * 60 || 180;
  socket.send(JSON.stringify({ type: "start", red, blue }));
});

document.getElementById("switch-btn").addEventListener("click", () => {
  socket.send(JSON.stringify({ type: "switch" }));
});

document.getElementById("reset-btn").addEventListener("click", () => {
  const red = parseInt(redTimeInput.value, 10) * 60 || 180;
  const blue = parseInt(blueTimeInput.value, 10) * 60 || 180;
  socket.send(JSON.stringify({ type: "reset", red, blue }));
});

document.getElementById("sound-toggle").addEventListener("change", (e) => {
  const enabled = e.target.checked;
  socket.send(JSON.stringify({ type: "sound", enabled }));
});

// --- Selector de rol ---
document.getElementById("screen-btn").addEventListener("click", () => {
  isRemote = false;
  roleSelector.style.display = "none";
  screenContainer.style.display = "block";
});

document.getElementById("remote-btn").addEventListener("click", () => {
  isRemote = true;
  roleSelector.style.display = "none";
  remoteContainer.style.display = "block";
});
