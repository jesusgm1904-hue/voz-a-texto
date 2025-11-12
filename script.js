const startBtn = document.getElementById("start");
const stopBtn = document.getElementById("stop");
const resultadoEl = document.getElementById("resultado");
const micSelect = document.getElementById("micSelect");

let recognition;
let stream;

// Mostrar micrófonos disponibles
navigator.mediaDevices.enumerateDevices().then(devices => {
  const mics = devices.filter(d => d.kind === "audioinput");
  micSelect.innerHTML = mics.map(m => `<option value="${m.deviceId}">${m.label || "Micrófono"}</option>`).join("");
});

async function obtenerAudio(deviceId) {
  if (stream) stream.getTracks().forEach(t => t.stop());
  stream = await navigator.mediaDevices.getUserMedia({ audio: { deviceId: deviceId ? { exact: deviceId } : undefined } });
}

// Configurar SpeechRecognition
if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.lang = "es-MX";
  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.onresult = (event) => {
    let texto = "";
    for (let i = event.resultIndex; i < event.results.length; i++) {
      texto += event.results[i][0].transcript + " ";
    }
    resultadoEl.textContent = texto.trim();
  };

  recognition.onerror = (event) => {
    console.error("Error:", event.error);
  };

  recognition.onend = () => {
    startBtn.disabled = false;
    stopBtn.disabled = true;
  };
} else {
  alert("Tu navegador no soporta reconocimiento de voz. Usa Chrome o Edge.");
}

startBtn.addEventListener("click", async () => {
  await obtenerAudio(micSelect.value);
  recognition.start();
  startBtn.disabled = true;
  stopBtn.disabled = false;
  resultadoEl.textContent = "🎙️ Escuchando...";
});

stopBtn.addEventListener("click", () => {
  recognition.stop();
  if (stream) stream.getTracks().forEach(t => t.stop());
  startBtn.disabled = false;
  stopBtn.disabled = true;
});

