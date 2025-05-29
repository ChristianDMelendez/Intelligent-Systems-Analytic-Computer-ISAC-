let chatBox = document.getElementById("chat-box");
let conversationList = document.getElementById("conversation-list");
let currentConversation = null;
let isMuted = false;

function toggleMode() {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
}

function loadTheme() {
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
  }
}

function saveConversation(title, messages) {
  localStorage.setItem("convo_" + title, JSON.stringify(messages));
  if (!localStorage.getItem("convo_titles")) {
    localStorage.setItem("convo_titles", JSON.stringify([]));
  }
  let titles = JSON.parse(localStorage.getItem("convo_titles"));
  if (!titles.includes(title)) {
    titles.push(title);
    localStorage.setItem("convo_titles", JSON.stringify(titles));
  }
}

function loadConversation(title) {
  const messages = JSON.parse(localStorage.getItem("convo_" + title)) || [];
  currentConversation = title;
  chatBox.innerHTML = "";
  messages.forEach(msg => appendMessage(msg));
}

function updateSidebar() {
  let titles = JSON.parse(localStorage.getItem("convo_titles") || "[]");
  conversationList.innerHTML = "";
  titles.forEach(title => {
    let li = document.createElement("li");
    li.textContent = title;
    li.onclick = () => loadConversation(title);
    conversationList.appendChild(li);
  });
}

function appendMessage(text) {
  let p = document.createElement("p");
  p.textContent = text;
  chatBox.appendChild(p);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function sendMessage() {
  const input = document.getElementById("user-input");
  const text = input.value.trim();
  if (!text) return;
  input.value = "";

  if (!currentConversation) {
    currentConversation = text.length > 30 ? text.slice(0, 30) + "..." : text;
  }

  appendMessage("🧑‍💻 You: " + text);
  let reply = "🤖 ISAC: " + generateFakeReply(text);
  appendMessage(reply);

  let messages = JSON.parse(localStorage.getItem("convo_" + currentConversation) || "[]");
  messages.push("🧑‍💻 You: " + text, reply);
  saveConversation(currentConversation, messages);
  updateSidebar();

  if (!isMuted) {
    responsiveVoice.speak(reply.replace("🤖 ISAC: ", ""), "UK English Male");
  }
}

function generateFakeReply(input) {
  if (input.toLowerCase().includes("name")) return "Your name is Chris, and I remember that. 😉";
  return "That's a great question! Let me think... 🤔";
}

function toggleMic() {
  alert("Mic toggle not implemented in this demo.");
}

function muteISAC() {
  isMuted = !isMuted;
  document.getElementById("mute-btn").textContent = isMuted ? "🔈" : "🔇";
}

window.onload = () => {
  loadTheme();
  updateSidebar();
};