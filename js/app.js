/*
 * Array of classes to be added to icons
 */
const faClasses = [
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

const deck         = document.getElementsByClassName('deck')[0];
const reset        = document.getElementsByClassName('restart')[0];
const moves        = document.getElementsByClassName('moves')[0];
const gameOverDiv  = document.getElementsByClassName('game-over')[0];
const timerDiv     = document.getElementsByClassName('timer')[0];
const btnPlayAgain = document.getElementsByClassName('button-playagain')[0];

let timer;
let sec = 0;
let minutes = 0;
let timerOutput = '';
const li = [];
const icon = [];
const gridQtd = 16;

createList();
shufleCards();

/* DONE
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below - ok
 *   - loop through each card and create its HTML - ok
 *   - add each card's HTML to the page - ok
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

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

let cardCounter    = 0;
let selectedCards  = [];
let totalClicks    = 0;
let matchesCounter = 0;

setMoves(0);
firstReveal(deck);

deck.addEventListener('click', function (event) {

    // Check if the game is over
    if (endGame()) {
        return;
    }

    if (getMoves() === 0) {
        startTimer();
    }

    // Verify if the event target is an LI 
    if (event.target.tagName !== 'LI') {
        return;
    }

    // Verify if the actual card has been clicked
    for (let i = 0, len = selectedCards.length; i < len; i++) {
        if (selectedCards[i] === event.target) {
            return;
        }
    }

    setMoves(++totalClicks);

    if (cardCounter < 2) {
        showCard(event.target);
        selectedCards.push(event.target)
        cardCounter++;
    }

    if (cardCounter === 2) {
        if (cardsMatch(selectedCards)) {
            cardCounter = 0;
            selectedCards = [];
        } else {
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

function createList() {

    for (let i = 0; i < gridQtd; i++) {
        // create li 
        li.push(document.createElement('LI'));
        // create icon 
        icon.push(document.createElement('I'));
    }
}

function shufleCards() {
    auxClasses = shuffle(faClasses);
    for (let i = 0; i < gridQtd; i++) {
        li[i].classList.add('card');
        icon[i].classList.add(`fa`);
        icon[i].classList.add(auxClasses[i]);
        li[i].appendChild(icon[i]);
        deck.appendChild(li[i]);
    }
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
 * @param {*} arrayCards array of 2 cards to compare
 * return boolean true or false
 */

function cardsMatch(arrayCards) {
    const cardOne = arrayCards[0];
    const cardTwo = arrayCards[1];

    const cardOneClass = cardOne.firstElementChild.classList.value.substring(3);
    const cardTwoClass = cardTwo.firstElementChild.classList.value.substring(3);

    if (cardOneClass === cardTwoClass) {

        matchesCounter++;
        cardOne.classList.add('match');
        cardTwo.classList.add('match');
        cardOne.classList.remove('open');
        cardTwo.classList.remove('open');
        cardOne.classList.remove('show');
        cardTwo.classList.remove('show');

        if (matchesCounter === 8) {
            endGame();
        }

        return true;

    } else {

        return false;

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
        const fragment = document.createDocumentFragment();
        if (allCards.length === 16) {

            gameOverDiv.classList.add('show');

            const div = document.createElement('DIV');
            const timerDiv = document.createElement('DIV');
            const buttonPlayAgain = document.createElement('BUTTON');

            timerDiv.innerHTML = `Seu tempo foi ${timerOutput}`;
            div.innerHTML = `Você ganhow com ${getMoves()} movimentos, parabéns :)`;
            buttonPlayAgain.innerHTML = 'Play Again';
            buttonPlayAgain.setAttribute('id', 'btnRestart');

            timerDiv.classList.add('game-over-msg');
            buttonPlayAgain.classList.add('button-playagain');
            div.classList.add('game-over-msg');


            div.appendChild(timerDiv);
            div.appendChild(buttonPlayAgain);
            fragment.appendChild(div);
            gameOverDiv.appendChild(fragment);
            buttonPlayAgain.addEventListener('click', playAgain);

            resetTimer();
            return true;
        } else {
            return false;
        }
    }
}


function resetGame() {

    const cards = document.getElementsByClassName('card');

    for (let i = 0, len = cards.length; i < len; i++) {
        faClasses.forEach(res => {
            if (cards[i].children[0].classList.value.substring(3) === res) {
                cards[i].children[0].classList.remove(res);
                cards[i].classList.remove('match');
            }
        })
    }


    setMoves(0);
    selectedCards = [];
    shufleCards();
}


function startTimer() {
    timer = setInterval(function () {
        sec++;
        if (sec >= 60) {
            sec = 0;
            minutes++;
        }
        if (sec < 10) {
            timerOutput = `${minutes}m 0${sec}s`;
        } else {
            timerOutput = `${minutes}m ${sec}s`;
        }

        timerDiv.innerHTML = timerOutput;

    }, 1000);

}

function resetTimer() {
    sec = 0;
    minutes = 0;
    timerOutput = '0m 00s';
    timerDiv.innerHTML = timerOutput;
    clearInterval(timer);
}

function firstReveal(deck) {
    let cards = deck.children;
    for (let i = 0, len = cards.length; i < len; i++) {
        cards[i].classList.add('open');
        cards[i].classList.add('show');
    }
    setTimeout(function () {
        for (let i = 0, len = cards.length; i < len; i++) {
            cards[i].classList.remove('open');
            cards[i].classList.remove('show');
        }
    }, 3000);
}

playAgain = function () {
    console.log('click');
    gameOverDiv.classList.remove('show');
    resetGame();
    resetTimer();
    firstReveal(deck);
};