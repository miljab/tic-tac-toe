function createPlayer(name, mark, score) {
    const getScore = () => parseInt(score.textContent);
    const scoreUp = () => score.textContent = parseInt(score.textContent) + 1;
    const resetScore = () => score.textContent = "0";
    const editName = (newName) => name.textContent = newName; 
    return {name, mark, getScore, scoreUp, resetScore, editName};
}

const gameController = (function () {
    let roundCounter = 0;
    const getRound = () => roundCounter;
    const addRound = () => roundCounter++;
    const resetRoundCounter = () => roundCounter = 0;
    
    let player1 = createPlayer(document.querySelector('.player1-name'), "x", document.querySelector(".player1-score"));
    let player2 = createPlayer(document.querySelector('.player2-name'), "o", document.querySelector(".player2-score"));

    let moves = 0;
    const resetMoves = () => moves = 0;

    const whoFirst = () => {
        if (getRound() % 2 == 0) {
            player2.name.classList.remove('current-player');
            player1.name.classList.add('current-player');
            return player1;
        } else {
            player1.name.classList.remove('current-player');
            player2.name.classList.add('current-player');
            return player2;
        }
    }
    let playerOnTurn = whoFirst();

    const togglePlayer = () => {
        if (playerOnTurn == player1) {
            playerOnTurn = player2;
            player1.name.classList.remove('current-player');
            player2.name.classList.add('current-player');
        } else {
            playerOnTurn = player1;
            player2.name.classList.remove('current-player');
            player1.name.classList.add('current-player');
        }
    };

    const checkWin = (currentPlayer) => {
        let mark = currentPlayer.mark;

        for (let i = 0; i < 3; i++) {
            if (board.squares[i].textContent == mark && board.squares[i + 3].textContent == mark && board.squares[i + 6].textContent == mark) {
                return true;
            }
        }

        for (let i = 0; i < 9; i += 3) {
            if (board.squares[i].textContent == mark && board.squares[i + 1].textContent == mark && board.squares[i + 2].textContent == mark) {
                return true;
            }
        }

        if ((board.squares[0].textContent == mark && board.squares[4].textContent == mark && board.squares[8].textContent == mark) ||
        (board.squares[2].textContent == mark && board.squares[4].textContent == mark && board.squares[6].textContent == mark)) {
            return true;
        }

        return false;
    };

    const roundWin = (winner) => {
        winner.scoreUp();
        addRound();
        playerOnTurn = whoFirst();
        board.resetBoard();
        modalController.winnerMessage(winner.name.textContent);
    }

    const roundDraw = () => {
        addRound();
        playerOnTurn = whoFirst();
        board.resetBoard();
        modalController.drawMessage();
    };

    const placeMark = (e) => {
        let index = parseInt(e.target.dataset.index);
        if (board.squares[index].textContent == "") {
            board.squares[index].textContent = playerOnTurn.mark;
            e.target.textContent = playerOnTurn.mark;
            moves++;
            if (checkWin(playerOnTurn)) roundWin(playerOnTurn);
            else if (moves == 9) roundDraw();
            else togglePlayer();
        }
    };

    const resetGame = () => {
        player1.resetScore();
        player2.resetScore();
        resetRoundCounter();
        playerOnTurn = whoFirst();
        board.resetBoard();
    };

    return {placeMark, resetGame, resetMoves, player1, player2};
})();

const board = (function () {
    let squares = [];
    for (let i = 0; i < 9; i++) {
        let square = document.querySelector(['[data-index="'+ i.toString() + '"]']);
        squares.push(square);
        square.addEventListener("click", gameController.placeMark);
    }

    const resetBoard = () => {
        for (let j = 0; j < 9; j++) {
            squares[j].textContent = "";
        }

        gameController.resetMoves();
    };

    const resetButton = document.querySelector(".reset-button");
    resetButton.addEventListener("click", gameController.resetGame);

    return {squares, resetBoard};
})();

const modalController = (function () {
    const winnerDialog = document.querySelector(".winner-dialog");
    document.querySelector(".close-dialog").addEventListener("click", () => winnerDialog.close());

    const winnerP = document.querySelector(".winner-message");
    
    const winnerMessage = (winnerName) => {
        winnerP.textContent = winnerName + " won!";
        winnerDialog.showModal();
    };

    const drawMessage = () => {
        winnerP.textContent = "Draw!";
        winnerDialog.showModal();
    };

    const editNameDialog = document.querySelector(".edit-name-dialog");
    const form = document.querySelector(".edit-name-form");
    document.querySelector('.cancel-button').addEventListener('click', () => {
        form.reset();
        editNameDialog.close();
    });

    let playerToChange;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        playerToChange.editName(document.querySelector("#player_name").value);
        form.reset();
        editNameDialog.close();
    });

    const editNameForm = (player) => {
        playerToChange = player;
        editNameDialog.showModal();
    };

    let editPlayer1Name = document.querySelector('[data-edit-player="1"]');
    editPlayer1Name.addEventListener("click", () => editNameForm(gameController.player1));
    let editPlayer2Name = document.querySelector('[data-edit-player="2"]');
    editPlayer2Name.addEventListener("click", () => editNameForm(gameController.player2));

    return {winnerMessage, drawMessage};
})();