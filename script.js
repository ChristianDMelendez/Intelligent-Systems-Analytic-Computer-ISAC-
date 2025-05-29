let isMuted = false;
let recognizing = false;
let recognition;
let speaking = false;

window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

function startListening() {
  if (!recognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
  }

  if (!recognizing) {
    recognition.start();
    recognizing = true;
    updateStatus("🎧 Listening...");

    recognition.onresult = async (event) => {
      if (isMuted || speaking) return;

      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('')
        .trim();

      if (transcript !== '') {
        updateStatus(`🗣 You said: "${transcript}"`);
        respondToUser(transcript);
      }
    };

    recognition.onend = () => {
      if (!isMuted) recognition.start();
    };
  }
}

function toggleMute() {
  isMuted = !isMuted;
  updateStatus(isMuted ? "🔇 Mic muted" : "🎧 Mic unmuted");

  if (isMuted && recognition) {
    recognition.stop();
    recognizing = false;
  } else {
    startListening();
  }
}

function respondToUser(text) {
  speaking = true;

  let reply = generateHumanReply(text);
  const lang = /[a-zA-Z]/.test(text) ? 'en' : 'es';
  const voice = lang === 'en' ? "UK English Male" : "Spanish Latin American Male";

  updateStatus(`🤖 ISAC: "${reply}"`);

  responsiveVoice.speak(reply, voice, {
    onstart: () => {
      if (recognition && recognizing) recognition.abort();
    },
    onend: () => {
      speaking = false;
      if (!isMuted) recognition.start();
    }
  });
}

function updateStatus(msg) {
  document.getElementById('status').innerText = msg;
}

function generateHumanReply(input) {
  input = input.toLowerCase();

  if (input.includes("hello") || input.includes("hi")) return "Hey, I got you. What's on your mind?";
  if (input.includes("how are you")) return "Feeling sharp and fully charged, thanks for asking.";
  if (input.includes("what’s your name")) return "I’m ISAC, your ride-or-die digital companion.";
  if (input.includes("joke")) return "Why did the computer cross the road? Because it detected better Wi-Fi over there.";

  return "I’m here, locked in. Tell me more.";
}
