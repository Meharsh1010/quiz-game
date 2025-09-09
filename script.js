// ---------- QUESTIONS ----------
const questions = [
  {
    q: "Which language runs in a web browser?",
    choices: ["Python", "C++", "JavaScript", "Java"],
    answer: 2
  },
  {
    q: "What does CSS stand for?",
    choices: [
      "Cascading Style Sheets",
      "Computer Style Sheets",
      "Creative Style System",
      "Colorful Style Sheets"
    ],
    answer: 0
  },
  {
    q: "Which HTML tag is used for the largest heading?",
    choices: ["&lt;head&gt;", "&lt;h6&gt;", "&lt;h1&gt;", "&lt;header&gt;"],
    answer: 2
  },
  {
    q: "Which method adds an element to the end of an array in JS?",
    choices: ["push()", "pop()", "shift()", "unshift()"],
    answer: 0
  },
  {
    q: "What is 8 * 7?",
    choices: ["54", "56", "64", "58"],
    answer: 1
  },
  {
    q: "Which company developed Java?",
    choices: ["Microsoft", "Sun Microsystems", "Google", "Apple"],
    answer: 1
  },
  {
    q: "Inside which HTML element do we put JavaScript?",
    choices: ["&lt;js&gt;", "&lt;script&gt;", "&lt;javascript&gt;", "&lt;scripting&gt;"],
    answer: 1
  },
  {
    q: "Which of the following is NOT a programming language?",
    choices: ["Python", "Ruby", "HTML", "C"],
    answer: 2
  },
  {
    q: "Which symbol is used for single-line comments in JavaScript?",
    choices: ["//", "/*", "#", "<!--"],
    answer: 0
  },
  {
    q: "Which HTML attribute is used to define inline styles?",
    choices: ["class", "style", "font", "styles"],
    answer: 1
  }
];

// ---------- CONFIG ----------
const TIME_PER_QUESTION = 15; // seconds

// ---------- STATE ----------
let currentIndex = 0;
let score = 0;
let timer = null;
let timeLeft = TIME_PER_QUESTION;
let userAnswers = [];
let questionsShuffled = [];

// ---------- UI Refs ----------
const questionText = document.getElementById("questionText");
const choicesDiv = document.getElementById("choices");
const timeLeftSpan = document.getElementById("timeLeft");
const nextBtn = document.getElementById("nextBtn");
const quitBtn = document.getElementById("quitBtn");
const scoreSpan = document.getElementById("score");
const qCounter = document.getElementById("qCounter");
const resultCard = document.getElementById("resultCard");
const quizCard = document.getElementById("quizCard");
const finalScore = document.getElementById("finalScore");
const reviewDiv = document.getElementById("review");
const retryBtn = document.getElementById("retryBtn");

// ---------- HELPERS ----------
function shuffleArray(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

// ---------- INITIALIZE ----------
function startQuiz(){
  currentIndex = 0;
  score = 0;
  userAnswers = [];
  questionsShuffled = shuffleArray([...questions]); // shuffle questions

  scoreSpan.textContent = `Score: ${score}`;
  qCounter.textContent = `Question: ${currentIndex+1} / ${questionsShuffled.length}`;
  quizCard.classList.remove("hidden");
  resultCard.classList.add("hidden");
  nextBtn.disabled = true;
  renderQuestion();
}

// render question
function renderQuestion(){
  clearInterval(timer);
  timeLeft = TIME_PER_QUESTION;
  timeLeftSpan.textContent = timeLeft;
  timer = setInterval(countDown, 1000);

  const item = questionsShuffled[currentIndex];
  questionText.innerHTML = item.q;
  choicesDiv.innerHTML = "";

  item.choices.forEach((choiceText, i) => {
    const btn = document.createElement("button");
    btn.className = "choice-btn";
    btn.innerHTML = `<span class="label">${String.fromCharCode(65 + i)}</span><span>${choiceText}</span>`;
    btn.dataset.index = i;
    btn.addEventListener("click", onChoiceClick);
    choicesDiv.appendChild(btn);
  });

  qCounter.textContent = `Question: ${currentIndex + 1} / ${questionsShuffled.length}`;
  nextBtn.disabled = true;
}

// countdown logic
function countDown(){
  timeLeft--;
  timeLeftSpan.textContent = timeLeft;
  if(timeLeft <= 0){
    clearInterval(timer);
    handleNoAnswer();
  }
}

// when user clicks a choice
function onChoiceClick(e){
  if (nextBtn.disabled === false) return;

  clearInterval(timer);
  const btn = e.currentTarget;
  const chosen = Number(btn.dataset.index);
  const correct = questionsShuffled[currentIndex].answer;

  const all = choicesDiv.querySelectorAll(".choice-btn");
  all.forEach(b => b.removeEventListener("click", onChoiceClick));

  all.forEach(b => {
    const idx = Number(b.dataset.index);
    if (idx === correct){
      b.classList.add("correct");
    }
    if (idx === chosen && idx !== correct) {
      b.classList.add("wrong");
    }
    b.disabled = true;
  });

  if (chosen === correct){
    score += 1;
    scoreSpan.textContent = `Score: ${score}`;
  }
  userAnswers.push({ chosenIndex: chosen, correctIndex: correct });

  nextBtn.textContent = (currentIndex === questionsShuffled.length - 1) ? "Finish" : "Next";
  nextBtn.disabled = false;
}

// when time runs out
function handleNoAnswer(){
  const correct = questionsShuffled[currentIndex].answer;
  const all = choicesDiv.querySelectorAll(".choice-btn");
  all.forEach(b => {
    const idx = Number(b.dataset.index);
    if (idx === correct) b.classList.add("correct");
    b.disabled = true;
    b.removeEventListener("click", onChoiceClick);
  });
  userAnswers.push({ chosenIndex: null, correctIndex: correct });
  nextBtn.disabled = false;
  nextBtn.textContent = (currentIndex === questionsShuffled.length -1) ? "Finish" : "Next";

  setTimeout(() => {
    if (!nextBtn.disabled) {
      goNext();
    }
  }, 2000);
}

// next question / finish
function goNext(){
  currentIndex++;
  if (currentIndex >= questionsShuffled.length){
    finishQuiz();
    return;
  }
  renderQuestion();
}

// finish & show review
function finishQuiz(){
  clearInterval(timer);
  quizCard.classList.add("hidden");
  resultCard.classList.remove("hidden");

  finalScore.textContent = `You scored ${score} out of ${questionsShuffled.length}`;
  reviewDiv.innerHTML = "";

  questionsShuffled.forEach((q, idx) => {
    const ua = userAnswers[idx] || { chosenIndex: null, correctIndex: q.answer };
    const chosenText = ua.chosenIndex === null ? "<em>Not answered</em>" : q.choices[ua.chosenIndex];
    const correctText = q.choices[q.answer];
    const item = document.createElement("div");
    item.className = "review-item";
    item.innerHTML = `<strong>Q${idx+1}:</strong> ${q.q}
                      <div style="margin-top:6px">Your answer: ${chosenText}</div>
                      <div style="margin-top:4px">Correct answer: <strong>${correctText}</strong></div>`;
    reviewDiv.appendChild(item);
  });
}

// event listeners
nextBtn.addEventListener("click", () => {
  if (currentIndex === questionsShuffled.length - 1){
    finishQuiz();
  } else {
    goNext();
  }
});
quitBtn.addEventListener("click", () => {
  if (confirm("Quit the quiz? Your progress will be lost.")){
    startQuiz();
  }
});
retryBtn.addEventListener("click", startQuiz);

// start when page loads
startQuiz();