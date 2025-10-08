/* Major thanks to https://codepen.io/fabi_yo_/pen/zNrmwZ for JavaScript code help */

/** @todo
 * UNDERSTAND MOVEMENT!!!
   * directions() I think I get
   * Understand moveTilesMain()
 * Make game lose state show up instantly, not after one more key press
 * Make sure game lose doesn't falsely flag itself
 * Stop any key listening after a tile with number of 2048 is reached
 * Possibly: separate button to restart the game after losing
 * Separate best score from score, and make it a persistent value
 * Add comments
*/
const debug = false;

/* Init */
window.onload = () => {
    if (debug) document.getElementById("status").className = "lose";
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
    // RIGHT ARROW KEY //
    else if (e.keyCode == "39") {
        let count = -2;

        for (let x = 3; x < 4; x++) {
            for (let y = 1; y < 5; y++) {
                moveTilesMain(y, x, 0, 1);
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
}

function moveTilesMain(x, y, offsetX, offsetY) {
    let tile = document.getElementById(`tile_${x}${y}`); // current tile
    let checker = document.getElementById(`${x}${y}`); // current tile
    let xAround = x + offsetX;
    let yAround = y + offsetY;

    // if xAround and yAround is between 1-4, and it is an active tile, either we have an obstacle in front of us, or we can merge
    if (xAround > 0 && xAround < 5 && yAround > 0 && yAround < 5 && checker.className == "grid_cell active") {
        let around = document.getElementById(`${xAround}${yAround}`);

        if (around.className == "grid_cell active") {
            // catching
            let aroundTile = document.getElementById(`tile_${xAround}${yAround}`);

            if (aroundTile.innerHTML == tile.innerHTML) {
                // same
                let value = tile.dataset.value * 2;

                aroundTile.dataset.value = `${value}`;
                aroundTile.className = "tile " + value;
                aroundTile.innerHTML = `${value}`;
                colorSet(value, aroundTile);
                checker.removeChild(tile);
                checker.className = "grid_cell";
                around.className = "grid_cell active merged";
                document.getElementsByClassName("grid").id = "moved";
                document.getElementsByClassName("grid").className = "grid " + value;

                let grid = document.getElementById("grid_base");
                let scoreValue = parseInt(grid.dataset.value);
                let newScore = value + scoreValue;

                grid.dataset.value = newScore;
                
                let score = document.getElementById("value");
                let bestScore = document.getElementById("best_value");

                score.innerHTML = `${newScore}`;
                bestScore.innerHTML = `${newScore}`;
            }
        }
        // if not, we move around
        else if (around.className == "grid_cell") {
            // not catching
            around.appendChild(tile);
            around.className = "grid_cell active";
            tile.id = `tile_${xAround}${yAround}`
            checker.className = "grid_cell";
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

    // if all cells are not empty
    if (count == 16) {
        document.getElementById("status").className = "lose";
    }
    // if you have moved the tiles, create a new tile and then assign its value in its className after 10ms delay
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
    document.getElementById("value").innerHTML = `${value}`;
    document.getElementById("best_value").innerHTML = `${value}`;
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
            document.getElementById("status").className = "won";
            break;
    }                  
}

function reset() {
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

    initScores();
    cellReset();
    tileCreator(2, false);
}