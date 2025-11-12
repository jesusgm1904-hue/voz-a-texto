const startBtn = document.getElementById("start");
const stopBtn = document.getElementById("stop");
const resultadoEl = document.getElementById("resultado");

let recognition;

if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.lang = "es-MX";
  recognition.continuous = true; // sigue escuchando hasta que se detiene manualmente
  recognition.interimResults = true; // muestra resultados parciales mientras hablas

  recognition.onresult = (event) => {
    let texto = "";
    for (let i = event.resultIndex; i < event.results.length; i++) {
      texto += event.results[i][0].transcript + " ";
    }
    resultadoEl.textContent = texto.trim();
  };

  recognition.onerror = (event) => {
    console.error("Error en el reconocimiento de voz:", event.error);
  };

  recognition.onend = () => {
    startBtn.disabled = false;
    stopBtn.disabled = true;
  };

} else {
  alert("Tu navegador no soporta reconocimiento de voz. Usa Chrome o Edge.");
}

startBtn.addEventListener("click", () => {
  recognition.start();
  startBtn.disabled = true;
  stopBtn.disabled = false;
  resultadoEl.textContent = "🎙️ Escuchando...";
});

stopBtn.addEventListener("click", () => {
  recognition.stop();
  startBtn.disabled = false;
  stopBtn.disabled = true;
});
