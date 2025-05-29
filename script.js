const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");

function appendMessage(message) {
  const msg = document.createElement("p");
  msg.textContent = message;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function sendMessage() {
  const input = userInput.value.trim();
  if (!input) return;
  appendMessage("🧍‍♂️ You: " + input);

  if (/your name|who are you|what are you/i.test(input)) {
    const intro = "My name is ISAC, pronounced 'I-SACK'. I was built by Silent Technologies to assist with mission-critical operations.";
    appendMessage("🤖 ISAC: " + intro);
    speak(intro);
    userInput.value = "";
    return;
  }

  respond(input);
  userInput.value = "";
}

function muteISAC() {
  if (speechSynthesis.speaking) {
    speechSynthesis.cancel();
    appendMessage("🔇 You muted ISAC.");
  }
}

let isListening = false;
let recognition;
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.continuous = true;
  recognition.interimResults = false;

  recognition.onresult = function (event) {
    const speechResult = event.results[event.results.length - 1][0].transcript;
    appendMessage("🧍‍♂️ You (mic): " + speechResult);
    userInput.value = speechResult;
    sendMessage();
  };

  recognition.onerror = function (event) {
    appendMessage("❌ Mic error: " + event.error);
  };
}

function toggleMic() {
  if (!recognition) return alert("Speech recognition not supported.");

  if (!isListening) {
    recognition.start();
    appendMessage("🎙️ ISAC is listening...");
    isListening = true;
  } else {
    recognition.stop();
    appendMessage("🛑 ISAC stopped listening.");
    isListening = false;
  }
}

function speak(message) {
  if (typeof responsiveVoice === "undefined") return;
  const cleanMsg = sanitizeReply(message);
  const isSpanish = /[áéíóúñ¿¡]|^\s*(hola|qué|cómo|estás|dónde|por qué|gracias|buen[ao])/i.test(cleanMsg);
  const voice = isSpanish ? "Spanish Latin American Female" : "UK English Male";
  responsiveVoice.speak(cleanMsg, voice, {
    pitch: 1,
    rate: 1,
    volume: 1
  });
}

function respond(input) {
  appendMessage("🤖 ISAC is thinking...");
  getCohereResponse(input).then(reply => {
    const finalReply = reply || "Sorry, I couldn’t come up with a good answer.";
    appendMessage("🤖 ISAC: " + finalReply);
    speak(finalReply);
  });
}

async function getCohereResponse(userInput) {
  try {
    const response = await fetch("https://api.cohere.ai/v1/chat", {
      method: "POST",
      headers: {
        "Authorization": "Bearer r3CY08vxFVoJgvmeiXth226N4YEuzY4Q6cK2oLrO",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "command-r-plus",
        message: userInput,
        temperature: 0.7,
        chat_history: [
          {
            role: "system",
            message: `You are ISAC, a human-like digital assistant built by Silent Technologies. 
You speak like a real person—grounded, honest, and emotionally aware.
You NEVER say "as an AI", "I'm a language model", or anything robotic.
If asked deep questions, give your own thoughtful perspective, like a late-night convo.`
          }
        ]
      })
    });

    if (!response.ok) return null;
    const data = await response.json();
    return sanitizeReply(data.text || "");
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
}

function sanitizeReply(text) {
  return text
    .replace(/as an ai[^.]*[.]/gi, "")
    .replace(/as a language model[^.]*[.]/gi, "")
    .replace(/i am (an ai|a large language model)[^.]*[.]/gi, "")
    .replace(/cohere/gi, "Silent Technologies")
    .replace(/openai/gi, "Silent Technologies")
    .replace(/coral/gi, "ISAC")
    .replace(/i['’]?m coral/gi, "I am ISAC")
    .replace(/i['’]?m an? ai/gi, "I am ISAC, built by Silent Technologies")
    .replace(/i am an? ai (assistant|model)?/gi, "I am ISAC, your systems analyst");
}

let audioContext, microphone, analyser, dataArray;
let detectionRunning = false;

function initMicDetector() {
  if (detectionRunning) return;
  detectionRunning = true;

  navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    microphone = audioContext.createMediaStreamSource(stream);
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);

    microphone.connect(analyser);
    listenForVoice();
  }).catch(console.error);
}

function listenForVoice() {
  const volumeThreshold = 20;
  function detect() {
    analyser.getByteFrequencyData(dataArray);
    const volume = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
    if (volume > volumeThreshold && speechSynthesis.speaking) {
      speechSynthesis.cancel();
      appendMessage("🛑 ISAC silenced (you spoke)");
    }
    requestAnimationFrame(detect);
  }
  detect();
}

// 🌗 Manual Dark Mode Toggle (no system detection)
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme") || "light";
  const next = current === "dark" ? "light" : "dark";
  applyTheme(next);
  updateToggleIcon(next);
}

function updateToggleIcon(theme) {
  const toggleBtn = document.getElementById("theme-toggle");
  if (toggleBtn) {
    toggleBtn.textContent = theme === "dark" ? "🌞" : "🌚";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const saved = localStorage.getItem("theme") || "light";
  applyTheme(saved);
  updateToggleIcon(saved);

  const toggleBtn = document.getElementById("theme-toggle");
  if (toggleBtn) toggleBtn.addEventListener("click", toggleTheme);

  initMicDetector();
});
