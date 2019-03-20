console.log("Hej");

var gameBoard= [];
numBombs = bombs.value;

function grabGameInit() {
    numBombs = bombs.value;
    grabBoard();
}

function grabBoard() {
    for (var i = 0; i < minesweeper.rows.length; i++) {
        gameBoard[i] = []
        for (var j = 0; j < minesweeper.rows[i].cells.length; j++) {
            gameBoard[i][j] = minesweeper.rows[i].cells[j].innerText;
        }
    }
}

function dump() {
    console.log("Bomber ", numBombs)
    console.log(gameBoard)
}

// var ev3 = new MouseEvent("contextmenu", {
//     bubbles: true,
//     cancelable: false,
//     view: window,
//     button: 2,
//     buttons: 0,
//     clientX: 3,
//     clientY: 2
// });

// minesweeper.rows[1].cells[1].dispatchEvent(ev3)

var stepOn = function(x, y) {
    minesweeper.rows[x].cells[y].dispatchEvent(new MouseEvent("click", { bubbles: true}))
}

var markOn = function(x, y) {
    minesweeper.rows[x].cells[y].dispatchEvent(new MouseEvent("contextmenu", { bubbles: true}))
}

var initSolver = function()
{
    grabGameInit()
}

var solveStep = function() {

}



var createRiskMap = function(board) {
    var riskMap = [];
    
}