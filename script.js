// Pages
const gamePage = document.getElementById('game-page');
const scorePage = document.getElementById('score-page');
const splashPage = document.getElementById('splash-page');
const countdownPage = document.getElementById('countdown-page');
// Splash Page
const startForm = document.getElementById('start-form');
const radioContainers = document.querySelectorAll('.radio-container');
const radioInputs = document.querySelectorAll('input');
const bestScores = document.querySelectorAll('.best-score-value');
// Countdown Page
const countdown = document.querySelector('.countdown');
// Game Page
const itemContainer = document.querySelector('.item-container');
// Score Page
const finalTimeEl = document.querySelector('.final-time');
const baseTimeEl = document.querySelector('.base-time');
const penaltyTimeEl = document.querySelector('.penalty-time');
const playAgainBtn = document.querySelector('.play-again');

// Equations
let questionAmount = 0;
let equationsArray = [];
let playerGuessArray = [];
let bestScoreArray = [];

// Game Page
let firstNumber = 0;
let secondNumber = 0;
let equationObject = {};
const wrongFormat = [];

// Time
let timer;
let timePlayed = 0;
let baseTime = 0;
let penaltyTime = 0;
let finalTime = 0;
let finalTimeDisplay = '0.0';

// Scroll
let valueY = 0;

// refresh splash page best scores
function bestScoreToDOM() {
  bestScores.forEach((bestScore, index) => {
    const bestScoreEl = bestScore;
    bestScoreEl.textContent = `${bestScoreArray[index].bestScore}s`;

  });  
}

// check local storage for best scores, set bestScoreArray
function getSavedBestScores() {
  if (localStorage.getItem('bestScores')) {
    bestScoreArray = JSON.parse(localStorage.bestScores);
  } else {
    bestScoreArray = [
      { questions: 10, bestScore: finalTimeDisplay },
      { questions: 25, bestScore: finalTimeDisplay },
      { questions: 50, bestScore: finalTimeDisplay },
      { questions: 99, bestScore: finalTimeDisplay }
    ];
    localStorage.setItem('bestScores', JSON.stringify(bestScoreArray));
  }
  bestScoreToDOM();
}

// update best score arry
function updateBestScore() {
  bestScoreArray.forEach((score, index) => {
    // select correct best score to update
    if ( questionAmount == score.questions ) {
      // return best score as a number with one decimal
      const savedBestScore = Number(bestScoreArray[index].bestScore);
      // update if the new final score is less or replacing zero
      if (savedBestScore === 0 || savedBestScore > finalTime) {
        bestScoreArray[index].bestScore = finalTimeDisplay;
      }
    }
  });
  // upadte splash page
  bestScoreToDOM();
  // save to local storage
  localStorage.setItem('bestScores', JSON.stringify(bestScoreArray));
}



// reset the game
function playAgain() {
  
  gamePage.addEventListener('click', startTimer);
  scorePage.hidden = true;
  splashPage.hidden = false;
  equationsArray = [];
  playerGuessArray = [];
  valueY = 0;
  playAgainBtn.hidden = true;

}

// show score page
function showScorePage() {
  gamePage.hidden = true;
  scorePage.hidden = false;

  // delay play again action
  setTimeout(() => {
    // enable play again button
    playAgainBtn.hidden = false;

    // remove selected label from all question boxes
    radioContainers.forEach((e) => {
      e.classList.remove('selected-label');
    })
  }, 500);

}

// format and display time in DOM
function scoreToDOM() {
  finalTimeDisplay = finalTime.toFixed(1);
  baseTime = timePlayed.toFixed(1);
  penaltyTime = penaltyTime.toFixed(1);
  
  baseTimeEl.textContent = `Base time: ${baseTime}`;
  penaltyTimeEl.textContent = `penalty: +${penaltyTime}`;
  finalTimeEl.textContent = `${finalTimeDisplay}`;

  updateBestScore();

  // scrol to pt, go to score page
  itemContainer.scrollTo({ top: 0, behavior: 'instant' });
  showScorePage();
}


// stop timer prtocess results go to score page
function checkTime() {
  console.log(timePlayed);
  if (playerGuessArray.length == questionAmount) {
    clearInterval(timer);

    // check for wrong guesses and add penalty time
    equationsArray.forEach((equation, index) => {

      if (equation.evaluated === playerGuessArray[index]) {
        // correct guess, no penalty
      } else {
        // incorrect guess, no penalty
        penaltyTime += 0.5
      }

    });

    finalTime = timePlayed + penaltyTime;
    console.log('time Played ', timePlayed, ' penalty time ', penaltyTime, ' final time ', finalTime);
    scoreToDOM();

  }
}

// add 10th of second to time played
function addTime() {
  timePlayed += 0.1;
  checkTime();
}

// start timer when goame page is clicked
function startTimer() {
  // reset times
  timePlayed = 0;
  penaltyTime = 0;
  finalTime = 0;
  timer = setInterval(addTime, 100);
  gamePage.removeEventListener('click', startTimer);
}

// scroll, store user selection in playerguessarray
function select(guessedTrue) {
  console.log('player guess array: ', playerGuessArray);
  // scroll 80 pixels at a time
  valueY += 80;
  itemContainer.scroll(0, valueY);
  // add player guess to array
  return guessedTrue ? playerGuessArray.push('true') : playerGuessArray.push('false');
}

// displays game page
function showGamePage() {
  gamePage.hidden = false;
  countdownPage.hidden = true;
}

// get random number up to a max number 
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

// Create Correct/Incorrect Random Equations
function createEquations() {
  // Randomly choose how many correct equations there should be
  const correctEquations = getRandomInt(questionAmount);
  console.log('crrect equat: ', correctEquations);
  // Set amount of wrong equations
  const wrongEquations = questionAmount - correctEquations;
  console.log('wrong equarions: ', wrongEquations);
  // Loop through, multiply random numbers up to 9, push to array
  for (let i = 0; i < correctEquations; i++) {
    firstNumber = getRandomInt(9);
    secondNumber = getRandomInt(9);
    const equationValue = firstNumber * secondNumber;
    const equation = `${firstNumber} x ${secondNumber} = ${equationValue}`;
    equationObject = { value: equation, evaluated: 'true' };
    equationsArray.push(equationObject);
  }
  // Loop through, mess with the equation results, push to array
  for (let i = 0; i < wrongEquations; i++) {
    firstNumber = getRandomInt(9);
    secondNumber = getRandomInt(9);
    const equationValue = firstNumber * secondNumber;
    wrongFormat[0] = `${firstNumber} x ${secondNumber + 1} = ${equationValue}`;
    wrongFormat[1] = `${firstNumber} x ${secondNumber} = ${equationValue - 1}`;
    wrongFormat[2] = `${firstNumber + 1} x ${secondNumber} = ${equationValue}`;
    const formatChoice = getRandomInt(3);
    const equation = wrongFormat[formatChoice];
    equationObject = { value: equation, evaluated: 'false' };
    equationsArray.push(equationObject);
  }

  shuffle(equationsArray);
  // console.log('equations array: ', equationsArray);

  // equationsToDOM();

}

// add equations to DOM 
function equationsToDOM() {
  equationsArray.forEach((equation) => {
    // item
    const item = document.createElement('div');
    item.classList.add('item');
    // equation tex
    const equationText = document.createElement('h1');
    equationText.textContent = equation.value;
    // apend
    item.appendChild(equationText);
    itemContainer.appendChild(item);

  });
}

// Dynamically adding correct/incorrect equations
function populateGamePage() {
  // Reset DOM, Set Blank Space Above
  itemContainer.textContent = '';
  // Spacer
  const topSpacer = document.createElement('div');
  topSpacer.classList.add('height-240');
  // Selected Item
  const selectedItem = document.createElement('div');
  selectedItem.classList.add('selected-item');
  // Append
  itemContainer.append(topSpacer, selectedItem);

  // Create Equations, Build Elements in DOM
  createEquations();
  equationsToDOM();

  // Set Blank Space Below
  const bottomSpacer = document.createElement('div');
  bottomSpacer.classList.add('height-500');
  itemContainer.appendChild(bottomSpacer);
}

// display 3,2,1 go 
function countdownStart() {
  
  // control with this
  let cnt = 3;

  // loop down the numbers
  for (let i = 0; i < cnt; i++) {
    setTimeout(() => {
      countdown.textContent = cnt--;
    }, i * 1000);
  }

  // shows after numbers are done
  setTimeout(() => {
    countdown.textContent = 'GO!';
  }, cnt * 1000);

}

// navigate from splash page to countdown page 
function showCountdown() {
  countdownPage.hidden = false;
  splashPage.hidden = true;

  countdownStart();
  populateGamePage();
  setTimeout(showGamePage, 4000);
}

// get the value from selected radio button 
function getRadioValue() {
  let radioValue;
  radioInputs.forEach((radioInput) => {
    if (radioInput.checked) {
      radioValue = radioInput.value;
    }
  });
  return radioValue;
}

// form that decides amount of questions
function selectQuestionAmount(e) {
  e.preventDefault();

  questionAmount = getRadioValue();

  console.log(questionAmount);
  if (questionAmount) {
    showCountdown();
  }

}

startForm.addEventListener('click', () => {
  radioContainers.forEach((radioEl) => {
    // remove selected label styling
    radioEl.classList.remove('selected-label');

    // add it back if radio input is checked
    if (radioEl.children[1].checked) {
      radioEl.classList.add('selected-label');
    }

  });
});

// event listeners
startForm.addEventListener('submit', selectQuestionAmount);
gamePage.addEventListener('click', startTimer);

// on load
getSavedBestScores();