/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

let WIDTH = 7;
let HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[x][y])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[x][y])
 */

function makeBoard() {
  // TODO: set "board" to empty HEIGHT x WIDTH matrix array
  // TODO: Complete, tests written
  board = [];
  if (WIDTH<0 || HEIGHT<0){
    console.log("Invalid dimension provided resetting dimensions to 0");
    WIDTH = 0;
    HEIGHT = 0;
  }
  for (let x = 0; x < WIDTH; x++){
    board.push([]);
    for (let y = 0; y<HEIGHT; y++){
      board[x].push('E');
    }
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  
  // TODO: get "htmlBoard" variable from the item in HTML w/ID of "board"
  // TODO: Complete
  let htmlBoard = document.getElementById('board');
  
  // TODO: add comment for this code
  // TODO: Complete
  // This code blocks creates a top row assigns it an id of "column-top" and assigns a click handler to it
  // Then the code creates a series of cells with an id that corresponds to the column count (left to right)
  let top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);


  for (let x = 0; x < WIDTH; x++) {
    let headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // TODO: add comment for this code
  // TODO: Complete
  // This code creates the rest of the game board. The area that game pieces are placed in
  for (let y = 1; y <= HEIGHT; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${x}-${HEIGHT - y}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */
function findSpotForCol(x) {
  for (let y = 0; y<HEIGHT;y ++){ 
    if (board[x][y] === "E"){
      return y;
    }
  }
  console.log("No spot found to place a piece");
  return null;
  // TODO: write the real version of this, rather than always returning 0
  // TODO: Complete
}

/** placeInTable: update DOM to place piece into HTML table of board */
function placeInTable(x, y) {
  // TODO: make a div and insert into correct table cell
  // TODO: Complete
  let piece = document.createElement("div");
  piece.classList.add("piece")
  piece.classList.add(`Player${currPlayer}`)
  let target_cell = document.getElementById(`${x}-${y}`)
  console.log(`${x} - ${y}`);
  target_cell.append(piece);

}

/** endGame: announce game end */

function endGame(msg) {
  // TODO: pop up alert message
  // TODO: Complete
  alert(msg);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  let x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  let y = findSpotForCol(x);
  if (y === null) {
    console.log("End of game board reached");
    return;
  }

  // place piece in board and add to HTML table
  placeInTable(x, y);

  // TODO: add line to update in-memory board
  // TODO: Complete
  board[x][y] = currPlayer;

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  // TODO: check if all cells in board are filled; if so call, call endGame
  // TODO: Complete
  console.log(board.some((column)=>{column.some(cell => cell === "E")}));
  if ((board.some((column)=>{column.some(cell => cell === "E")}))){
    return endGame(`This game has resulted in a tie`);
  }

  // switch players
  // TODO: switch currPlayer 1 <-> 2
  // TODO: Complete
  currPlayer===1?currPlayer=2:currPlayer=1;
  }

/** checkForWin: check board cell-by-cell for "does a win start here?" */
function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // TODO: read and understand this code. Add comments to help you.
  // Given a location x,y this code block defines an array of coordinates in each corresponding direction. These arrays are then tested for a win condition using the _win(cell) function (designated private)
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      let horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      let vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      let diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      let diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
