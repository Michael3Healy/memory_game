const gameContainer = document.getElementById("game");
const welcomeForm = document.querySelector('#selections');
const difficultyChoice = document.querySelector('select')
const resetForm = document.querySelector('.reset')

let gameDifficulty;
let gameImages;

// Contains all of the potential images that could be used
const pathToImages = [
  "images/pexels-james-wheeler-417074.jpg", "images/36-iconic-waterfall-seljandrafoss-iceland.avif", "images/avenue-815297_640.jpg", 
  "images/bsr-focus-nature-hero.jpg", "images/image27-1.png", "images/istockphoto-517188688-612x612.jpg", "images/lake-blue-moonlight-moon-wallpaper-preview.jpg",
  "images/mixkit-going-down-a-curved-highway-through-a-mountain-range-41576-0.avif", "images/nature-3082832_1280.jpg", "images/photo-1617635277889-df22350f81a0.avif",
  "images/road-1072821_640.jpg", "images/unnamed.jpg"
];

welcomeForm.addEventListener('submit', function (e) {
  if (e.submitter.classList.contains('start')) {
    e.preventDefault();
  }
  gameDifficulty = difficultyChoice.value;
  randomImages(pathToImages, gameDifficulty)
})

// Pick random images from the array. Number is based on user input into the form
function randomImages (array, difficulty) {
  gameImages = [];
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
  
}

// Selects unique, random numbers which are used as indices to select random images from an array
function randomNumbers (length) {
  indices = []
  while (indices.length < length) {
    const index = Math.floor(Math.random() * length)
    if (!indices.includes(index)) {
      indices.push(index);
    }
  }
  return indices
}

function assignImages (indices) {
  for (let i of indices) {
    gameImages.push(pathToImages[i]);
  }
} 

// resetForm.addEventListener('submit', function () {
//   gameImages = [];
// })
