const players = [];

function playerJoin (id, username, room, isWhite){
    // const turn = false;
    // if(isWhite){
    //     turn = true;
    // }
    const player = {id, username, room, isWhite};
    players.push(player);
    return player;
}

function playerLeave(id) {
    const index = players.findIndex(player => player.id === id);
  
    if (index !== -1) {
      return players.splice(index, 1)[0];
    }
  }

  function getRoomPlayers(room) {
    return players.filter(user => user.room === room);
  }

//   function nextTurn(room){
//       players.forEach(person => person.turn = !person.turn);
//   }

  function getCurrentPlayer(id) {
    return players.find(player => player.id === id);
  }
// function getRooms() {
//     const rooms = [];

// }
// function check(rooms, room){
//     rooms.
// }

module.exports = { playerJoin, playerLeave, getCurrentPlayer, getRoomPlayers };