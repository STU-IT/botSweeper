console.log("Hej");

// function dump() {
//     for (var row in minesweeper.rows) {
//         for (var cell in row) {
//             console.log(cell.innerText)
//         }
//     }
// }

var gameBoard= [];
numBombs = bombs.value;

function grab() {
    for (var i = 0; i < minesweeper.rows.length; i++) {
        gameBoard[i] = []
        for (var j = 0; j < minesweeper.rows[i].cells.length; j++) {
            //console.log(i, j, minesweeper.rows[i].cells[j].innerText)
            gameBoard[i][j] = minesweeper.rows[i].cells[j].innerText;

            // test
            //minesweeper.rows[i].cells[j].dispatchEvent(new MouseEvent("contextmenu", { bubbles: true, button: 2}))
            minesweeper.rows[i].cells[j].click();
        }
    }

    numBombs = bombs.value;
}

function dump() {
    console.log("Bomber ", numBombs)
    console.log(gameBoard)
}

var ev3 = new MouseEvent("contextmenu", {
    bubbles: true,
    cancelable: false,
    view: window,
    button: 2,
    buttons: 0,
    clientX: 3,
    clientY: 2
});

minesweeper.rows[1].cells[1].dispatchEvent(ev3)