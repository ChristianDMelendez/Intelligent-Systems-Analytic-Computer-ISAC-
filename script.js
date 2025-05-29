let isMuted = false;
let currentTitle = null;

function toggleMode() {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
}

function loadTheme() {
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
  }
}

function sendMessage() {
  const input = document.getElementById("user-input");
  const text = input.value.trim();
  if (!text) return;
  input.value = "";

  const chatBox = document.getElementById("chat-box");
  const userMsg = document.createElement("p");
  userMsg.textContent = "🧑‍💻 You: " + text;
  chatBox.appendChild(userMsg);

  const replyText = generateReply(text);
  const replyMsg = document.createElement("p");
  replyMsg.textContent = "🤖 ISAC: " + replyText;
  chatBox.appendChild(replyMsg);
  chatBox.scrollTop = chatBox.scrollHeight;

  if (!currentTitle) {
    currentTitle = text.length > 32 ? text.slice(0, 32) + "..." : text;
  }

  saveMessage(currentTitle, "🧑‍💻 You: " + text);
  saveMessage(currentTitle, "🤖 ISAC: " + replyText);
  updateConversationList();

  if (!isMuted) {
    const lang = /[áéíóúñ¿¡]/i.test(text) ? "Spanish Latin American Female" : "UK English Male";
    responsiveVoice.speak(replyText, lang);
  }
}

function generateReply(input) {
  const lower = input.toLowerCase();
  if (lower.includes("name")) return "Your name is Chris. I remember. 😉";
  if (lower.includes("who built you")) return "I was created by Silent Technologies, not Cohere.";
  if (lower.includes("who are you")) return "My name is Intelligent Systems Analytic Computer — or ISAC, pronounced I-SACK.";
  if (lower.includes("meaning of life")) return "Honestly? Life is what you make of it. It’s messy, beautiful, painful, and worth living.";
  return "That's a deep one! Let me think on that...";
}

function saveMessage(title, msg) {
  let all = JSON.parse(localStorage.getItem("convo_" + title) || "[]");
  all.push(msg);
  localStorage.setItem("convo_" + title, JSON.stringify(all));

  let titles = JSON.parse(localStorage.getItem("titles") || "[]");
  if (!titles.includes(title)) {
    titles.push(title);
    localStorage.setItem("titles", JSON.stringify(titles));
  }
}

function updateConversationList() {
  const list = document.getElementById("conversation-list");
  list.innerHTML = "";
  const titles = JSON.parse(localStorage.getItem("titles") || "[]");
  titles.forEach(title => {
    const li = document.createElement("li");
    li.textContent = title;
    li.onclick = () => loadConversation(title);
    list.appendChild(li);
  });
}

function loadConversation(title) {
  currentTitle = title;
  const chatBox = document.getElementById("chat-box");
  chatBox.innerHTML = "";
  const msgs = JSON.parse(localStorage.getItem("convo_" + title) || "[]");
  msgs.forEach(msg => {
    const p = document.createElement("p");
    p.textContent = msg;
    chatBox.appendChild(p);
  });
  chatBox.scrollTop = chatBox.scrollHeight;
}

function toggleMic() {
  alert("Mic not implemented yet.");
}

function muteISAC() {
  isMuted = !isMuted;
  document.getElementById("mute-btn").textContent = isMuted ? "🔈" : "🔇";
}

window.onload = function () {
  loadTheme();
  updateConversationList();
};