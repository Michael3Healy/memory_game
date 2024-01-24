const gameContainer = document.getElementById("game");
const welcomeForm = document.querySelector('#selections');
const difficultyChoice = document.querySelector('select')
const resetForm = document.querySelector('.reset')

// Declare variables globally so I can access their changing values in different functions (is there a better way to do this?)
let gameDifficulty;
let imageSources;
let uniqueGameCards;
let finalGameCards;
let bestScore;
let score = 0;
const scores = JSON.parse(localStorage.getItem('bestScores')) || {};

// Headers displaying the game scores
const gameScoreDisplay = document.querySelector('.game.score');
const bestScoreDisplay = document.querySelector('.best.score');

function updateScoreDisplay() {
  gameScoreDisplay.innerText = `Current Score: ${score}`;
  bestScoreDisplay.innerText = `Your Best Score: ${bestScore}`;
}

function updateScore() {
  score += 1;
  updateScoreDisplay();
}

// Contains all of the potential images that could be used
const pathToImages = [
  "images/pexels-james-wheeler-417074.jpg", "images/36-iconic-waterfall-seljandrafoss-iceland.jpg", "images/avenue-815297_640.jpg", 
  "images/bsr-focus-nature-hero.jpg", "images/image27-1.png", "images/istockphoto-517188688-612x612.jpg", "images/lake-blue-moonlight-moon-wallpaper-preview.jpg",
  "images/mixkit-going-down-a-curved-highway-through-a-mountain-range-41576-0.jpg", "images/nature-3082832_1280.jpg", "images/photo-1617635277889-df22350f81a0.jpg",
  "images/road-1072821_640.jpg", "images/unnamed.jpg"
];

// Once form is submitted, main function is called (randomImages)
welcomeForm.addEventListener('submit', function (e) {
  e.preventDefault();
  e.submitter.innerText = 'Restart'
  gameDifficulty = difficultyChoice.value;
  bestScore = scores[gameDifficulty] || 0;
  randomImages(gameDifficulty)
})

// Pick random images from the array. Number is based on difficulty chosen on the form
function randomImages (difficulty) {

  // Reset variables at the start of every game
  imageSources = [];
  uniqueGameCards = [];
  finalGameCards = [];
  gameContainer.innerHTML = '';
  score = 0;
  updateScoreDisplay()

  // 16, 20, or 24 total cards based on difficulty
  let numOfCards;
  switch (difficulty) {
    case 'easy':
      numOfCards = 8;
      break;
    case 'medium':
      numOfCards = 10;
      break;
    case 'hard':
      numOfCards = 12;
      break;
  }
  const indices = randomNumbers(numOfCards);
  assignImages(indices);
  createCards(imageSources);
  shuffleCards(finalGameCards);
  placeCards(finalGameCards);
}

// Selects unique, random numbers which are used as indices to select random images from an array
function randomNumbers (length) {
  let indices = []
  while (indices.length < length) {
    const index = Math.floor(Math.random() * length)
    if (!indices.includes(index)) {
      indices.push(index);
    }
  }
  return indices
}

// Uses the random indices to choose images for the game from the array of possible images
function assignImages (indices) {
  for (let i of indices) {
    imageSources.push(pathToImages[i]);
  }
} 

// Gives each image a unique ID (so the same image clicked twice is not a match) and a match ID (to confirm another image is a match)
function setData (elem) {
  const unique = Math.floor(Math.random() * 10000);
  const match = Math.floor(Math.random() * 10000);
  elem.setAttribute('data-uniqueid', unique);
  elem.setAttribute('data-matchid', match);
}

function createCards (sources) {

  // Creates html img element with appropriate attributes and adds them to the array containing the original of each card (no duplicates)
  for (let imageSrc of sources) {
    const cardImage = document.createElement('img');
    cardImage.setAttribute('src', imageSrc);
    cardImage.setAttribute('class', 'image');
    setData(cardImage);
    uniqueGameCards.push(cardImage);
  }
  // Creates a duplicate for each card with the same match id, adds original and duplicate to array of cards used for the game
  uniqueGameCards.forEach(uniqueGameCard => {
    const matchingCard = document.createElement('img');
    matchingCard.setAttribute('src', uniqueGameCard.getAttribute('src'));
    matchingCard.setAttribute('class', 'image');

    const unique = Math.floor(Math.random() * 10000);
    matchingCard.dataset.uniqueid = unique;
    matchingCard.dataset.matchid = uniqueGameCard.dataset.matchid;

    finalGameCards.push(uniqueGameCard, matchingCard);
  })
}

// Uses random numbers to assign places in the array for the cards
function shuffleCards (deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[randomIndex]] = [deck[randomIndex], deck[i]];
  }
}

// Clicks variable helps with ensuring you pick exactly two cards before it checks for a match and then flips the cards back over
let clicks = 0;
let card1;
let card2;

// Event listener for clicks on cards
gameContainer.addEventListener('click', function(e) {
  if (e.target.classList.contains('card-back') && clicks === 0) {
    card1 = flipCardToFront(e.target);
    clicks += 1;
    updateScore();
  } else if (e.target.classList.contains('card-back') && clicks === 1) {
    card2 = flipCardToFront(e.target);
    clicks += 1;
    if (isMatch(card1, card2)) {
      clicks = 0;
      if (isGameOver()) {

        // Updates best score for respective difficulty, or initializes it if it doesn't exist. Adds it to local storage
        if (!scores[gameDifficulty] || score < scores[gameDifficulty]) {
          scores[gameDifficulty] = score;
          localStorage.setItem('bestScores', JSON.stringify(scores));
        }
      }
    } else {
      setTimeout(function() {
        flipCardsToBack([card1, card2]);
        clicks = 0;
      }, 1000);
    }
}})

// Shows image instead of card back
function flipCardToFront(target) {
  for (let card of finalGameCards) {
    if (target.dataset.uniqueid === card.dataset.uniqueid) {
      target.append(card);
      card.classList.remove('hidden-card')
      target.classList.remove('card-back');
      return card;
    }
  }
}

// Hides images and shows card backs
function flipCardsToBack(cards) {
  for (let card of cards) {
    card.parentElement.classList.add('card-back');
    card.classList.add('hidden-card');
  }
}

// Creates divs (backs of cards) to go in each spot on the grid
function placeCards(deck) {
  for (let card of deck) {
    const cardBack = document.createElement('div');
    cardBack.setAttribute('data-uniqueid', card.dataset.uniqueid);
    cardBack.setAttribute('data-matchid', card.dataset.matchid);
    cardBack.classList.add('card-back');
    gameContainer.append(cardBack);
  }
}

// Ensures the card matches and is unique
function isMatch (card1, card2) {
  if (card1.dataset.matchid === card2.dataset.matchid && card1.dataset.uniqueid !== card2.dataset.uniqueid) {
    return true;
  }
  return false;
}

// Returns true if all of the cards are flipped over, otherwise returns false
function isGameOver() {
  for (let card of finalGameCards) {
    if (card.classList.contains('hidden-card')) {
      return false;
    }
  }
  return true;
}