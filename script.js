const Player = (name, symbol) => {
    return {name, symbol}
}

const gameBoard = (() => { 
    const board = []; 
    let gameRuns = true;
    let winner = null;
    for (let i=0; i<3; i++) {
        let row = [];
        for (let i=0; i<3; i++) {
            row.push(null);
        }
        board.push(row);
    }

    const checkMove = (x, y) => {
        if (board[x][y] !== null) {
            return false;
        }
        if (!gameRuns) {
            return false;
        }
        return true;
    }

    const checkBoard = () => {
        if (board.length > 3) {
            return false;
        } 
        for (let i=0; i < 3; i++) {
            if (board[i].length > 3) {
                return false;
            }
        }
        return true;
    }

    const checkWinner = (player) => {
        let symbol = player.symbol;
        for (let i=0; i<3; i++) {
            if (board[i][0] === board[i][1] && board[i][1] === board[i][2] && board[i][2] === symbol) {
                gameRuns = false;
                winner = player;
                return;
            }
        }
        for (let i=0; i<3; i++) {
            if (board[0][i]=== board[1][i] && board[1][i] === board[2][i] && board[2][i] === symbol) {
                gameRuns = false;
                winner = player;
                return;
            }
        }
        if (board[0][0]=== board[1][1] && board[1][1] === board[2][2] && board[2][2] === symbol) {
            gameRuns = false;
            winner = player;
            return;
        }
        if (board[0][2]=== board[1][1] && board[1][1] === board[2][0] &&  board[2][0] ===  symbol) {
            gameRuns = false;
            winner = player;
            return;
        }
    }

    const checkTie = () => {
        let tie = true;
        board.forEach((row) => {
            row.forEach((symbol) => {
                if (symbol === null) {
                    tie = false;
                }
            })
        })
        if (tie) {
            gameRuns = false; 
            winner = 'tie';
        }
    }

    const move = (x, y, player) => {
        let symbol = player.symbol;
        if (!checkBoard()) {
            return Error('Bad board');
        }
        if (checkMove(x, y)) {
            board[x][y] = symbol;
            checkWinner(player);
            checkTie();
            return true;
        }
        return false;
    }

    const getWinner = () => {
        return winner;
    }

    return {board, move, getWinner}
})();


const Render = (() => {
    let player1, player2;
    const playerForm = document.querySelector('#players');
    const overlay = document.querySelector('#overlay');
    const newGameButton = document.querySelector('#new-game-button');
    const board = document.querySelector('#board');
    
    const renderBoard = () => {
        board.innerHTML = "";
        gameBoard.board.forEach((row, rowIndex) => {
            row.forEach((symbol, columnIndex) => {
                const square = document.createElement('div');
                square.classList.add('square');
                let position = rowIndex + ' ' + columnIndex
                square.setAttribute('data-index', position);
                square.textContent = symbol;
                board.appendChild(square);

                const makeMove = () => {
                    const moveMade = gameBoard.move(rowIndex, columnIndex, currentPlayer); 
                    if (moveMade) {
                        renderBoard();
                        if (currentPlayer===player1) {
                            currentPlayer=player2;
                        }
                        else {
                            currentPlayer=player1;
                        }
                    }
                }

                square.addEventListener('click', makeMove)
            });
        });
        board.classList.add('board');
        const winnerMessege = document.querySelector('#moves');

        const winner = gameBoard.getWinner();
        if (winner !== null) {
            if (winner === 'tie') {
                winnerMessege.textContent = 'It\'s a tie';
            }
            else {
                winnerMessege.textContent = 'The winner is ' + winner.name;
            }
            const resetButton = document.createElement('button');
            resetButton.classList.add('resetButton');
            resetButton.textContent = 'Reset Game';
            winnerMessege.appendChild(resetButton);
            resetButton.addEventListener('click', resetGame);
        }
    }

    const startNewGame = () => {
        const namePlayer1 = document.querySelector('#player1').value;
        const namePlayer2 = document.querySelector('#player2').value;
        player1 = Player(namePlayer1, 'x');
        player2 = Player(namePlayer2, 'o');
        currentPlayer = player1;
        closeForm();
        renderBoard();
    }

    const closeForm = () => {
        playerForm.classList.add('disactive');
        overlay.classList.add('disactive');
        cleanForm()
    }

    function cleanForm() {
        document.querySelector('input[name="player1"]').value = '';
        document.querySelector('input[name="player2"]').value = '';
    }

    const resetGame = () => {
        location.reload();
    }
    
    newGameButton.addEventListener('click', startNewGame);
})();