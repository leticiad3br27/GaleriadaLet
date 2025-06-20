// This file is intentionally left blank.// Constantes e seletores
const onePlayerBtn = document.getElementById('one-player');
const twoPlayersBtn = document.getElementById('two-players');
const wordInputSection = document.getElementById('word-input-section');
const inputWord = document.getElementById('input-word');
const submitWordBtn = document.getElementById('submit-word');
const wordInputError = document.getElementById('word-input-error');

const gameSection = document.getElementById('game-section');
const gameBoardDisplay = document.getElementById('word-display');
const lettersGuessedDisplay = document.getElementById('letters-guessed');
const hangmanSvgParts = ['rope','head','body','left-arm','right-arm','left-leg','right-leg'].map(id => document.getElementById(id));
const statusMessage = document.getElementById('message');
const letterInput = document.getElementById('letter-input');
const guessButton = document.getElementById('guess-letter');
const restartButton = document.getElementById('restart');

// Variáveis globais do jogo
let secretWord = '';
let guessedLetters = [];
let wrongGuesses = 0;
const maxWrongGuesses = hangmanSvgParts.length;
let mode = ''; // 'one-player' ou 'two-players'

// Dicionário simples para 1 jogador (exemplo, lista pequena)
const dictionary = [
    'JAVASCRIPT', 'PROGRAMACAO', 'DESENVOLVEDOR', 'TECNOLOGIA', 'COMPUTADOR', 'INTERNET', 'SOFTWARE',
    'HARDWARE', 'ALGORITMO', 'FUNCAO', 'VARIAVEL', 'OBJETO', 'ARRAY', 'DOMINIO', 'REDE', 'SISTEMA',
    'COMPILADOR', 'INTERPRETADOR', 'GITHUB', 'FRAMEWORK'
];

// Função para iniciar escolha do modo 1 jogador
onePlayerBtn.addEventListener('click', () => {
    mode = 'one-player';
    wordInputSection.classList.add('hidden');
    gameSection.classList.remove('hidden');
    newGameOnePlayer();
});

// Função para iniciar escolha do modo 2 jogadores
twoPlayersBtn.addEventListener('click', () => {
    mode = 'two-players';
    wordInputSection.classList.remove('hidden');
    gameSection.classList.add('hidden');
    inputWord.value = '';
    wordInputError.classList.add('hidden');
    statusMessage.textContent = '';
    guessedLetters = [];
    wrongGuesses = 0;
    hideHangmanParts();
});

// Validação e submissão da palavra no modo 2 jogadores
submitWordBtn.addEventListener('click', () => {
    let word = inputWord.value.toUpperCase().trim();
    if (!word.match(/^[A-ZÀ-Ú]+$/)) {
        wordInputError.textContent = 'Palavra inválida! Use somente letras.';
        wordInputError.classList.remove('hidden');
        return;
    }
    if (word.length < 3) {
        wordInputError.textContent = 'Palavra deve ter pelo menos 3 letras.';
        wordInputError.classList.remove('hidden');
        return;
    }
    wordInputError.classList.add('hidden');
    secretWord = word;
    guessedLetters = [];
    wrongGuesses = 0;
    wordInputSection.classList.add('hidden');
    gameSection.classList.remove('hidden');
    statusMessage.textContent = '';
    hideHangmanParts();
    updateWordDisplay();
    updateLettersGuessed();
    letterInput.value = '';
    letterInput.focus();
});

// Iniciar novo jogo no modo 1 jogador
function newGameOnePlayer() {
    secretWord = dictionary[Math.floor(Math.random() * dictionary.length)];
    guessedLetters = [];
    wrongGuesses = 0;
    statusMessage.textContent = '';
    hideHangmanParts();
    updateWordDisplay();
    updateLettersGuessed();
    letterInput.value = '';
    letterInput.focus();
}

// Atualizar a exibição da palavra, mostrando letras corretas e _ para ocultas
function updateWordDisplay() {
    let display = '';
    for (let letter of secretWord) {
        display += guessedLetters.includes(letter) ? letter + ' ' : '_ ';
    }
    gameBoardDisplay.textContent = display.trim();
}

// Atualizar as letras chutadas (erradas e certas)
function updateLettersGuessed() {
    lettersGuessedDisplay.textContent = 'Letras chutadas: ' + guessedLetters.join(', ');
}

// Mostrar partes da forca conforme erros
function showHangmanPart(index) {
    if (index >= 0 && index < hangmanSvgParts.length) {
        hangmanSvgParts[index].style.visibility = 'visible';
    }
}

// Esconder todas as partes da forca
function hideHangmanParts() {
    hangmanSvgParts.forEach(part => {
        part.style.visibility = 'hidden';
    });
}

// Função para processar chute da letra
function guessLetter() {
    if (!gameSection.classList.contains('hidden') && gameActive) {
        let input = letterInput.value.toUpperCase();
        letterInput.value = '';
        letterInput.focus();

        if (!input.match(/^[A-ZÀ-Ú]$/)) {
            statusMessage.textContent = 'Por favor, digite uma única letra válida.';
            return;
        }
        if (guessedLetters.includes(input)) {
            statusMessage.textContent = 'Letra já chutada, tente outra.';
            return;
        }

        guessedLetters.push(input);

        if (secretWord.includes(input)) {
            statusMessage.textContent = 'Boa! A letra está na palavra.';
        } else {
            wrongGuesses++;
            statusMessage.textContent = 'Letra errada!';
            showHangmanPart(wrongGuesses - 1);
        }

        updateWordDisplay();
        updateLettersGuessed();
        checkGameOver();
    }
}

// Checar se o jogo acabou (vitória ou derrota)
function checkGameOver() {
    // Vitória: todas as letras descobertas
    const won = secretWord.split('').every(letter => guessedLetters.includes(letter));
    if (won) {
        statusMessage.textContent = 'Parabéns! Você venceu!';
        gameActive = false;
        letterInput.disabled = true;
        guessButton.disabled = true;
        restartButton.classList.remove('hidden');
        return;
    }

    // Derrota: excedeu erros máximos
    if (wrongGuesses >= maxWrongGuesses) {
        statusMessage.textContent = `Game Over! A palavra era: ${secretWord}`;
        updateWordDisplayReveal();
        gameActive = false;
        letterInput.disabled = true;
        guessButton.disabled = true;
        restartButton.classList.remove('hidden');
    }
}

// Revelar a palavra completa ao término do jogo
function updateWordDisplayReveal() {
    let display = '';
    for (let letter of secretWord) {
        display += letter + ' ';
    }
    gameBoardDisplay.textContent = display.trim();
}

// Reiniciar jogo após término
restartButton.addEventListener('click', () => {
    gameActive = true;
    guessedLetters = [];
    wrongGuesses = 0;
    letterInput.disabled = false;
    guessButton.disabled = false;
    restartButton.classList.add('hidden');
    statusMessage.textContent = '';

    hideHangmanParts();

    if (mode === 'one-player') {
        newGameOnePlayer();
    } else if (mode === 'two-players') {
        wordInputSection.classList.remove('hidden');
        gameSection.classList.add('hidden');
        inputWord.value = '';
        wordInputError.classList.add('hidden');
    }
});

guessButton.addEventListener('click', guessLetter);

// Permitir jogar ao pressionar Enter no campo de letra
letterInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !guessButton.disabled) {
        guessLetter();
    }
});

// Estado inicial
let gameActive = false;

