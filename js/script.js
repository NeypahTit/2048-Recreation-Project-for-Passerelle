/* Major thanks to https://codepen.io/fabi_yo_/pen/zNrmwZ for JavaScript code help */
/* Init */
window.onload = function() {
    buildGridOverlay();  // Generates grid-overlay
    tileCreator(2, false); // Creates 2 cells
    // directions(); 
    // score(0);
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

        // used for resetting the game: if true, makes this className assignment wait until everything else has been reset first
        console.info(`${timeOut}`);
        if (timeOut == false) {
            tile.className = "tile " + tileValue;
        } else {
            setTimeout(() => {
                tile.className = "tile " + tileValue;
            }, 10);
        }
    }
}

/* STYLE STUFF */
function colorSet(value, tile) {
    switch(value) {
        case 2:
            tile.style.background = '#fffcf3';
            tile.style.color = 'black';
            break;
        case 4:
            tile.style.background = '#fff7ce';
            tile.style.color = 'black';
            break;
        case 8:
            tile.style.background = '#ffbdac';
            tile.style.color = 'black';
            break;
        case 16:
            tile.style.background = '#ff7d7d';
            tile.style.color = 'black';
            break;
        case 32:
            tile.style.background = '#ff4a4a';
            tile.style.color = 'white';
            break;
        case 64:
            tile.style.background = '#ff1a1a';
            tile.style.color = 'white';
            break;
        case 128:
            tile.style.background = '#fffb95';
            tile.style.color = 'black';
            tile.style.fontSize = '50px';
            break;
        case 256:
            tile.style.background = '#fff974';
            tile.style.color = 'black';
            tile.style.fontSize = '50px';
            break;
        case 512:
            tile.style.background = '#fff74b';
            tile.style.color = 'black';
            tile.style.fontSize = '50px';
            break;
        case 1024:
            tile.style.background = '#fff629';
            tile.style.color = 'black';
            tile.style.fontSize = '40px';
            break;
        case 2048:
            tile.style.background = '#fff400';
            tile.style.color = 'black';
            tile.style.fontSize = '40px';
            document.getElementById('status').className = 'won';
            break;
    }                  
}