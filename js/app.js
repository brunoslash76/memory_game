/*
 * Array of classes to be added to icons
 */

let faClasses = [
    'fa-anchor',
    'fa-diamond',
    'fa-leaf',
    'fa-bomb',
    'fa-bolt',
    'fa-bicycle',
    'fa-paper-plane-o',
    'fa-cube'
];
faClasses = [...faClasses, ...faClasses];

const deck = document.getElementsByClassName('deck')[0];
const reset = document.getElementsByClassName('restart')[0];
const moves = document.getElementsByClassName('moves')[0];
const timerDiv = document.getElementsByClassName('timer')[0];
const stars = document.getElementsByClassName('stars')[0];

const li = [];
const icon = [];
const gridQtd = 16;

let gameOverDiv = document.getElementsByClassName('game-over')[0];
let timer;
let sec = 0;
let minutes = 0;
let timerOutput = '';
let cardCounter = 0;
let selectedCards = [];
let totalClicks = 0;
let estrelas = 0;
let matchesCounter = 0;

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
    removeStars();

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
});


function showCard(card) {
    card.classList.add('show', 'open');
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
        icon[i].classList.add('fa', auxClasses[i]);
        li[i].appendChild(icon[i]);
        deck.appendChild(li[i]);
    }
}

function hideCards(arrayCards) {
    setTimeout(function () {
        const cardOne = arrayCards[0];
        const cardTwo = arrayCards[1];
        cardOne.classList.remove('open', 'show');
        cardTwo.classList.remove('open', 'show');
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
        cardOne.classList.remove('open', 'show')
        cardTwo.classList.remove('open', 'show')
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

        if (allCards.length === 16) {
            if (!gameOverDiv) {
                console.log('É isso')
            }

            const fragment = document.createDocumentFragment();
            const fragmentButton = document.createDocumentFragment();
            const div = document.createElement('DIV');
            const timerDiv = document.createElement('DIV');
            const msgTempo = document.createElement('DIV');
            const msgEstrelas = document.createElement('DIV');
            const buttonContainer = document.createElement('DIV');
            const button = document.createElement('BUTTON');


            for (let i = 0, len = getEstrelas(); i < len; i++) {
                const star = document.createElement('I');
                star.classList.add('fa', 'fa-star');
                msgEstrelas.appendChild(star);
            }

            msgEstrelas.classList.add('game-over-msg');

            timerDiv.classList.add('game-over-msg');
            timerDiv.innerHTML = `Seu tempo foi ${timerOutput}`;

            msgTempo.classList.add('game-over-msg');
            msgTempo.innerHTML = `Você ganhow com ${getMoves()} movimentos, parabéns :)`;

            div.classList.add('game-over-container');

            button.addEventListener('click', btnPlayAgain);
            button.innerText = 'Play';
            button.classList.add('btn-play');


            div.appendChild(msgTempo);
            div.appendChild(timerDiv);
            div.appendChild(msgEstrelas);

            fragmentButton.appendChild(button);
            fragment.appendChild(div);
            gameOverDiv.appendChild(fragment);
            gameOverDiv.appendChild(fragmentButton);
            gameOverDiv.classList.add('show');

            resetAttr()

            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

function resetGame() {
    resetAttr()
    firstReveal(deck);
}

function resetAttr() {

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
    matchesCounter = 0;
    resetTimer();
    resetStars();
    createList();
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
    clearInterval(timer)
}

function firstReveal(deck) {
    let cards = deck.children;
    for (let i = 0, len = cards.length; i < len; i++) {
        cards[i].classList.add('open', 'show');
    }
    setTimeout(function () {
        for (let i = 0, len = cards.length; i < len; i++) {
            cards[i].classList.remove('open', 'show');
        }
    }, 3000);
}

function removeStars() {
    let lis = stars.children;

    if (getMoves() === 21) {
        lis[2].children[0].classList.remove('fa-star')
        lis[2].children[0].classList.add('fa-star-o')
        estrelas = 2;
    } else if (getMoves() === 41) {
        lis[1].children[0].classList.remove('fa-star')
        lis[1].children[0].classList.add('fa-star-o')
        estrelas = 1;
    }
}

function resetStars() {
    const totalEstrelas = 3;
    for (let i = 0; i < totalEstrelas; i++) {
        stars.children[i].children[0].classList.remove('fa-star-o');
        stars.children[i].children[0].classList.add('fa-star');
    }
    estrelas = 3;
}

function getEstrelas() {
    return estrelas;
}

function btnPlayAgain() {
    
    const main = document.getElementsByClassName('container')[0];
    main.removeChild(gameOverDiv);
    resetAttr();
    firstReveal(deck);
    gameOverDiv = document.createElement('DIV');
    gameOverDiv.classList.add('game-over');
    main.appendChild(gameOverDiv);
}
