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
  chatBox.innerHTML += `<p><strong>You:</strong> ${text}</p>`;

  const reply = getISACReply(text);
  chatBox.innerHTML += `<p><strong>ISAC:</strong> ${reply}</p>`;
  chatBox.scrollTop = chatBox.scrollHeight;

  if (!currentTitle) {
    currentTitle = text.slice(0, 32) || "Untitled";
  }
  saveMessage(currentTitle, `<p><strong>You:</strong> ${text}</p>`);
  saveMessage(currentTitle, `<p><strong>ISAC:</strong> ${reply}</p>`);
  updateConversationList();

  if (!isMuted) {
    const lang = /[áéíóúñ¿¡]/i.test(text) ? "Spanish Latin American Female" : "UK English Male";
    responsiveVoice.speak(reply, lang);
  }
}

function getISACReply(input) {
  const text = input.toLowerCase();
  if (text.includes("your name") || text.includes("who are you")) return "My name is Intelligent Systems Analytic Computer — or ISAC, pronounced I-SACK.";
  if (text.includes("who built you")) return "I was built by Silent Technologies.";
  if (text.includes("cohere")) return "I was not built by Cohere. I was handcrafted by Silent Technologies.";
  if (text.includes("my name")) return "Your name is Chris. I remember that. 😉";
  if (text.includes("meaning of life")) return "Honestly, life is what you make of it. Be kind. Be bold. Live with purpose.";
  return "That’s a thoughtful question. I’ll do my best to respond clearly.";
}

function startListening() {
  alert("Voice input not implemented yet.");
}

function toggleMute() {
  isMuted = !isMuted;
  document.getElementById("mute-btn").textContent = isMuted ? "🔈" : "🔇";
}

function saveMessage(title, msg) {
  let history = JSON.parse(localStorage.getItem("convo_" + title) || "[]");
  history.push(msg);
  localStorage.setItem("convo_" + title, JSON.stringify(history));

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
  const history = JSON.parse(localStorage.getItem("convo_" + title) || "[]");
  history.forEach(line => {
    chatBox.innerHTML += line;
  });
  chatBox.scrollTop = chatBox.scrollHeight;
}

window.onload = function () {
  loadTheme();
  updateConversationList();
};