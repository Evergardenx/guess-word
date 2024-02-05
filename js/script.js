import { words } from "./data.js";

let currentWord;
let tries = 0;
let mistakes = [];
const wordEl = document.querySelector(".word");
const triesEl = document.querySelector("#tries");
const dots = document.querySelectorAll(".dots");
const mistakesEl = document.querySelector(".mistakes strong");
const inputForm = document.querySelector(".game__inputs");
const randomButton = document.querySelector("#randomButton");
const resetButton = document.querySelector("#resetButton");
const maxTries = 5;

function scramble(word) {
  const array = word.split("");
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array.join("");
}

function evaluate(guess) {
  mistakes = guess.filter((letter, index) => letter !== currentWord[index]);
  mistakesEl.innerText = mistakes.join("");
  if (mistakes.length) {
    tries++;
    if (tries < maxTries) {
      triesEl.innerText = tries;
      renderTries();
    }
  } else {
    alert("🎉 Success!");
    location.reload();
  }
  if (tries >= maxTries) {
    alert(`You lose! The answer was "${currentWord}".`);
    location.reload();
  }
}

function renderTries() {
  dots.forEach((dot, index) => {
    if (index < tries) {
      dot.classList.add("check");
    } else {
      dot.classList.remove("check");
    }
  });
}

function resetGame() {
  inputForm.innerHTML = "";
  createInputs(currentWord.length);
}

function initGame() {
  currentWord = words[Math.floor(Math.random() * words.length)].toLowerCase();
  wordEl.innerText = scramble(currentWord);
  mistakesEl.innerText = "";
  renderTries();
  createInputs(currentWord.length);
  inputForm.querySelector("input").focus();
}

function createInputs(wordLength) {
  inputForm.innerHTML = "";
  for (let i = 0; i < wordLength; i++) {
    const input = document.createElement("input");
    input.type = "text";
    input.maxLength = 1;
    input.placeholder = "_";
    inputForm.appendChild(input);
  }
}

inputForm.addEventListener("input", (e) => {
  const input = e.target;
  const index = Array.from(inputForm.children).indexOf(input);
  const nextInput = inputForm.children[index + 1];
  const prevInput = inputForm.children[index - 1];

  if (input.value) {
    if (nextInput) {
      nextInput.focus();
    }
  } else {
    if (prevInput) {
      prevInput.focus();
    }
  }

  const guess = Array.from(inputForm.children).map((input) =>
    input.value.toLowerCase()
  );
  if (guess.every((letter) => letter)) {
    evaluate(guess);
  }
});

randomButton.addEventListener("click", () => {
  initGame();
});

resetButton.addEventListener("click", resetGame);

window.addEventListener("load", initGame);
