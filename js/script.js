//----------------------------------------------
//  VANILLA
//----------------------------------------------

let origBoard;
let game = {
  human: "O",
  ai: "X",
  winningCombos: [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2]
  ]
};


const cells = document.querySelectorAll(".cell");
const output = document.getElementById('output');
const reset = document.getElementById('reset').addEventListener('click', ()=>{
  window.location.reload();
})

function startGame(){
  origBoard = Array.from(Array(9).keys());
  for(let i = 0; i < cells.length; i++){
    cells[i].addEventListener('click', turnClick, false);
  }
}

function turnClick(square){
  if(typeof origBoard[square.target.id] == 'number'){
    turn(square.target.id, game.human);
    if (!checkTie()) turn(bestSpot(), game.ai);
  }
}

function turn(squareID, player){
  origBoard[squareID] = player;
  document.getElementById(squareID).innerText = player;
  let gameWon = checkWin(origBoard, player);
  if(gameWon) gameOver(gameWon);
}

function checkWin(board, player){
  let plays = board.reduce((a,e,i) =>
    (e === player) ? a.concat(i) : a, []);
  let gameWon = null;
  for(let [index, win] of game.winningCombos.entries()){
    if(win.every(elem => plays.indexOf(elem) > -1)){
      gameWon = {index: index, player: player};
      break;
    }
  }
  return gameWon;
}

function gameOver(gameWon){
  for(let index of game.winningCombos[gameWon.index]){
    document.getElementById(index).style.backgroundColor = gameWon.player == game.human ? "blue" : "red";
  }
  
  for(let i = 0; i < cells.length; i++){
    cells[i].removeEventListener('click', turnClick, false);
  }

  declareWinner(gameWon.player == game.human ? "You Win!" : "You Lose.")
}

function declareWinner(who){
  output.innerText = who;
}

function emptySquares(){
  return origBoard.filter(s => typeof s == 'number');
}

function bestSpot(){
  return minimax(origBoard, game.ai).index;
}

function checkTie(){
  if(emptySquares().length == 0){
    for(let i = 0; i < cells.length; i++){
      cells[i].style.backgroundColor = "green";      
      cells[i].removeEventListener('click', turnClick, false);
    }
    declareWinner("Tie Game");
    return true;
  }
  return false;
}

function minimax(newBoard, player){
  let availSpots = emptySquares(newBoard);

  if(checkWin(newBoard, game.human)){
    return {score: -10};
  } else if(checkWin(newBoard, game.ai)){
    return {score: 10};
  } else if(availSpots.length === 0){
    return {score: 0};
  }

  let moves = [];
  for(let i = 0; i < availSpots.length; i++){
    let move = {};
    move.index = newBoard[availSpots[i]]; 
    newBoard[availSpots[i]] = player;

    if(player == game.ai){
      let result = minimax(newBoard, game.human);
      move.score = result.score;
    } else {
      let result = minimax(newBoard, game.ai);
      move.score = result.score;
    }
    newBoard[availSpots[i]] = move.index;
    // moves.push(move)
    if ((player === game.ai && move.score === 10) || (player === game.human && move.score === -10)){
      return move;
    } else{
      moves.push(move);
    }
  }

  let bestMove;
  if(player === game.ai){
    let bestScore = -10000;
    for(let i = 0; i < moves.length; i++){
      if(moves[i].score > bestScore){
        bestScore = moves[i].score;
        bestMove = i;
      } 
    }
  } else {
    let bestScore = 10000;
    for(let i = 0; i < moves.length; i++){
      if(moves[i].score < bestScore){
        bestScore = moves[i].score;
        bestMove = i;
      } 
    }
  }
  return moves[bestMove];
}

startGame();


// $(function() {
//   let game = {
//     isClicked: false,
//     crossGame: "X",
//     roundGame: "O",
//     cross: [],
//     round: [],
//     winning_Array: [
//       [1, 2, 3],
//       [4, 5, 6],
//       [7, 8, 9],
//       [1, 4, 7],
//       [2, 5, 8],
//       [3, 6, 9],
//       [1, 5, 9],
//       [3, 5, 7]
//     ]
//   };

//   let output = $('#output');

//   $("#board li").on("click", function(){
//     if(!game.isClicked){
//       $(this).html(game.crossGame);
//       getData($(this), game.cross, game.crossGame);
//       game.isClicked = !game.isClicked;
//     } else if(game.isClicked){
//       $(this).html(game.roundGame);
//       getData($(this), game.round, game.roundGame);
//       game.isClicked = !game.isClicked;
//     }

//   });

//   function getData(data, whichGame, player){
//     let box = data.data("box");
//     if(!game.isClicked) game.cross.push(box);
//     else if(game.isClicked) game.round.push(box);

//     data.off();
//     checkMoves(whichGame, player);
//   };

//   function checkMoves(arr, player){
//     let compare = arr.map(v => parseInt(v,10)).sort();
//     for(let i = 0; i < game.winning_Array.length; i++){
//       if(
//         compare.includes(game.winning_Array[i][0]) &&
//         compare.includes(game.winning_Array[i][1]) &&
//         compare.includes(game.winning_Array[i][2])
//       ){
//         $("#board li").addClass('disable');
//         output.text(`${player} wins the game!`);
//       }
//     }
//     if(game.cross.length + game.round.length == 9){
//       output.text(`It's a tie`);
//     }
//   }
// });
