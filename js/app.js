/*
 * Array of classes to be added to icons
 */
let faClasses = [
    'fa-diamond',
    'fa-paper-plane-o',
    'fa-anchor',
    'fa-bolt',
    'fa-cube',
    'fa-anchor',
    'fa-leaf',
    'fa-bicycle',
    'fa-diamond',
    'fa-bomb',
    'fa-leaf',
    'fa-bomb',
    'fa-bolt',
    'fa-bicycle',
    'fa-paper-plane-o',
    'fa-cube'
];

const deck = document.getElementsByClassName('deck')[0]
const reset = document.getElementsByClassName('restart')[0];
const moves = document.getElementsByClassName('moves')[0];

const li = [];
const icon = []
const gridQtd = 16

faClasses = shuffle(faClasses);

for (let i = 0; i < gridQtd; i++) {
    // create li 
    li.push(document.createElement('LI'));
    // create icon 
    icon.push(document.createElement('I'))
}

for (let i = 0; i < gridQtd; i++) {
    li[i].classList.add('card')
    icon[i].classList.add(`fa`);
    icon[i].classList.add(faClasses[i]);
    li[i].appendChild(icon[i]);
    deck.appendChild(li[i]);
}



/* DONE
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below - ok
 *   - loop through each card and create its HTML - ok
 *   - add each card's HTML to the page - ok
 */


// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

let cardCounter = 0;
let selectedCards = [];
let totalClicks = 0;
setMoves(0);

deck.addEventListener('click', function (event) {

    if (endGame()) {
        return;
    }

    setMoves(++totalClicks);

    if (cardCounter < 2) {
        showCard(event.target);
        selectedCards.push(event.target)
        cardCounter++;
    }

    if (cardCounter === 2) {
        if(cardsMatch(selectedCards)) {
            console.log('yeah yeah')
            cardCounter = 0;
            selectedCards = [];
        }
        else {
            hideCards(selectedCards)
            cardCounter = 0;
            selectedCards = [];
        }
    }
});

reset.addEventListener('click', function () {
    resetGame();
    resetTimer();
    setMoves(0);
});

function showCard(card) {
    card.classList.add('show');
    card.classList.add('open');
}

function hideCards(arrayCards) {
    setTimeout(function () {
        const cardOne = arrayCards[0];
        const cardTwo = arrayCards[1];
        cardOne.classList.remove('open');
        cardOne.classList.remove('show');
        cardTwo.classList.remove('open');
        cardTwo.classList.remove('show');
    }, 1000);

}

/**
 * 
 * @param {*} arrayCards array of 2 cards to compare
 * return boolean true or false
 */
function cardsMatch(arrayCards) {
    const cardOne = arrayCards[0]
    const cardTwo = arrayCards[1]
    
    const cardOneClass = cardOne.firstElementChild.classList.value.substring(3);
    const cardTwoClass = cardTwo.firstElementChild.classList.value.substring(3);
    
    if (cardOneClass === cardTwoClass ) {
        cardOne.classList.add('match');
        cardTwo.classList.add('match');
        return true;
    } else {
        return false
    }
}

function setMoves(move) {
    totalClicks = move;
    moves.textContent = totalClicks;
}

function getMoves() {
    return totalClicks;
}

function endGame() {
    if (getMoves() >= 16) {
        let allCards = document.getElementsByClassName('match');
        if (allCards.length === 16) {
            return true;
        } else {
            return false;
        }
    }
}

function resetGame() {
    const matchedCards = document.getElementsByClassName('match');
    console.log(document.getElementsByClassName('match'))
    matchedCards.classList.remove('match');
}

function resetTimer() {

}