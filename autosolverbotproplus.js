﻿/*jshint esversion: 6 */

console.log("Hej");

var gameBoard= [];
numBombs = bombs.value;

// fordi html-elementet table har rækker som yderste element og celler som inderste,
// (og det er faktisk det letteste når man skal skrive det ud i console,)
// så kommer y koordinaten før x koordinaten. Det er altså omvendt!
function grabBoard() {
    for (var y = 0; y < minesweeper.rows.length; y++) {
        gameBoard[y] = [];
        for (var x = 0; x < minesweeper.rows[y].cells.length; x++) {
            gameBoard[y][x] = {capture: minesweeper.rows[y].cells[x].innerText, x: x, y: y};
            // her    ^  ^         og her                ^        ^
        }
    }
}

function grabGameInit() {
    numBombs = bombs.value;
    grabBoard();
}

function dump() {
    console.log("Bomber ", numBombs);
    console.log(gameBoard);
    
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
    minesweeper.rows[y].cells[x].dispatchEvent(new MouseEvent("click", { bubbles: true}));
};

var markOn = function(x, y) {
    while (minesweeper.rows[y].cells[x].innerText != "!") {
        minesweeper.rows[y].cells[x].dispatchEvent(new MouseEvent("contextmenu", { bubbles: true}));
    }
};

var initSolver = function()
{
    console.log("init");
    grabGameInit();
    dump();
};

var createMarkedBombsMap = function(board) {
    return board.map(r => r.filter(tile => tile.risk == 1).map(tile2 => {
        markOn(tile2.x, tile2.y); //markOn(tile2.x, tile2.y);
        tile2.capture = "!";
        return tile2;
    }));
};

var createReducedMap = function(board) {
    var newMap = createMarkedBombsMap(board);
    newMap = createRevealdMap(newMap);

    board.map(r => r.filter(tile => tile.capture == "!").map(tile => {
        getNeighbours(tile.x, tile.y)
            .filter(n => n.revealed)
            .map(tile => tile.nearBombs--);
        return tile;
    }));

    board.map(r => r.filter(rev => rev.revealed).map(tile => {
            getNeighbours(tile.x, tile.y)
                .filter(n => !n.revealed).filter(nb => nb.capture != "!").map(unrev => 
                    unrev.risk = (unrev.risk == undefined) ? 
                        tile.nearBombs / tile.nUnrevealds :
                    Math.min(unrev.risk, tile.nearBombs / tile.nUnrevealds) 
                );
            return tile;
        }
    ));
    return newMap.map(r => r.map(tile => tile.capture));
};

var cretateGeneralRiskMap = function(board) {
    var foundBombs = board.reduce(
        (acc, curr) => acc + curr.filter(tile => tile.capture == "!").length, 0);
    var noRevealedNeihbour = board.reduce(
        (acc, curr) => acc + curr.filter(tile => !tile.revealed).filter(tile => tile.risk == undefined).length, 0);
    var avgRisk = (numBombs - foundBombs) / noRevealedNeihbour;
    return board.map(r => r.filter(tile => !tile.revealed).filter(tile => tile.risk == undefined)
        .map(avgTile => avgTile.risk = avgRisk)
    );
};

var safeClicks = function(board) {
    return board.flat().filter(tile => tile.risk == 0)
}

var bestClick = function(board) {
    var riskyTiles = riskyClicks(board);
    //console.log("riskyTiles: ", riskyTiles);
    var bestTiles = riskyTiles.filter(tile => tile.risk == riskyTiles[0].risk);
    //console.log(bestTiles);
    var r = Math.floor(Math.random() * bestTiles.length);
    var bestTile = bestTiles[r];
    return bestTile;
}

var riskyClicks = function(board) {
    return board.flat().filter(tile => !tile.revealed).sort((t1, t2) => {
        if (t1.risk < t2.risk) {
            return -1;
        }
        else if(t1.risk > t2.risk) {
            return 1;
        } 
        else 
        {
            return 0;
        }
    });
};

var solveStep = function() {
    //console.log('step');
    grabBoard();
    //dump();
    createRevealdMap(gameBoard);
    createRiskMap(gameBoard);
    // TODO reduce
    createReducedMap(gameBoard);
    //grabBoard();
    // TODO recreate riskmap?
    // No
    // TODO cretateGeneralRiskMap for tiles not touching any revealed tiles
    cretateGeneralRiskMap(gameBoard);

    //safeClicks(gameBoard);

    //riskyClicks(gameBoard)

    var bestTile = bestClick(gameBoard);
    console.log("Bedste click", bestTile.x, bestTile.y, bestTile.risk)
    stepOn(bestTile.x, bestTile.y);

};



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
    board.map(r => r.map(t => t.risk = undefined));
    var rMap = board.map(
        r => r.map(
            tile => {
                if (tile.revealed) {
                    tile.nearBombs = Number(tile.capture);
                    tile.neighbours = getNeighbours(tile.x, tile.y);
                    tile.unrevealds = tile.neighbours.filter(neighbour => !neighbour.revealed);
                    tile.nUnrevealds = tile.unrevealds.length;
                    tile.unrevealds.map(unrev => 
                        unrev.risk = (unrev.risk == undefined) ? 
                            tile.nearBombs / tile.nUnrevealds :
                            Math.max(unrev.risk, tile.nearBombs / tile.nUnrevealds) 
                            
                    );
                }
                return tile;
            }
        )
    );
    return rMap.map(r => r.map(tile => tile.risk));
};

var createRevealdMap = function(board) {
    var rMap = board.map(
        r => r.map(
            tile => {
                tile.revealed = !( tile.capture.charCodeAt(0) == 160 || 
                    tile.capture == "?" || 
                    tile.capture == "!"
                );
                return tile .revealed;
            }
        )
    );
    return rMap;
};

var tileClicked = function(event) {
    //console.log("clicked: ", event);
    // vi skal have en forsinkelse for at spillets egne kode kan nå at behandle mussekliket
    var timerID = window.setTimeout(solveStep, 800);
    //solveStep()
} ;

// når siden ER loaded
window.addEventListener('load', function(event){

    initSolver();

    document.querySelector("#new-game").addEventListener('click', function(event){
        initSolver();
        // inject click on gameBoard tiles
        for (let tile of document.querySelectorAll('#minesweeper td')) {
            tile.addEventListener("click", tileClicked);
        }
    }, {capture: false});
    
    for (let tile of document.querySelectorAll('#minesweeper td')) {
        tile.addEventListener("click", tileClicked, {capture: false});
    }
    
});

