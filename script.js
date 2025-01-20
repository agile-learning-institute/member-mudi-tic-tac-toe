const Gameboard = (() => {
    let board = ["", "", "", "", "", "", "", "", ""];

    const getBoard = () => board;

    const resetBoard = () => {
        board = ["", "", "", "", "", "", "", "", ""];
    };

    const setMark = (index, mark) => {
        if (board[index] === "") {
            board[index] = mark;
            return true;
        }
        return false;
    };

    return { getBoard, resetBoard, setMark };
})();

const Player = (name, mark) => {
    return { name, mark };
};

const GameController = (() => {
    let players = [];
    let currentPlayerIndex = 0;
    let gameOver = false;

    const initializeGame = (player1Name, player2Name) => {
        players = [Player(player1Name, "X"), Player(player2Name, "O")];
        currentPlayerIndex = 0;
        gameOver = false;
        Gameboard.resetBoard();
        DisplayController.renderBoard();
        DisplayController.setResultMessage(`${players[currentPlayerIndex].name}'s turn`);
    };

    const playTurn = (index) => {
        if (gameOver || !Gameboard.setMark(index, players[currentPlayerIndex].mark)) {
            return;
        }

        DisplayController.renderBoard();

        if (checkWinner()) {
            gameOver = true;
            DisplayController.setResultMessage(`${players[currentPlayerIndex].name} wins!`);
            DisplayController.showRestartButton();
            return;
        }

        if (isBoardFull()) {
            gameOver = true;
            DisplayController.setResultMessage("It's a tie!");
            DisplayController.showRestartButton();
            return;
        }

        currentPlayerIndex = 1 - currentPlayerIndex; // Toggle between 0 and 1
        DisplayController.setResultMessage(`${players[currentPlayerIndex].name}'s turn`);
    };

    const checkWinner = () => {
        const board = Gameboard.getBoard();
        const winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6],
        ];

        return winningCombinations.some((combination) => {
            const [a, b, c] = combination;
            return board[a] && board[a] === board[b] && board[a] === board[c];
        });
    };

    const isBoardFull = () => {
        return Gameboard.getBoard().every((cell) => cell !== "");
    };

    return { initializeGame, playTurn };
})();

const DisplayController = (() => {
    const gameboardElement = document.getElementById("gameboard");
    const resultElement = document.getElementById("result");
    const restartButton = document.getElementById("restart-btn");

    const renderBoard = () => {
        const board = Gameboard.getBoard();
        gameboardElement.innerHTML = "";
        board.forEach((mark, index) => {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.textContent = mark;
            cell.addEventListener("click", () => GameController.playTurn(index));
            gameboardElement.appendChild(cell);
        });
    };

    const setResultMessage = (message) => {
        resultElement.textContent = message;
    };

    const showRestartButton = () => {
        restartButton.classList.remove("hidden");
    };

    const hideRestartButton = () => {
        restartButton.classList.add("hidden");
    };

    return { renderBoard, setResultMessage, showRestartButton, hideRestartButton };
})();

document.getElementById("start-btn").addEventListener("click", () => {
    const player1Name = document.getElementById("player1").value || "Player 1";
    const player2Name = document.getElementById("player2").value || "Player 2";
    GameController.initializeGame(player1Name, player2Name);
    DisplayController.hideRestartButton();
});

document.getElementById("restart-btn").addEventListener("click", () => {
    const player1Name = document.getElementById("player1").value || "Player 1";
    const player2Name = document.getElementById("player2").value || "Player 2";
    GameController.initializeGame(player1Name, player2Name);
    DisplayController.hideRestartButton();
});
