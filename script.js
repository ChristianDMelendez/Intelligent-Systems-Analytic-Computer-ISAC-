// Dummy chatbot logic placeholder
function sendMessage() {
  const input = document.getElementById("user-input").value;
  const chatBox = document.getElementById("chat-box");
  const msg = document.createElement("p");
  msg.textContent = "You: " + input;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;

  const reply = document.createElement("p");
  reply.textContent = "ISAC: Hmm... I'm thinking about that.";
  chatBox.appendChild(reply);
  chatBox.scrollTop = chatBox.scrollHeight;

  // Text-to-Speech (Optional)
  responsiveVoice.speak("Hmm... I'm thinking about that.", "UK English Male");
}

function toggleMic() {
  alert("🎙️ Voice input not yet wired in this demo.");
}

function muteISAC() {
  responsiveVoice.cancel();
}

// 🔥 Your new class-based dark mode toggle
function toggleMode() {
  document.body.classList.toggle('dark-mode');
  if (document.body.classList.contains('dark-mode')) {
    localStorage.setItem('theme', 'dark');
  } else {
    localStorage.setItem('theme', 'light');
  }
}

// 🌓 Apply saved theme on page load
document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
  }

  const toggleBtn = document.querySelector('.toggle-btn');
  if (toggleBtn) toggleBtn.addEventListener('click', toggleMode);

  // Placeholder for mic detector (optional)
  // initMicDetector();
});