const output = document.getElementById("output");
const input = document.getElementById("cli-input");
const inputLine = document.getElementById("input-line");

// Command history functionality
let commandHistory = [];
let historyIndex = -1;

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Function to show the terminal prompt
function showPrompt() {
  inputLine.style.display = "flex";
  input.focus();
}

// Function to hide the terminal prompt  
function hidePrompt() {
  inputLine.style.display = "none";
}

async function typeLine(text, className = "", speed = 20) {
  const line = document.createElement("div");
  if (className) line.classList.add(className);
  output.appendChild(line);
  for (let i = 0; i < text.length; i++) {
    line.textContent += text[i];
    await delay(speed);
  }
  // Auto-scroll to bottom
  output.scrollTop = output.scrollHeight;
}

// Instant display function for logo
function displayInstant(text, className = "") {
  const line = document.createElement("div");
  if (className) line.classList.add(className);
  line.textContent = text;
  output.appendChild(line);
  // Auto-scroll to bottom
  output.scrollTop = output.scrollHeight;
}

// Option shortcut mappings for questions with fixed choices
const optionShortcuts = {
  "entry.948508822": { // Hours per week
    "a": "Less than 3 hrs",
    "b": "3–5 hrs",
    "c": "5–10 hrs", 
    "d": "More than 10 hrs",
    "e": "Other:"
  },
  "entry.994368357": { // What excites you more?
    "a": "Solving problems/puzzles",
    "b": "Exploring new tools/technologies", 
    "c": "Breaking things to understand them",
    "d": "Building something from scratch"
  },
  "entry.191040336": { // Tried Linux/tools
    "a": "Yes, I use them regularly",
    "b": "Yes, but I'm still a beginner",
    "c": "No, but I want to start",
    "d": "Not interested"
  },
  "entry.1303510429": { // Learning preference
    "a": "Videos & courses",
    "b": "Reading blogs & books", 
    "c": "Hands-on labs & practice",
    "d": "Exploring internet & experiments"
  }
};

const questions = [
  {
    text: "Your Full Name?",
    id: "entry.126451594",
    required: true,
    validate: input => input.trim().length > 0
  },
  {
    text: "Branch / Year of Study?", 
    id: "entry.1171963344",
    required: true,
    validate: input => input.trim().length > 0
  },
  {
    text: "Your Phone Number?",
    id: "entry.1857250983", 
    required: true,
    validate: input => /^\d{10}$/.test(input)
  },
  {
    text: "Your Email ID (must be valid)",
    id: "entry.1011618907",
    required: true,
    validate: input => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input)
  },
  {
    text: "Why do you want to join Unknown's Club?",
    id: "entry.401407989",
    required: true,
    validate: input => input.trim().length >= 10
  },
  {
    text: "How many hours per week can you dedicate to self-learning? (a) Less than 3 hrs, (b) 3–5 hrs, (c) 5–10 hrs, (d) More than 10 hrs, (e) Other:",
    id: "entry.948508822",
    required: true,
    validate: input => {
      const opts = optionShortcuts["entry.948508822"];
      return Object.values(opts).includes(input) || Object.keys(opts).includes(input.toLowerCase()) || input.trim().length >= 1;
    }
  },
  {
    text: "What excites you more? (a) Solving problems/puzzles, (b) Exploring new tools/technologies, (c) Breaking things to understand them, (d) Building something from scratch",
    id: "entry.994368357",
    required: true,
    validate: input => {
      const opts = optionShortcuts["entry.994368357"];
      return Object.values(opts).includes(input) || Object.keys(opts).includes(input.toLowerCase());
    }
  },
  {
    text: "On a scale of 1–10, how self-disciplined are you in learning without external motivation?",
    id: "entry.1031693661", 
    required: true,
    validate: input => /^[1-9]$|^10$/.test(input)
  },
  {
    text: "Which do you prefer for learning hacking/cybersecurity? (a) Videos & courses, (b) Reading blogs & books, (c) Hands-on labs & practice, (d) Exploring internet & experiments",
    id: "entry.1303510429",
    required: true,
    validate: input => {
      const opts = optionShortcuts["entry.1303510429"];
      return Object.values(opts).includes(input) || Object.keys(opts).includes(input.toLowerCase());
    }
  },
  {
    text: "Suppose you fail to solve a technical problem after trying for 3 days. What will you do?",
    id: "entry.2014763052",
    required: true,
    validate: input => input.trim().length >= 10
  },
  {
    text: "Have you ever tried using Linux, virtual machines, or hacking tools? (a) Yes, I use them regularly, (b) Yes, but I'm still a beginner, (c) No, but I want to start, (d) Not interested",
    id: "entry.191040336",
    required: true,
    validate: input => {
      const opts = optionShortcuts["entry.191040336"];
      return Object.values(opts).includes(input) || Object.keys(opts).includes(input.toLowerCase());
    }
  },
  {
    text: "What is the difference between a hacker and a cyber criminal?",
    id: "entry.269215780",
    required: true,
    validate: input => input.trim().length >= 10
  },
  {
    text: "Explain 'phishing attack' to a non-technical friend.", 
    id: "entry.755715388",
    required: true,
    validate: input => input.trim().length >= 10
  },
  {
    text: "What is your long-term goal in cybersecurity or technology?",
    id: "entry.86224158",
    required: true,
    validate: input => input.trim().length >= 10
  }
];

const answers = [];

async function startQuestions() {
  for (let i = 0; i < questions.length; i++) {
    // Hide prompt during question display
    hidePrompt();
    await typeLine(questions[i].text, "question");
    // Show prompt for user input
    showPrompt();
    const answer = await waitForAnswer(i);
    answers.push(mapShortcutToAnswer(questions[i].id, answer));
  }
  
  // Hide prompt during submission
  hidePrompt();
  await typeLine("Submitting your responses...", "prompt");
  await submitToGoogleForm();
  await typeLine("✅ Response submitted successfully!", "success");
}

// Map shortcut letters like 'a' to full option text
function mapShortcutToAnswer(questionId, input) {
  if (optionShortcuts[questionId]) {
    const lower = input.toLowerCase();
    if (optionShortcuts[questionId][lower]) {
      return optionShortcuts[questionId][lower];
    }
  }
  return input;
}

function waitForAnswer(index) {
  return new Promise(resolve => {
    input.focus();
    
    function handler(e) {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        let value = input.value.trim();
        const q = questions[index];
        
        // Add to command history
        if (value) {
          commandHistory.push(value);
          historyIndex = -1;
        }
        
        if (!q.validate(value)) {
          hidePrompt();
          typeLine("bash: Invalid input. Please try again.", "error").then(() => {
            showPrompt();
          });
          input.value = "";
          return;
        }
        
        hidePrompt();
        typeLine(value, "answer");
        input.value = "";
        input.removeEventListener("keydown", handler);
        resolve(value);
      }
      
      // Handle command history with arrow keys
      if (e.key === "ArrowUp") {
        e.preventDefault();
        if (historyIndex < commandHistory.length - 1) {
          historyIndex++;
          input.value = commandHistory[commandHistory.length - 1 - historyIndex] || "";
        }
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (historyIndex > 0) {
          historyIndex--;
          input.value = commandHistory[commandHistory.length - 1 - historyIndex] || "";
        } else {
          historyIndex = -1;
          input.value = "";
        }
      }
    }
    
    input.addEventListener("keydown", handler);
  });
}

function submitToGoogleForm() {
  const formData = new FormData();
  questions.forEach((q, i) => {
    formData.append(q.id, answers[i]);
  });
  const formURL = "https://docs.google.com/forms/d/e/1FAIpQLSeSzsVCDZw2zqajWj99pB-doG8-MMiL9Ivi0QsEqo0m3vV-nw/formResponse";
  return fetch(formURL, {
    method: "POST",
    mode: "no-cors",
    body: formData
  });
}

async function loadLogoFromFile(path) {
  try {
    const response = await fetch(path);
    const text = await response.text();
    const lines = text.split("\n");
    // Display logo instantly - no animation
    for (const line of lines) {
      displayInstant(line, "logo");
    }
  } catch (error) {
    displayInstant("Warning: Could not load logo file", "error");
  }
}

async function startCLI() {
  // Hide prompt during loading
  hidePrompt();
  
  // Load content without showing prompt
  await typeLine("Loading...", "description", 80);
  await delay(100);
  await loadLogoFromFile("assets/logo4.txt");
  await delay(100);
  await typeLine("Welcome to Unknown's Club – a student community focused on self-learning, hacking, and cybersecurity.", "description", 2);
  await typeLine("Our aim: Learn Together, Grow Together.", "description", 2);
  await typeLine("Please fill in this form carefully.", "description", 2);
  await typeLine("Only passionate and self-driven students will be selected.", "description", 2);
  await delay(500);
  await typeLine("Press [Enter] to begin recruitment...", "prompt", 2);
  
  // Now show the prompt for user interaction
  showPrompt();

  function initialHandler(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      hidePrompt();
      input.value = "";
      input.removeEventListener("keydown", initialHandler);
      startQuestions();
    }
  }

  input.addEventListener("keydown", initialHandler);
}

// Auto-expand textarea height as user types
input.addEventListener("input", () => {
  input.style.height = "auto";
  input.style.height = input.scrollHeight + "px";
});

// Initialize the CLI
startCLI();
