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
  board = [];
  if (WIDTH===0 || HEIGHT===0){
    console.log("Invalid dimension provided resetting dimensions to 1");
    WIDTH = 1;
    HEIGHT = 1;
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
  let htmlBoard = document.getElementById('board');
  htmlBoard.innerHTML = '';
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
let resetbutton = document.querySelector('#reset');

function reset(){
  WIDTH = 7;
  HEIGHT = 6;
  currPlayer = 1;
  board =[];
  makeBoard();
  makeHtmlBoard();
}
resetbutton.addEventListener('click',reset)


let assignComp1 = document.querySelector('#assignComp1');
let assignComp2 = document.querySelector('#assignComp2');

/** findSpotForCol: given column x, return top empty y (null if filled) */
function findSpotForCol(x,gameboard) {
  for (let y = 0; y<HEIGHT;y ++){
    if (gameboard[x][y] === 'E'){
      return y;
    }
  }
  debugger;
  console.log("No spot found to place a piece in the given column");
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */
function placeInTable(x, y,player) {
  let piece = document.createElement("div");
  piece.classList.add("piece")
  piece.classList.add(`Player${player}`)
  let target_cell = document.getElementById(`${x}-${y}`)
  //console.log(`${x} - ${y}`);
  target_cell.append(piece);

}

/** endGame: announce game end */

function endGame(msg) {
  alert(msg);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  let x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  let y = findSpotForCol(x,board);
  if (y === null) {
    console.log("End of game board reached");
    return;
  }

  // place piece in board and add to HTML table
  placeInTable(x, y,currPlayer);
  board[x][y] = currPlayer;

  // check for win
  if (checkForWin(currPlayer,board)) {
    console.log("We have a winner");
    //Added a slight delay before the alert shows up.
    setTimeout(()=>{endGame(`Player ${currPlayer} won!`)},250);
  }

  // check for tie
  if ((board.some((column)=>{column.some(cell => cell === "E")}))){
    return endGame(`This game has resulted in a tie`);
  }

  // switch players
  currPlayer===1?currPlayer=2:currPlayer=1;
  }

/** checkForWin: check board cell-by-cell for "does a win start here?" */
function checkForWin(player,gameboard) {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match 
    return cells.every(
      ([x, y]) => 
        y >= 0 && 
        y < HEIGHT && 
        x >= 0 && 
        x < WIDTH && 
        gameboard[x][y] === player
    );
  }

  //This code block defines an array of coordinates in each corresponding direction for each cell that's found to have a player piece in it. These arrays are then tested for a win condition using the _win(cell) function (designated private).
  for (let x = 0; x < WIDTH; x++) {
    for (let y = 0; y < HEIGHT; y++) {
      //only process a win analysis on the pieces just played by the current player. Wasteful to analyze conditions with the player that previously went.
      if (gameboard[x][y] === player){
        let vert = [[x, y], [x, y+1], [x, y+2], [x, y+3]];

        //Testing as long as there's room to check for patterns to the right
        if (x<WIDTH-3){
          let horiz = [[x, y], [x+1, y], [x+2, y], [x+3, y]];
          let diagDR = [[x, y], [x+1, y-1], [x+2, y-2], [x+3, y-3]];
          let diagUR = [[x, y], [x+1, y+1], [x+2, y+2], [x+3, y+3]];
          if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagUR)) {
            return true;
          }
        }
        //No space to check for patterns that travel to the right. Only test vertical patterns
        else{
          if (_win(vert)) {
            return true;
          }

        }

      }
    }
  }
}

function findNextLegalMoves(gameboard){
  let listofturns = [];
  for (let x = 0; x<WIDTH; x++){
    let y = findSpotForCol(x,gameboard);
    if (y !== null){
      listofturns.push([x,y]);
    }
  }
  return listofturns;
}

// function buildOutcomesObject(player, gameboard,depthconstraint = 3){
//   let outcomes = [];
//   let movequeue = findNextLegalMoves(gameboard);
//   let turn = 1;
//   movequeue.forEach((move)=>{move.push(gameboard);move.push(turn);});
//   while (movequeue.length > 0){
//     if (movequeue[0][3] > depthconstraint){
//       movequeue.shift();
//     }
//     else{
//       let movedetails = movequeue.shift();
//       let move = [movedetails[0],movedetails[1]];

//        let newgameboard = movedetails[2].map((arr)=>arr.slice());
//       let stateobj = {
//         x:move[0],
//         y:move[1],
//         win:false,
//         next:[],
//         turn:movedetails[3],
//         board:newgameboard
//       }
//       newgameboard[move[0]][move[1]] = player;
//       if (checkForWin(player,newgameboard)){
//         newgameboard[move[0]][move[1]] = 'W';
//         movedetails[2][move[0]][move[1]] = 'W';
//         stateobj.win = true;
//       }
//       else{
//         let newmoves = findNextLegalMoves(newgameboard);
//         if (stateobj.turn < depthconstraint){
//           newmoves.forEach((move)=>{move.push(newgameboard);move.push(stateobj.turn+1);})
//           movequeue.push(...newmoves);
//         }
//       }
//       outcomes.push(stateobj);
//       if (outcomes.length > 200){
//         debugger;
//       }
//       if (outcomes.length > 250){
//         return outcomes;
//       }
//     }

//   }
//   return outcomes;
// }


function buildOutcomesObjectrecursive(player,gameboard,depthconstraint = 3){
  let outcomes = [];
  //let nextLegalMoves = findNextLegalMoves(gameboard);
  for (let move of findNextLegalMoves(gameboard)){
    
    let stateobj = {
      x:move[0],
      y:move[1],
      win:false,
      next:undefined
    }
    //need a deep copy of the gameboard
    let newgameboard = gameboard.map((arr)=> arr.slice());
    newgameboard[move[0]][move[1]] = player;
    if (checkForWin(player,newgameboard) || depthconstraint === 0){
      stateobj.win = true;
      newgameboard[move[0]][move[1]] = 'W';
      // gameboard[move[0]][move[1]] = 'W';
    }
    else {
      stateobj.next = buildOutcomesObjectrecursive(player,newgameboard,depthconstraint - 1);
    }
    
    outcomes.push(stateobj);
    
  }
  return outcomes;
}


//build an array with number of wins possible. Each index (1 index) is a the cost function of those wins
function reviewOutcomesObject(outcomes){
  function createFutureWinsTree(outcomes,previousWins){
    let winsInCurrent = outcomes.reduce((sum,outcome)=>{return sum + outcome.win;},0);
    let newWins = winsInCurrent - previousWins;
    if (winsInCurrent === undefined){debugger;}
    if (outcomes !== undefined){
      let arrOfFutureWins = outcomes.map((outcome)=>{
        if (outcome.win === true){
          
        }
        outcome.win?"FWin":createFutureWinsTree(outcome.next,winsInCurrent)
      });
      //debugger;
      return [newWins,arrOfFutureWins];
    }
    else {return [newWins];}
  } 
  
  let topLayerWins = outcomes.reduce((sum,outcome)=>sum+outcome.win,0);
  let summary = outcomes.reduce((sum,outcome)=>{
    let futureWins;
    if (outcome.win === false){
      futureWins = createFutureWinsTree(outcome.next,topLayerWins);
    }
    else{futureWins = "W";}
    sum.push([outcome.x,outcome.y,outcome.win,futureWins]);
    return sum;
  },[])
  return summary;
}

makeBoard();
makeHtmlBoard();
