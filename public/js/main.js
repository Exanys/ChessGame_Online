
//const { Chess } = require('../chess.js');
const con = $('gameCon');
const url_string = window.location.search;
const urlParams = new URLSearchParams(url_string);
//const {username, room, isWhite} = queryString.parse(location.search, {ignoreQueryPrefix: true});
const username = urlParams.get('username');
const room = urlParams.get('room');
const color = String(urlParams.get('color')) ;

const socket = io();

socket.emit('joinRoom', { username, room, color });
socket.on('moveOpponent', value => {
  game.move({from: value[0], to: value[1], promotion: 'q'});
  board.position(value[2]);});

let from, to;
let turn = color == 'white' ? true : false;

let board = null;
let game = new Chess();
let whiteSquareGrey = '#a9a9a9';
let blackSquareGrey = '#696969';

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



function onSnapEnd () {
    board.position(game.fen())
    socket.emit('move', [from, to, game.fen()]);
  }
  
function onDragStart ( piece) {
    // do not pick up pieces if the game is over
    if (game.game_over()){
        socket.emit('gameOver', 'You have won');
        window.prompt('You lose');
        return false;
    } 
    let pick = (color == 'white' ? (/^b/) : (/^w/));
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
from = source;
to = target;
}

let config = { 
  pieceTheme: '../img/{piece}.png',
  draggable: true,
  position: 'start',
  orientantion: color,
  onDragStart: onDragStart,
  onMouseoutSquare: onMouseoutSquare,
  onMouseoverSquare: onMouseoverSquare,
  onDrop: onDrop,
  onSnapEnd: onSnapEnd
}


board = Chessboard('myBoard', config);



socket.on('youWin', msg =>{
    window.prompt(msg);
});

socket.on('disc', id =>{
  window.prompt(`User ${id} disconnected.`);
});




