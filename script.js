// GLOBAL VARIABLES
// boardSize has to be an even number
const boardSize = 2;
const board = [];
let firstCard = null;
let firstCardElement;
let deck;
let canClick = true;
let gameWin = false;
let gameStart = false;
let matchCount = 0;

// timer stuff
let timerMilliseconds = 30000;
const delayInMs = 1;

// build timer in DOM
// create div holding all timer elements
const timerDiv = document.createElement('div');
document.body.appendChild(timerDiv);
// create timer start button
const timerButton = document.createElement('button');
timerButton.setAttribute('id', 'timer-button');
timerButton.innerText = 'Start';
timerDiv.appendChild(timerButton);
// create timer display (don't append yet so that innerhtml can be cleared between games)
const timerOutput = document.createElement('span');

// message appears if you win
const winMessage = () => {
  const winStatement = document.createElement('div');
  winStatement.innerText = 'Nice la, gg ez WINNER. <br> Click the button to start a new game.';
  winStatement.setAttribute('class', 'win');
  document.body.appendChild(winStatement);

  gameWin = true;
  timerButton.disabled = false;
};

const loseMessage = () => {
  const loseStatement = document.createElement('div');
  loseStatement.innerText = 'Get gud noob! LOSER <br> Click the button to start a new game.';
  loseStatement.setAttribute('class', 'lose');
  document.body.appendChild(loseStatement);

  timerButton.disabled = false;
};

const startGame = () => {
  if (gameWin === true) {
    resetGame();
    return;
  }

  gameWin = false;

  // reset timer div
  timerOutput.innerHTML = '';

  timerOutput.setAttribute('id', 'timer');
  timerOutput.innerText = timerMilliseconds;
  timerDiv.appendChild(timerOutput);
  const startTimer = setInterval(() => {
    timerOutput.innerText = `You have ${Math.round(timerMilliseconds / 1000)} seconds remaining.`;

    // lose condition
    if (timerMilliseconds <= 0 && matchCount !== boardSize * boardSize && gameWin === false) {
      clearInterval(startTimer);
      // to do function:
      loseMessage();
    }
    timerMilliseconds -= 1;

    if (gameWin === true) {
      clearInterval(startTimer);
      timerButton.disabled = false;
    }
  }, delayInMs);

  // set game mode to start
  gameStart = true;
  timerButton.disabled = true;
};

timerButton.addEventListener('click', startGame);

// Get a random index ranging from 0 (inclusive) to max (exclusive).
const getRandomIndex = (max) => Math.floor(Math.random() * max);

// Shuffle an array of cards
const shuffleCards = (cards) => {
  // Loop over the card deck array once
  for (let currentIndex = 0; currentIndex < cards.length; currentIndex += 1) {
    // Select a random index in the deck
    const randomIndex = getRandomIndex(cards.length);
    // Select the card that corresponds to randomIndex
    const randomCard = cards[randomIndex];
    // Select the card that corresponds to currentIndex
    const currentCard = cards[currentIndex];
    // Swap positions of randomCard and currentCard in the deck
    cards[currentIndex] = randomCard;
    cards[randomIndex] = currentCard;
  }
  // Return the shuffled deck
  return cards;
};

// GAMEPLAY LOGIC
// Callback function for the 'click' event

const squareClick = (cardElement, column, row) => { // cardElement refers to board[i][j] element
  // console.log(cardElement);
  // console.log('FIRST CARD DOM ELEMENT', firstCard);
  // console.log('BOARD CLICKED CARD', board[column][row]);

  const clickedCard = board[column][row];

  // the user already clicked on this square or game has not started
  if (cardElement.innerText !== '' || canClick !== true || gameStart != true) {
    return;
  }

  // first turn
  if (firstCard === null) {
    console.log('first turn');
    firstCard = clickedCard;
    // turn this card over
    cardElement.innerText = firstCard.name + clickedCard.suitSymbol;

    // hold onto this for later when it may not match
    firstCardElement = cardElement;

    // second turn
  } else {
    console.log('second turn');
    if (
      clickedCard.name === firstCard.name
        && clickedCard.suit === firstCard.suit
    ) {
      console.log('match');
      // turn this card over
      cardElement.innerText = clickedCard.name + clickedCard.suitSymbol;
      matchCount += 2;

      // win condition
      if (matchCount >= (boardSize * boardSize)) {
        winMessage();
      }
    } else {
      console.log('NOT a match');

      // ADDED: reveal the card
      cardElement.innerText = clickedCard.name + clickedCard.suitSymbol;
      canClick = false; // user can't click while waiting for card to close
      setTimeout(() => {
        // turn both cards back over
        firstCardElement.innerText = '';
        cardElement.innerText = '';
        canClick = true;
      }, 2000);
    }

    // reset the first card
    firstCard = null;
  }
};

// MAKE DECK

// creates deck like A,A,2,2,3,3,4,4,etc
const makeDeck = (cardAmount) => {
  // create the empty deck at the beginning
  const newDeck = [];
  const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
  const suitsEmoji = ['♥', '♦', '♣', '♠'];
  const cardColor = ['red', 'red', 'black', 'black'];

  for (let suitIndex = 0; suitIndex < suits.length; suitIndex += 1) {
    // make a variable of the current suit
    const currentSuit = suits[suitIndex];
    const currentSuitSymbol = suitsEmoji[suitIndex];
    const currentColor = cardColor[suitIndex];

    // console.log(`current suit: ${currentSuit}`);

    // loop to create all cards in this suit
    // rank 1-13
    for (let rankCounter = 1; rankCounter <= 13; rankCounter += 1) {
      // Convert rankCounter to string
      let cardName = `${rankCounter}`;

      // 1, 11, 12 ,13
      if (cardName === '1') {
        cardName = 'A';
      } else if (cardName === '11') {
        cardName = 'J';
      } else if (cardName === '12') {
        cardName = 'Q';
      } else if (cardName === '13') {
        cardName = 'K';
      }

      // make a single card object variable
      const card = {
        name: cardName,
        suit: currentSuit,
        suitSymbol: currentSuitSymbol,
        rank: rankCounter,
        color: currentColor,
      };

      // console.log(`rank: ${rankCounter}`);

      // add the card to the deck
      newDeck.push(card); // add double the cards to the deck
      newDeck.push(card);
    }
  }

  return newDeck;
};

// INITIALISATION

// create all the board elements that will go on the screen
// return the built board
const buildBoardElements = (board) => {
  // create the element that everything will go inside of
  const boardElement = document.createElement('div');

  // give it a class for CSS purposes
  // boardElement.classList.add('board');
  boardElement.setAttribute('id', 'board');

  // use the board data structure we passed in to create the correct size board
  for (let i = 0; i < board.length; i += 1) {
    // make a var for just this row of cards
    const row = board[i];

    // make an element for this row of cards
    const rowElement = document.createElement('div');
    rowElement.classList.add('row');

    // make all the squares for this row
    for (let j = 0; j < row.length; j += 1) {
      // create the square element
      const square = document.createElement('div');

      // set a class for CSS purposes
      square.classList.add('square');

      // set the click event
      // eslint-disable-next-line
      square.addEventListener('click', (event) => {
        // we will want to pass in the card element so
        // that we can change how it looks on screen, i.e.,
        // "turn the card over"
        squareClick(event.currentTarget, i, j);
      });

      rowElement.appendChild(square);
    }
    boardElement.appendChild(rowElement);
  }

  return boardElement;
};

const initGame = () => {
  // create this special deck by getting the doubled cards and
  // making a smaller array that is ( boardSize squared ) number of cards
  const doubleDeck = makeDeck();
  const deckSubset = doubleDeck.slice(0, boardSize * boardSize); // take indexes 0 to 15
  deck = shuffleCards(deckSubset); // shuffles cards 0 to 15

  // deal the cards out to the board data structure
  for (let i = 0; i < boardSize; i += 1) {
    // push an empty array into the 'board' array
    board.push([]);

    for (let j = 0; j < boardSize; j += 1) {
      // pop a card from the shuffled deck and push into board[i]
      board[i].push(deck.pop());
    }
  }
  // [ 0,1,2,3 ]
  // [ 0,1,2,3 ]
  // [ 0,1,2,3 ]
  // [ 0,1,2,3 ]
  // 'board' is an array of arrays.

  const boardEl = buildBoardElements(board);

  document.body.appendChild(boardEl);
};

const resetGame = () => {
  // document.getElementsByClassName('board').innerHTML = '';
  document.getElementById('board').remove();
  deck = [];
  gameWin = false;
  gameStart = true;

  initGame();
};

initGame();
