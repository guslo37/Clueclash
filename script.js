let role = null;
let timerRed = 0;
let timerBlue = 0;
let activeTeam = null;
let interval = null;
let soundsEnabled = true;

const sounds = {
  switch: new Audio("sounds/switch.mp3"),
  end: new Audio("sounds/goat.mp3"),
  tick: new Audio("sounds/tick.mp3"),
};

document.addEventListener("DOMContentLoaded", () => {
  if (!sessionStorage.getItem("role")) {
    const choice = confirm("¿Usar este dispositivo como PANTALLA?\nPresiona 'Aceptar' para Pantalla, 'Cancelar' para Control Remoto.");
    role = choice ? "screen" : "remote";
    sessionStorage.setItem("role", role);
  } else {
    role = sessionStorage.getItem("role");
  }

  if (role === "screen") initScreen();
  else initRemote();
});

function initScreen() {
  document.body.innerHTML = `
    <div id="screen">
      <h1>ClueClash Clock Wars</h1>
      <div id="timers">
        <div id="red" class="team">00:00</div>
        <div id="blue" class="team">00:00</div>
      </div>
      <button onclick="toggleSound()">🔊</button>
    </div>
  `;
  document.body.addEventListener("click", () => {
    // Activar sonidos en Safari
    Object.values(sounds).forEach(s => s.play().catch(() => {}));
  }, { once: true });

  // Simulación de conexión WebSocket entre dispositivos
  window.addEventListener("message", (e) => {
    const { type, payload } = e.data;
    if (type === "start") startTimers(payload);
    if (type === "switch") switchTurn();
    if (type === "reset") resetTimers();
  });
}

function initRemote() {
  document.body.innerHTML = `
    <div id="remote">
      <h2>Control Remoto</h2>
      <label>Tiempo por equipo (segundos): <input id="timeInput" type="number" value="60" /></label>
      <button onclick="sendStart()">Iniciar</button>
      <button onclick="sendSwitch()">Cambiar turno</button>
      <button onclick="sendReset()">Reiniciar</button>
    </div>
  `;
}

function sendStart() {
  const time = parseInt(document.getElementById("timeInput").value);
  parent.postMessage({ type: "start", payload: time }, "*");
}
function sendSwitch() {
  parent.postMessage({ type: "switch" }, "*");
}
function sendReset() {
  parent.postMessage({ type: "reset" }, "*");
}

function startTimers(time) {
  timerRed = time;
  timerBlue = time;
  activeTeam = "red";
  updateTimers();
  playSound("switch");
  if (interval) clearInterval(interval);
  interval = setInterval(() => tick(), 1000);
}

function tick() {
  if (activeTeam === "red") timerRed--;
  else timerBlue--;

  updateTimers();

  const timeLeft = activeTeam === "red" ? timerRed : timerBlue;

  if (timeLeft
