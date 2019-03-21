console.log("Hej");

var gameBoard= [];
numBombs = bombs.value;

// fordi html-elementet table har rækker som yderste element og celler som inderste,
// (og det er faktisk det letteste når man skal skrive det ud i console,)
// så kommer y koordinaten før x koordinaten. Det er altså omvendt!
function grabBoard() {
    for (var y = 0; y < minesweeper.rows.length; y++) {
        gameBoard[y] = []
        for (var x = 0; x < minesweeper.rows[y].cells.length; x++) {
            gameBoard[y][x] = minesweeper.rows[y].cells[x].innerText;
            // her    ^  ^         og her      ^        ^
        }
    }
}

function grabGameInit() {
    numBombs = bombs.value;
    grabBoard();
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
    console.log("init")
    grabGameInit()
    dump()
}

var solveStep = function() {
    console.log('step')
    grabBoard();
    dump();
}



var getNeighbours = function(x,y) {
    var neighbours = [];
    // add neighbours counterclockwise, from top
    if (x > 0)
        neighbours.push(gameBoard[y][x-1]);     // N
    if (x > 0 && y > 0)
        neighbours.push(gameBoard[y-1][x-1]);   // NE
    
    if (y > 0)
        neighbours.push(gameBoard[y-1][x]);     // E
    if (x < gameBoard[0].length-1 && y > 0)
        neighbours.push(gameBoard[y-1][x+1]);   // SE
    
    if (x < gameBoard[0].length-1)
        neighbours.push(gameBoard[y][x+1]);     // S
    if (x < gameBoard[0].length-1 && y < gameBoard.length-1)
        neighbours.push(gameBoard[y+1][x+1]);   // SW

    if (y < gameBoard[0].length-1)
        neighbours.push(gameBoard[y+1][x]);     // W
    if (x > 0 && y < gameBoard.length-1)
        neighbours.push(gameBoard[y+1][x-1]);   // NW

    return neighbours;
};


var createRiskMap = function(board) {
    var riskMap = [];
    
};

var tileClicked = function(event) {
    console.log("clicked: ", event)
    solveStep()
} ;

// når siden ER loaded
window.addEventListener('load', function(event){

    initSolver()

    document.querySelector("#new-game").addEventListener('click', function(event){
        initSolver()
        // inject click on gameBoard tiles
        for (let tile of document.querySelectorAll('#minesweeper td')) {
            tile.addEventListener("click", tileClicked)
        }
    }, {capture: false})
    
    for (let tile of document.querySelectorAll('#minesweeper td')) {
        tile.addEventListener("click", tileClicked, {capture: false})
    }
    
})

