const output = document.getElementById("output");
const input = document.getElementById("cli-input");

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function typeLine(text, className = "", speed = 50) {
  const line = document.createElement("div");
  if (className) line.classList.add(className);
  output.appendChild(line);

  for (let i = 0; i < text.length; i++) {
    line.textContent += text[i];
    await delay(speed);
  }
}

async function loadLogoFromFile(path) {
  const response = await fetch(path);
  const text = await response.text();
  const lines = text.split("\n");
  for (const line of lines) {
    await typeLine(line, "logo", 5);
  }
}

async function startCLI() {
  await typeLine("unknowns*club:~# Loading...", "prompt", 80);
  await delay(1000);

  await loadLogoFromFile("assets/logo.txt");
  await delay(500);

  await typeLine("Welcome to Unknown’s Club – a student community focused on self-learning, hacking, and cybersecurity.", "description");
  await typeLine("Our aim: Learn Together, Grow Together.", "description");
  await typeLine("Please fill in this form carefully.", "description");
  await typeLine("Only passionate and self-driven students will be selected.", "description");
  await delay(500);

  await typeLine("unknowns*club:~# Use `help` to list all available commands.", "prompt");
  await typeLine("~$ Press [Enter] to begin recruitment...", "prompt");

  input.addEventListener("keydown", async function handler(e) {
    if (e.key === "Enter") {
      input.value = "";
      input.removeEventListener("keydown", handler);
      await startQuestions();
    }
  });
}

const questions = [
  {
    text: "Full Name",
    id: "entry.126451594",
    required: true,
    validate: input => input.trim().length > 0
  },
  {
    text: "Branch / Year of Study",
    id: "entry.1171963344",
    required: true,
    validate: input => /^[A-Za-z\s]+\/\d{4}$/.test(input)
  },
  {
    text: "Phone Number",
    id: "entry.1857250983",
    required: true,
    validate: input => /^\d{10}$/.test(input)
  },
  {
    text: "Email ID (must be valid)",
    id: "entry.1011618907",
    required: true,
    validate: input => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input)
  },
  {
    text: "Why do you want to join Unknown’s Club?",
    id: "entry.401407989",
    required: true,
    validate: input => input.trim().length >= 10
  },
  {
    text: "How many hours per week can you dedicate to self-learning? (Less than 3 hrs, 3–5 hrs, 5–10 hrs, More than 10 hrs)",
    id: "entry.948508822",
    required: true,
    validate: input => /^(Less than 3 hrs|3–5 hrs|5–10 hrs|More than 10 hrs)$/.test(input)
  },
  {
    text: "What excites you more? (Solving problems/puzzles, Exploring new tools/technologies, Breaking things to understand them, Building something from scratch)",
    id: "entry.994368357",
    required: true,
    validate: input => input.trim().length >= 10
  },
  {
    text: "On a scale of 1–10, how self-disciplined are you in learning without external motivation?",
    id: "entry.1031693661",
    required: true,
    validate: input => /^[1-9]$|^10$/.test(input)
  },
  {
    text: "Which do you prefer for learning hacking/cybersecurity? (Videos & courses, Reading blogs & books, Hands-on labs & practice, Exploring internet & experiments)",
    id: "entry.1303510429",
    required: true,
    validate: input => /^(Videos & courses|Reading blogs & books|Hands-on labs & practice|Exploring internet & experiments)$/.test(input)
  },
  {
    text: "Suppose you fail to solve a technical problem after trying for 3 days. What will you do?",
    id: "entry.2014763052",
    required: true,
    validate: input => input.trim().length >= 10
  },
  {
    text: "Have you ever tried using Linux, virtual machines, or hacking tools? (Yes, I use them regularly; Yes, but I’m still a beginner; No, but I want to start; Not interested)",
    id: "entry.191040336",
    required: true,
    validate: input => /^(Yes, I use them regularly|Yes, but I’m still a beginner|No, but I want to start|Not interested)$/.test(input)
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
    await typeLine(`unknowns*club:~# ${questions[i].text}`, "question");
    const answer = await waitForAnswer(i);
    answers.push(answer);
  }

  await typeLine("unknowns*club:~# Submitting your responses...", "prompt");
  await submitToGoogleForm();
  await typeLine("unknowns*club:~# ✅ Submitted successfully!", "prompt");
}

function waitForAnswer(index) {
  return new Promise(resolve => {
    input.focus();
    input.addEventListener("keydown", function handler(e) {
      if (e.key === "Enter") {
        const value = input.value.trim();
        const q = questions[index];

        if (!q.validate(value)) {
          typeLine("~$ Invalid input. Please try again.", "answer");
          input.value = "";
          return;
        }

        typeLine(`~$ ${value}`, "answer");
        input.value = "";
        input.removeEventListener("keydown", handler);
        resolve(value);
      }
    });
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

startCLI();
