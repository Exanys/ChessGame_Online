
const title = document.getElementById('title');
const nameOfRoom = document.getElementById('roomName');
const con = document.getElementById('gameCon');
const boardDiv = document.getElementById('myBoard');
const url_string = window.location.search;
const urlParams = new URLSearchParams(url_string);
const username = urlParams.get('username');
const room = urlParams.get('room');

let turn = false;
let first = 5;
let me;
let connected;
con.innerHTML = `<p>Waiting for another player...</p>`;
let board = null;
  let game = new Chess();
  let whiteSquareGrey = '#a9a9a9';
  let blackSquareGrey = '#696969';

  let config = { 
    pieceTheme: '../img/{piece}.png',
    draggable: true,
    position: 'start',
    orientation: null,
    onDragStart: onDragStart,
    onMouseoutSquare: onMouseoutSquare,
    onMouseoverSquare: onMouseoverSquare,
    onDrop: onDrop
  }



const socket = io();

socket.emit('joinRoom', { username, room});
socket.on('fullSize', () => { 
  window.alert('Server is full');
  window.history.back();
});
socket.on('roomPlayers', ({room, players}) =>{
 connected = players;
 console.log(socket.id);
});

socket.on('move', ({move, username}) => {
  movePieces(move); 
  writeToConsoleMove(move, username);
  turn = !turn;
console.log(turn);});
socket.on('opponentConnect', (username) => {
  first = writeToConsoleCon(username);
  turn = !turn;
});

socket.on('start', username => {
  me = connected.filter(e => e.id === socket.id);
  config.orientation = me[0].color;
  if(first == 10 ){con.innerHTML += `<p>Game is ready!!!</p>`;}
  else{con.innerHTML = `<p>Game is ready!!!</p>`;} 
  board = Chessboard('myBoard', config);
});

socket.on('youWin', msg =>{
    window.alert(`${String(msg)}`);
    window.history.back();
});

socket.on('disc', ({id, username}) =>{
  window.alert(`User ${id} disconnected.`);
  con.innerHTML += `<p>Player ${username} disconnect.</p><p>Game is not ready. Go back.</p>`;
});





function roomName(name){
  title.innerHTML += ` ${name}`;
  nameOfRoom.innerHTML += ` ${name}`;
}
 roomName(room);

  



  
  
  function removeGreySquares () {
      $('#myBoard .square-55d63').css('background', '')
    }
    
  function greySquare (square) {
  let $square = $('#myBoard .square-' + square);
  
  let background = whiteSquareGrey;
  if ($square.hasClass('black-3c85d')) {
      background = blackSquareGrey
  }
  
  $square.css('background', background);
  }
  
  function onMouseoverSquare (square) {
      // get list of possible moves for this square
      let moves = game.moves({
        square: square,
        verbose: true
      })
    
      // exit if there are no moves available for this square
      if (moves.length === 0) return
    
      // highlight the square they moused over
      greySquare(square)
    
      // highlight the possible squares for this piece
      for (var i = 0; i < moves.length; i++) {
        greySquare(moves[i].to)
      }
    }
  
    function onMouseoutSquare () {
      removeGreySquares()
    }
  
  
  
  function movePieces (move) {
      game.move(move);
      board.position(game.fen());
    }
    
  function onDragStart (piece) {
      if(!turn){return false;} 
      console.log(me);
      // do not pick up pieces if the game is over
      if (game.game_over()){
          socket.emit('gameOver', 'You have won.');
          window.alert('You lose.');
          window.history.back();
          return false;
      } 
      let pick = (me[0].color == 'white' ? /^b/ : /^w/);
      console.log(pick); 
      // only pick up pieces for White
      if (piece.search(pick) !== -1) return false;
    }
  
  function onDrop (source, target) {
      removeGreySquares();
    
  // see if the move is legal
  let move = game.move({
      from: source,
      to: target,
      promotion: 'q' // NOTE: always promote to a queen for example simplicity
  })
  
  // illegal move
  if (move === null) return 'snapback';
  return socket.emit('move', move);
  }

  function writeToConsoleMove (move, player){
    console.log(move); 
    con.innerHTML += `<p>Player ${player} moved from ${move.from} to ${move.to}.</p>`;
  }
  function writeToConsoleCon(player){
    con.innerHTML = `<p>Player ${player} connect.</p>`;
    return 10;
  }

  // while(!turn){
  //   document.addEventListener('click', e => e.preventDefault);
  //   }








