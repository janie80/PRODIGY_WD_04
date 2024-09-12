const cells = document.querySelectorAll('.cell');
const statusText = document.querySelector('.status');
const resetButton = document.getElementById('resetButton');
const backButton = document.getElementById('backButton');
const playWithOpponentButton = document.getElementById('playWithOpponent');
const playWithAIButton = document.getElementById('playWithAI');

let currentPlayer = 'X'; // Player starts first
let board = ['', '', '', '', '', '', '', '', ''];
let isGameOver = false;
let againstAI = false; // Flag for AI mode
let difficulty = 'hard'; // Default difficulty level

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// Event Listeners for game modes
playWithOpponentButton.addEventListener('click', () => startGame(false)); // 2-player mode
playWithAIButton.addEventListener('click', () => chooseDifficulty()); // AI mode with difficulty choice
backButton.addEventListener('click', showStartScreen); // Go back to start screen

// Handle starting the game in the correct mode
function startGame(isAI) {
    againstAI = isAI; // Set AI mode flag based on player's choice
    startScreen.style.display = 'none'; // Hide the start screen
    gameScreen.style.display = 'block'; // Show the game screen
    resetGame(); // Reset the game when starting
}

// Prompt user to choose difficulty
function chooseDifficulty() {
    const userChoice = prompt("Choose difficulty level: 'easy' or 'hard'", 'hard');
    if (userChoice === 'easy' || userChoice === 'hard') {
        difficulty = userChoice; // Set difficulty level based on user input
        startGame(true); // Start game in AI mode
    } else {
        alert("Invalid choice. Defaulting to 'hard'.");
        difficulty = 'hard'; // Default to hard if the input is invalid
        startGame(true); // Start game in AI mode
    }
}

// Show the start screen
function showStartScreen() {
    gameScreen.style.display = 'none'; // Hide the game screen
    startScreen.style.display = 'block'; // Show the start screen
}

// Event Listener for handling clicks on cells
cells.forEach(cell => {
    cell.addEventListener('click', () => handleCellClick(cell));
});

resetButton.addEventListener('click', resetGame); // Reset game button

function handleCellClick(cell) {
    const index = cell.getAttribute('data-index');

    if (board[index] !== '' || isGameOver || (currentPlayer === 'O' && againstAI)) {
        return; // Ignore invalid click
    }

    board[index] = currentPlayer;
    cell.textContent = currentPlayer;

    if (checkWin()) {
        statusText.textContent = `Player ${currentPlayer} wins!`;
        highlightWinningCells();
        isGameOver = true;
    } else if (board.every(cell => cell !== '')) {
        statusText.textContent = 'It\'s a draw!';
        isGameOver = true;
    } else {
        switchPlayer();
    }
}

function switchPlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

    if (againstAI && currentPlayer === 'O') {
        statusText.textContent = `AI's turn...`;
        setTimeout(makeAIMove, 1000); // AI takes its turn
    } else {
        statusText.textContent = `Player ${currentPlayer}'s turn`;
    }
}

function makeAIMove() {
    let bestMove;

    if (difficulty === 'hard') {
        bestMove = minimax(board, 'O');
    } else {
        bestMove = randomMove(board);
    }

    board[bestMove.index] = 'O';
    cells[bestMove.index].textContent = 'O';

    if (checkWin()) {
        statusText.textContent = 'AI wins!';
        highlightWinningCells();
        isGameOver = true;
    } else if (board.every(cell => cell !== '')) {
        statusText.textContent = 'It\'s a draw!';
        isGameOver = true;
    } else {
        currentPlayer = 'X';
        statusText.textContent = `Player ${currentPlayer}'s turn`;
    }
}

function randomMove(board) {
    const emptyCells = board.map((val, index) => (val === '' ? index : null)).filter(val => val !== null);
    const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];

    return { index: randomIndex };
}

function minimax(newBoard, player) {
    const availableSpots = newBoard.map((val, index) => (val === '' ? index : null)).filter(val => val !== null);

    if (checkWinWithBoard(newBoard, 'X')) {
        return { score: -10 };
    } else if (checkWinWithBoard(newBoard, 'O')) {
        return { score: 10 };
    } else if (availableSpots.length === 0) {
        return { score: 0 };
    }

    const moves = [];
    for (let i = 0; i < availableSpots.length; i++) {
        const move = {};
        move.index = availableSpots[i];
        newBoard[availableSpots[i]] = player;

        if (player === 'O') {
            const result = minimax(newBoard, 'X');
            move.score = result.score;
        } else {
            const result = minimax(newBoard, 'O');
            move.score = result.score;
        }

        newBoard[availableSpots[i]] = '';
        moves.push(move);
    }

    let bestMove;
    if (player === 'O') {
        let bestScore = -Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = moves[i];
            }
        }
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = moves[i];
            }
        }
    }

    return bestMove;
}

function checkWinWithBoard(board, player) {
    return winningConditions.some(condition => {
        return condition.every(index => board[index] === player);
    });
}

function checkWin() {
    return checkWinWithBoard(board, currentPlayer);
}

function highlightWinningCells() {
    winningConditions.forEach(condition => {
        if (condition.every(index => board[index] === currentPlayer)) {
            condition.forEach(index => {
                cells[index].style.backgroundColor = 'rgba(46, 204, 113, 0.5)';
            });
        }
    });
}

function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    cells.forEach(cell => {
        cell.textContent = '';
        cell.style.backgroundColor = '';
    });
    currentPlayer = 'X';
    isGameOver = false;
    statusText.textContent = `Player ${currentPlayer}'s turn`;
}
