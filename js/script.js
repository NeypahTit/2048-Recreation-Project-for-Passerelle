/* Major thanks to https://codepen.io/fabi_yo_/pen/zNrmwZ for JavaScript code help */

/** @todo
 * Make game lose state show up instantly, not after one more key press
 * Make sure game lose doesn't falsely flag itself
 * Add text indicating win/loss
*/
const debug = false;
let movementActive = true;
let infoWindowOpen = false;

/* Init */
window.onload = () => {
    if (debug) changeGameState("lose");
    buildGridOverlay();  // Generates grid-overlay
    tileCreator(2, false); // Creates 2 cells
    window.addEventListener("onkeydown", directions);
    initScores();
};

/* Generates the grid! */
function buildGridOverlay() {
    let size = 4; // 4x4 grid
    let table = document.createElement("div");

    table.className += "grid";
    table.id = "grid_base";
    table.dataset.value = 0;

    for (let i = 0; i < size; i++) { // rows
        let tr = document.createElement("div");
        
        table.appendChild(tr);
        tr.id = `row_${i+1}`;
        tr.className += "grid_row";

        for (let j = 0; j < size; j++) { // cells
            let td = document.createElement("div");

            td.id = `${i+1}${j+1}`; // sets id to be the "xy"
            td.className += "grid_cell";
            tr.appendChild(td);
        }
        
        // append the results, with repeated appending of the same element being updated instead
        document.body.appendChild(table);
    }
}

/* Creates the tile(s) */
function tileCreator(c, timeOut) {
    // repeat for each new tile
    for (let i = 0; i < c; i++) {
        let tileValue = 0;
        let twoOrFour = Math.floor((Math.random() * 10) + 1); // between 1 and 10
        let randomX, randomY = 0; // row id, cell id

        // search for free space
        for (j = 1; j < 2; j++) {
            let checkRandomX = Math.floor((Math.random() * 4) + 1); // row id
            let checkRandomY = Math.floor((Math.random() * 4) + 1); // cell id, redeclaring exact same Math.random() so that it has a different value from randomX
            let checkCell = document.getElementById(`${checkRandomX}${checkRandomY}`);

            // carry the values outside of the loop
            randomX = checkRandomX;
            randomY = checkRandomY;

            if (checkCell.innerHTML != "") {
                j = 0; // if non-empty cell is found, gives another 2 tries
            }
        }

        // should be 20% chance for a tile of number 4
        tileValue = (twoOrFour >= 9) ? 4 : 2;

        // DEBUG
        if (debug) {
            tileArrayValue = [2,4,8,16,32,64,128,256,512,1024,2048];
            tileValue = tileArrayValue[(Math.floor(Math.random() * 11))];
        }

        // use found random xy for the tile's position to create it
        let position = document.getElementById(`${randomX}${randomY}`);
        let tile = document.createElement("div");
        position.appendChild(tile);
        tile.innerHTML = `${tileValue}`; // either value of 2 or 4

        // tile setup
        colorSet(tileValue, tile);
        tile.data = `${tileValue}`;
        tile.id = `tile_${randomX}${randomY}`;
        position.className += " active";
        tile.dataset.value = `${tileValue}`;

        if (debug) console.info(`${timeOut}`);
        
        // if true, makes this className assignment wait for 10ms
        if (timeOut === false) {
            tile.className = "tile " + tileValue;
        } else {
            setTimeout(() => {
                tile.className = "tile " + tileValue;
            }, 10);
        }
    }
}

/* Tile movement */
document.onkeydown = directions;

function directions(e) {
    // if enabled
    if (movementActive) {
        // UP ARROW KEY //
        if (e.keyCode == "38") {
            let count = 2;

            for (let x = 2; x > 1; x--) {
                for (let y = 1; y < 5; y++) {
                    moveTilesMain(x, y, -1, 0);
                    if (debug) console.info(`${x}${y}`);
                }

                if (x == 2) {
                    x += count;
                    count++;
                }

                if (count > 4) break;
            }

            cellReset();
        }
        // DOWN ARROW KEY //
        else if (e.keyCode == "40") {
            let count = -2;

            for (let x = 3; x < 4; x++) {
                for (let y = 1; y < 5; y++) {
                    moveTilesMain(x, y, 1, 0);
                    if (debug) console.info(`${x}${y}`);
                }

                if (x == 3) {
                    x += count;
                    count--;
                }

                if (count < -4) break;
            }

            cellReset();
        }
        // LEFT ARROW KEY //
        else if (e.keyCode == "37") {
            let count = 2;

            for (let x = 2; x > 1; x--) {
                for (let y = 1; y < 5; y++) {
                    moveTilesMain(y, x, 0, -1);
                    if (debug) console.info(`${y}${x}`);
                }

                if (x == 2) {
                    x += count;
                    count++;
                }

                if (count > 4) break;
            }

            cellReset();
        }
        // RIGHT ARROW KEY //
        else if (e.keyCode == "39") {
            let count = -2;

            for (let x = 3; x < 4; x++) {
                for (let y = 1; y < 5; y++) {
                    moveTilesMain(y, x, 0, 1);
                    if (debug) console.info(`${y}${x}`);
                }

                if (x == 3) {
                    x += count;
                    count--;
                }

                if (count < -4) break;
            }

            cellReset();
        }
    }
}

function moveTilesMain(x, y, offsetX, offsetY) {
    let tile = document.getElementById(`tile_${x}${y}`); // current tile
    let checker = document.getElementById(`${x}${y}`); // current tile's cell
    let xAround = x + offsetX;
    let yAround = y + offsetY;

    // if the neighboring cell is within boundaries and the current tile's cell is active...
    if (xAround > 0 && xAround < 5 && yAround > 0 && yAround < 5 && checker.className == "grid_cell active") {
        // get the cell in front of us
        let around = document.getElementById(`${xAround}${yAround}`);

        // if the cell that's in front of us is active, we found a potential obstacle!
        if (around.className == "grid_cell active") {
            // get the mentioned cell's tile
            let aroundTile = document.getElementById(`tile_${xAround}${yAround}`);

            // if the value of the tile of the active cell in front of us is the same as our tile's value, we merge
            if (aroundTile.innerHTML == tile.innerHTML) {
                // add the values together
                let value = tile.dataset.value * 2;

                // the tile in front of us becomes the receiver of the current tile, so adjust accordingly
                aroundTile.dataset.value = `${value}`;
                aroundTile.className = "tile " + value;
                aroundTile.innerHTML = `${value}`;
                colorSet(value, aroundTile);

                // then, remove the current tile and make current cell inactive
                checker.removeChild(tile);
                checker.className = "grid_cell";

                // tell the game that the cell in front of us just merged
                around.className = "grid_cell active merged";

                // tell the grid that we moved
                document.getElementsByClassName("grid").id = "moved";

                // do stuff to update the score
                let grid = document.getElementById("grid_base");
                let scoreValue = parseInt(grid.dataset.value);
                let newScore = value + scoreValue;

                grid.dataset.value = newScore;
                
                setScores(newScore);
            }
        }
        // if not, we move around because it is an empty cell in front of us
        else if (around.className == "grid_cell") {
            // append the current tile to the cell in front, set that cell to be active
            around.appendChild(tile);
            around.className = "grid_cell active";

            // set the new correct tile id, make current cell inactive
            tile.id = `tile_${xAround}${yAround}`
            checker.className = "grid_cell";

            // tell the grid that we moved
            document.getElementsByClassName("grid").id = "moved";
        }
    }
}

/* Making sure cells are operational during gameplay + for resetting + lose condition checking */
function cellReset() {
    let count = 0;
    let baseGrid = document.getElementsByClassName("grid");

    if (debug) console.log(baseGrid.id);

    for (let x = 1; x < 5; x++) { // rows
        for (let y = 1; y < 5; y++) { // cells
            let resetter = document.getElementById(`${x}${y}`);

            // if the chosen cell has anything in it, increase the full cell counter
            if (resetter.innerHTML != "") {
                count++;
            }

            // if the chosen cell is empty, set its class to a basic grid cell
            if (resetter.innerHTML == "") {
                resetter.className = "grid_cell";
            }

            // if the chosen cell was merged, remove the merge class from it
            if (resetter.className == "grid_cell active merged") {
                resetter.className = "grid_cell active";
            }
        }
    }

    // if all cells are not empty, we lose
    if (count == 16) {
        changeGameState("lose");
    }
    // if you have moved the tiles, create a new tile with a 10ms delay
    else if (baseGrid.id == "moved") {
        tileCreator(1, true);
    }

    // reset the base grid's id
    baseGrid.id = "grid_base";
}

function initScores() {
    let grid = document.getElementById("grid_base");
    let value = grid.dataset.value;

    // set the scores based on the grid's dataset's value
    setScores(value);
}

function setScores(value) {
    let score = document.getElementById("value");
    let bestScore = document.getElementById("best_value");

    score.innerHTML = `${value}`;

    // check if we should update best score
    if (parseInt(bestScore.innerHTML) < value || bestScore.innerHTML == "") {
        let localValue = localStorage.getItem("LOCAL_BEST_SCORE");

        // check if our localStorage key:value pair is valid to use
        if (localValue !== null) {
            localStorage.setItem("LOCAL_BEST_SCORE", (parseInt(localValue) >= value) ? localValue : value);
            if (debug) console.log("a", `| localValue: ${localValue}`);
        } else {
            localStorage.setItem("LOCAL_BEST_SCORE", 0);
            if (debug) console.log("b", `| localValue: ${localValue}`);
        }

        bestScore.innerHTML = parseInt(localStorage.getItem("LOCAL_BEST_SCORE"));
    }
}

/* changes the game's state when winning/losing */
function changeGameState(state) {
    switch (state) {
        case "lose":
            document.getElementById("status").className = "lose";
            break;
        case "win":
            setMovement("win");
            document.getElementById("status").className = "won";
            break;
    }
}

/* sets ability to move tiles based on the source */
function setMovement(source) {
    switch (source) {
        case "info":
            // if 2048 tile is present still, ignore
            if (document.getElementById("status").className != "won") {
                movementActive = (infoWindowOpen) ? false : true;
            }
            break;
        case "reset":
            // failsafe just in case
            if (!infoWindowOpen) movementActive = true;
            break;
        case "win":
            movementActive = false;
            break;
    }
}

/* STYLE STUFF */
function colorSet(value, tile) {
    switch(value) {
        case 2:
            tile.style.background = "#fffcf3";
            tile.style.color = "black";
            break;
        case 4:
            tile.style.background = "#fff7ce";
            tile.style.color = "black";
            break;
        case 8:
            tile.style.background = "#ffbdac";
            tile.style.color = "black";
            break;
        case 16:
            tile.style.background = "#ff7d7d";
            tile.style.color = "black";
            break;
        case 32:
            tile.style.background = "#ff4a4a";
            tile.style.color = "white";
            break;
        case 64:
            tile.style.background = "#ff1a1a";
            tile.style.color = "white";
            break;
        case 128:
            tile.style.background = "#fffb95";
            tile.style.color = "black";
            tile.style.fontSize = "50px";
            break;
        case 256:
            tile.style.background = "#fff974";
            tile.style.color = "black";
            tile.style.fontSize = "50px";
            break;
        case 512:
            tile.style.background = "#fff74b";
            tile.style.color = "black";
            tile.style.fontSize = "50px";
            break;
        case 1024:
            tile.style.background = "#fff629";
            tile.style.color = "black";
            tile.style.fontSize = "40px";
            break;
        case 2048:
            tile.style.background = "#fff400";
            tile.style.color = "black";
            tile.style.fontSize = "40px";
            changeGameState("win");
            break;
    }                  
}

/* Shows the info thing after 10ms */
function info() {
    setTimeout(() => {
        document.getElementById("description").classList.toggle("show");
        infoWindowOpen = !infoWindowOpen;
        document.getElementsByClassName("repeat")[0].id = (infoWindowOpen) ? "" : "repeat";
        setMovement("info");
    }, 10); 
}

function reset() {
    let repeatBtn = document.getElementsByClassName("repeat")[0];

    // if the button is operational
    if (repeatBtn.id == "repeat") {
        for (let x = 1; x < 5; x++) { // rows
            for (let y = 1; y < 5; y++) { // cells
                let resetter = document.getElementById(`${x}${y}`);

                // removes any active cells, i.e. tiles with any number
                if (resetter.className == "grid_cell active") {
                    let tile = document.getElementById(`tile_${x}${y}`);
                    resetter.removeChild(tile);
                }
            }
        }

        document.getElementById("status").className = "";
        document.getElementById("grid_base").dataset.value = 0;
        setMovement("reset");

        initScores();
        cellReset();
        tileCreator(2, false);
    }
}