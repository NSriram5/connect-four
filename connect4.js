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
let computerPlayer = 0;

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
let playerAssign = document.querySelectorAll('.assign');
let assignNotify = document.querySelector(`#playerAssignment`);

function reset(){
  WIDTH = 7;
  HEIGHT = 6;
  currPlayer = 1;
  board =[];
  makeBoard();
  makeHtmlBoard();
}
resetbutton.addEventListener('click',reset);


function assignComp(evt){
  if (evt.target.id === "assignComp1"){
    computerPlayer = 1;
    assignNotify.innerHTML = `<p>The Computer Player is Red<p>`
  }
  else if (evt.target.id === "assignComp2"){
    computerPlayer = 2;
    assignNotify.innerHTML = `<p>The Computer Player is Blue<p>`
  }
  else if (evt.target.id === "assignHuman"){
    computerPlayer = 0;
    assignNotify.innerHTML = `<p>Both players are human<p>`

  }
  else {computerPlayer = 0;}
  if (currPlayer === computerPlayer){computerPlays();turnResolution();}
  console.log(`Computer assigned to ${computerPlayer}`);
}
for (button of playerAssign){button.addEventListener('click',assignComp);}

/** findSpotForCol: given column x, return top empty y (null if filled) */
function findSpotForCol(x,gameboard) {
  for (let y = 0; y<HEIGHT;y ++){
    if (gameboard[x][y] === 'E'){
      return y;
    }
  }
  //debugger;
  //console.log("No spot found to place a piece in the given column");
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */
function placeInTable(x, y,player) {
  let piece = document.createElement("div");
  piece.classList.add("piece")
  piece.classList.add(`Player${player}`)
  let target_cell = document.getElementById(`${x}-${y}`)
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

  turnResolution();

  //if current player is a computer player, computer analyzes the board for both players and decides a defensive play if necessary otherwise picks an offensive player
  if (computerPlayer === currPlayer){
    computerPlays();
    turnResolution();
  }
}

function computerPlays(){
  function findRandomIndexOfHighestNumber(arr){
    let highestnum = Math.max(...arr);
    let locationsOfHighest = arr.reduce((lookup,num,index)=>{
      if (num===highestnum){lookup.push(index);return lookup;}
      else{return lookup;}
    },[]);
    console.log(locationsOfHighest);
    return locationsOfHighest[Math.floor(locationsOfHighest.length * Math.random())];
  }

  console.log("Computer's turn")
  let otherPlayer;
  currPlayer===1?otherPlayer=2:otherPlayer=1;
  let defensiveMoves = buildOutcomesObjectrecursive(otherPlayer,board,4)
  let offsensiveMoves = buildOutcomesObjectrecursive(currPlayer,board,4)
  let defenseAnalysis = reviewOutcomesTree(defensiveMoves);
  let offenseAnalysis = reviewOutcomesTree(offsensiveMoves);
  console.log("Defensive Analysis");
  console.log(defenseAnalysis);
  console.log("Offensive Analysis");
  console.log(offenseAnalysis);
  let myMove = findNextLegalMoves(board)[0];

  //pick the move with a good win/cost ratio
  let moveIndex = findRandomIndexOfHighestNumber(offenseAnalysis);
  myMove = [offsensiveMoves[moveIndex].x,offsensiveMoves[moveIndex].y];
  console.log(`Longterm strategy is to play at ${myMove}`)
  //third highest priority is to stop an opponent future win
  for (let i = 0;i<defensiveMoves.length;i++){
    if (defenseAnalysis[i]>1){
      myMove = [defensiveMoves[i].x,defensiveMoves[i].y];
      console.log(`Defensive strategy is to play at ${myMove}`)
    }
  }

  //second highest priority is to stop an opponent win
  for (let i = 0;i<defensiveMoves.length;i++){
    if (defenseAnalysis[i]===100){
      myMove = [defensiveMoves[i].x,defensiveMoves[i].y];
      console.log(`Avoid loss strategy is to play at ${myMove}`)
    }
  }
  //highest priority is to win
  for (let i = 0;i<offsensiveMoves.length;i++){
    if (offenseAnalysis[i]===100){
      myMove = [offsensiveMoves[i].x,offsensiveMoves[i].y];
      console.log(`Take win is to play at ${myMove}`)
    }
  }
  console.log(`About to place piece at ${myMove}`)
  placeInTable(myMove[0],myMove[1],currPlayer);
  board[myMove[0]][myMove[1]] = currPlayer;
}

function turnResolution(){
  // check for win
  if (checkForWin(currPlayer,board)) {
    console.log("We have a winner");
    //Need to create the banner now, otherwise the currPlayer resolves to the wrong one (with the timeout delay.)
    let winBanner = `Player ${currPlayer} won!`;
    //Added a slight delay before the alert shows up.
    setTimeout(()=>{endGame(winBanner)},250);
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

function buildOutcomesObjectrecursive(player,gameboard,depthconstraint = 3){
  let outcomes = [];
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
    if (checkForWin(player,newgameboard)){
      stateobj.win = true;
      newgameboard[move[0]][move[1]] = 'W';
    }
    else if (depthconstraint !== 0) {
      stateobj.next = buildOutcomesObjectrecursive(player,newgameboard,depthconstraint - 1);
    }
    
    outcomes.push(stateobj);
    
  }
  return outcomes;
}

function reviewOutcomesTree(outcomes){
  function recursiveWinCostRatioGenerator(outcomes,cost){
    let payoff = outcomes.reduce((wins,outcome)=>wins+outcome.win,0)
    let ratio = payoff/cost;
    if (ratio > 1){return ratio;}
    else if (outcomes.every((outcome)=>outcome.next===undefined)){
      return ratio;
    }
    else{
      let futureTotal = outcomes.reduce((benefit,outcome)=>{
        if (outcome.win !== true){
          return benefit + recursiveWinCostRatioGenerator(outcome.next,cost+1);
        }
        else {return benefit;}
      },0);
      let b = futureTotal / (outcomes.length - payoff)/ cost;
      return futureTotal / (outcomes.length - payoff)/ cost;
    }
  }
  let costPayOffSummary = outcomes.map((outcome)=>{
    if (outcome.win === true){return 100;}
    else{return recursiveWinCostRatioGenerator(outcome.next,1);}
  })
  return costPayOffSummary;
}


makeBoard();
makeHtmlBoard();
