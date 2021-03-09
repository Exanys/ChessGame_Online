const rooms = [];

function createRoom(roomName,player){
    const room = {roomName, players:[player]}
    rooms.push(room);
    return room;
}

function deleteRoom(roomName){
    const index = rooms.findIndex(room => room.roomName === roomName);
    if (index !== -1) {
        return rooms.splice(index, 1)[0];
      }
}

function updateRoom(room){
    const index = rooms.findIndex(e => e.roomName === room.roomName);
    if (index !== -1) {
        rooms[index] = room;
      }
      return rooms;
}

function playerDisconnect (player, roomName){
    const room = rooms.find(room => room.roomName === roomName);
    room.players.filter(person => person === player );
    if(room.players.length() == 0){deleteRoom(room.roomName)}
    else{  updateRoom(room);}
    return room;
}
function playerConnect (player, roomName){
    const room = rooms.find(room => room.roomName === roomName);
    room.players.push(player);
    if(!room){createRoom(roomName, player)}
    else{  updateRoom(room);}
    return room;
}



