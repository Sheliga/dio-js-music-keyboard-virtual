const pianoKeys = document.querySelectorAll(".piano-keys .key");
const volumeSlider = document.querySelector(".volume-slider input");
const keysToggle = document.querySelector(".keys-toggle input");

const btnStart = document.getElementById("start-record");
const btnStop = document.getElementById("stop-record");
const btnPlay = document.getElementById("play-recording");

const pressedKeys = Array.from(pianoKeys, (key) => key.dataset.key);
let audio = new Audio();

let isRecording = false;
let recording = [];
let recordStartTime = 0;

function playTune(key) {
  audio.src = `src/tunes/${key}.wav`;
  audio.play();

  const keyElement = document.querySelector(`[data-key="${key}"]`);
  if (!keyElement) return;

  keyElement.classList.add("active");
  setTimeout(() => keyElement.classList.remove("active"), 150);

  if (isRecording) {
    const time = Date.now() - recordStartTime;
    recording.push({ key, time });
  }
}

function handleKeyDown(event) {
  if (pressedKeys.includes(event.key)) {
    playTune(event.key);
  }
}

function handleVolumeChange(event) {
  audio.volume = event.target.value;
}

function toggleKeyLabels() {
  pianoKeys.forEach((key) => key.classList.toggle("hide"));
}

function startRecording() {
  recording = [];
  recordStartTime = Date.now();
  isRecording = true;

  btnStart.disabled = true;
  btnStop.disabled = false;
  btnPlay.disabled = true;
}

function stopRecording() {
  isRecording = false;

  btnStart.disabled = false;
  btnStop.disabled = true;
  btnPlay.disabled = recording.length === 0;
}

function playRecording() {
  if (recording.length === 0) return;

  btnPlay.disabled = true;
  btnStart.disabled = true;

  recording.forEach((note, index) => {
    setTimeout(() => {
      playTune(note.key);
      if (index === recording.length - 1) {
        btnPlay.disabled = false;
        btnStart.disabled = false;
      }
    }, note.time);
  });
}

// Eventos
pianoKeys.forEach((key) =>
  key.addEventListener("click", () => playTune(key.dataset.key))
);

document.addEventListener("keydown", handleKeyDown);
volumeSlider.addEventListener("input", handleVolumeChange);
keysToggle.addEventListener("change", toggleKeyLabels);

btnStart.addEventListener("click", startRecording);
btnStop.addEventListener("click", stopRecording);
btnPlay.addEventListener("click", playRecording);
