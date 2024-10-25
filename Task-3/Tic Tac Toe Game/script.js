// Get references to HTML elements
const board = document.getElementById('board');
const message = document.getElementById('message');
const restartButton = document.getElementById('restartButton');
const startButton = document.getElementById('startButton');
const modeSelect = document.getElementById('mode');
const symbolSelect = document.getElementById('symbol');

// Game state variables
let gameActive = false; // Indicates if the game is active
let currentPlayer; // Tracks the current player (X or O)
let gameBoard = ['', '', '', '', '', '', '', '', '']; // Represents the board state
let mode; // Stores the game mode (friend or AI)
let playerSymbol; // Symbol chosen by the player (X or O)
let aiSymbol; // Symbol chosen by the AI

// Event listeners for buttons
startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', restartGame);

// Function to start the game
function startGame() {
    // Get selected mode and symbols
    mode = modeSelect.value;
    playerSymbol = symbolSelect.value;
    aiSymbol = playerSymbol === 'X' ? 'O' : 'X'; // Assign opposite symbol to AI

    // Reset game board and state
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = playerSymbol; // Set current player to the human player
    gameActive = true; // Set game to active
    message.textContent = ''; // Clear any previous messages
    restartButton.classList.add('hidden'); // Hide the restart button

    // Create the game board
    createBoard();
}

// Function to create the game board
function createBoard() {
    board.innerHTML = ''; // Clear existing board
    for (let i = 0; i < 9; i++) {
        // Create a cell for each board position
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.index = i; // Store index in a data attribute
        cell.addEventListener('click', handleCellClick); // Add click event listener
        board.appendChild(cell); // Add cell to the board
    }
}

// Function to handle cell clicks
function handleCellClick(event) {
    const clickedCell = event.target; // Get the clicked cell
    const clickedIndex = clickedCell.dataset.index; // Get the index of the clicked cell

    // Check if the cell is already filled or if the game is not active
    if (gameBoard[clickedIndex] !== '' || !gameActive) {
        return; // Exit if invalid move
    }

    // Update the game board and display the player's symbol
    gameBoard[clickedIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;

    // Check for a winner after the move
    checkWinner();
    
    // If the game is still active and mode is AI, make AI's move
    if (gameActive && mode === 'ai' && currentPlayer === playerSymbol) {
        currentPlayer = aiSymbol; // Set current player to AI
        setTimeout(aiMove, 500); // Delay AI move for a better user experience
    } else {
        // Switch to the other player
        currentPlayer = currentPlayer === playerSymbol ? aiSymbol : playerSymbol;
    }
}

// Function to make the AI's move
function aiMove() {
    // Get indices of empty cells
    const emptyIndices = gameBoard.map((val, index) => val === '' ? index : null).filter(val => val !== null);
    // Choose a random empty cell for AI to play
    const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    
    // Update game board and display AI's symbol
    gameBoard[randomIndex] = aiSymbol;
    const cell = document.querySelector(`.cell[data-index='${randomIndex}']`);
    cell.textContent = aiSymbol;

    // Check for a winner after AI's move
    checkWinner();
    
    // Switch back to the player's turn
    currentPlayer = playerSymbol;
}

// Function to check for a winner or a tie
function checkWinner() {
    // Define all possible winning combinations
    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6] // diagonals
    ];

    // Check each winning condition
    for (let condition of winningConditions) {
        const [a, b, c] = condition;
        if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            // If a winning condition is met, end the game with a victory message
            endGame(`${gameBoard[a]} wins!`);
            return;
        }
    }

    // Check for a tie (no empty spaces left)
    if (!gameBoard.includes('')) {
        endGame('It\'s a tie!'); // End game with a tie message
    }
}

// Function to end the game and display the result
function endGame(result) {
    message.textContent = result; // Show the result message
    gameActive = false; // Set game to inactive
    restartButton.classList.remove('hidden'); // Show the restart button
}

// Function to restart the game
function restartGame() {
    startGame(); // Call startGame to reset everything
}
