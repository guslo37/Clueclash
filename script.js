// Variables de tiempo por equipo en segundos (configurable)
let timeRed = 600; // 10 minutos por defecto
let timeBlue = 600;

let intervalId = null;
let currentTeam = null; // 'red' o 'blue'
let isPaused = true;

const timeRedEl = document.getElementById('time-red');
const timeBlueEl = document.getElementById('time-blue');
const statusEl = document.getElementById('status');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');

// Sonidos
const soundTurn = new Audio('sounds/soft-bip.mp3');
const soundGoat = new Audio('sounds/goat-sound.mp3');
// Sonidos para últimos 30 segundos
const countdownSounds = [];
for(let i=1; i<=30; i++){
  countdownSounds.push(new Audio(`sounds/countdown-${i}.mp3`));
}

// Función para formatear tiempo en mm:ss
function formatTime(seconds){
  const m = Math.floor(seconds/60).toString().padStart(2,'0');
  const s = (seconds%60).toString().padStart(2,'0');
  return `${m}:${s}`;
}

// Actualiza los tiempos en la UI
function updateDisplay(){
  timeRedEl.textContent = formatTime(timeRed);
  timeBlueEl.textContent = formatTime(timeBlue);
}

// Cambiar turno
function changeTurn(){
  if(currentTeam === 'red'){
    currentTeam = 'blue';
  } else {
    currentTeam = 'red';
  }
  soundTurn.play();
  statusEl.textContent = `Turno del equipo ${currentTeam === 'red' ? 'Rojo' : 'Azul'}`;
}

// Contar tiempo
function tick(){
  if(isPaused || !currentTeam) return;

  if(currentTeam === 'red'){
    if(timeRed > 0){
      timeRed--;
      if(timeRed <= 30 && timeRed > 0){
        countdownSounds[30 - timeRed - 1].play();
      } else if(timeRed === 0){
        soundGoat.play();
        clearInterval(intervalId);
        statusEl.textContent = '¡El tiempo del equipo Rojo terminó!';
      }
    }
  } else if(currentTeam === 'blue'){
    if(timeBlue > 0){
      timeBlue--;
      if(timeBlue <= 30 && timeBlue > 0){
        countdownSounds[30 - timeBlue - 1].play();
      } else if(timeBlue === 0){
        soundGoat.play();
        clearInterval(intervalId);
        statusEl.textContent = '¡El tiempo del equipo Azul terminó!';
      }
    }
  }
  updateDisplay();
}

function start(){
  if(!currentTeam){
    currentTeam = 'red'; // Empezar con rojo por defecto
    statusEl.textContent = 'Turno del equipo Rojo';
  }
  if(isPaused){
    isPaused = false;
    intervalId = setInterval(tick, 1000);
  }
}

function pause(){
  isPaused = true;
  clearInterval(intervalId);
}

function reset(){
  pause();
  timeRed = 600;
  timeBlue = 600;
  currentTeam = null;
  statusEl.textContent = 'Juego reiniciado';
  updateDisplay();
}

startBtn.addEventListener('click', start);
pauseBtn.addEventListener('click', pause);
resetBtn.addEventListener('click', reset);

updateDisplay();

