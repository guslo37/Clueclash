// Sonidos embebidos en base64 (pequeños y comprimidos)

// Bip suave (cambio de turno)
const soundTurn = new Audio("data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU2LjM5LjEwNAAAAAAAAAAAAAAA//tQxAADBv8AAAAGAAABAAEAAAEBAAAIBwAAAAAA");

// Sonido cabra (fin de tiempo)
const soundGoat = new Audio("data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU2LjM5LjEwNAAAAAAAAAAAAAAA//uQxAADBv8AAAAGAAABAAEAAAEBAAAIBwAAAAAA");

// Sonido para últimos 30 segundos (mismo sonido repetido)
const countdownSound = new Audio("data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU2LjM5LjEwNAAAAAAAAAAAAAAA//vQxAADBv8AAAAGAAABAAEAAAEBAAAIBwAAAAAA");

// Variables de tiempo por equipo en segundos (configurable)
let timeRed = 60; // 10 minutos
let timeBlue = 60;

let intervalId = null;
let currentTeam = null; // 'red' o 'blue'
let isPaused = true;

const timeRedEl = document.getElementById('time-red');
const timeBlueEl = document.getElementById('time-blue');
const statusEl = document.getElementById('status');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');

// Formatear tiempo mm:ss
function formatTime(seconds){
  const m = Math.floor(seconds/60).toString().padStart(2,'0');
  const s = (seconds%60).toString().padStart(2,'0');
  return `${m}:${s}`;
}

function updateDisplay(){
  timeRedEl.textContent = formatTime(timeRed);
  timeBlueEl.textContent = formatTime(timeBlue);
}

function changeTurn(){
  if(currentTeam === 'red'){
    currentTeam = 'blue';
  } else {
    currentTeam = 'red';
  }
  soundTurn.play();
  statusEl.textContent = `Turno del equipo ${currentTeam === 'red' ? 'Rojo' : 'Azul'}`;
}

function tick(){
  if(isPaused || !currentTeam) return;

  if(currentTeam === 'red'){
    if(timeRed > 0){
      timeRed--;
      if(timeRed <= 30 && timeRed > 0){
        countdownSound.play();
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
        countdownSound.play();
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
    currentTeam = 'red'; // Empieza rojo
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
