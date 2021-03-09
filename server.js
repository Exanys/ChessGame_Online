
const path = require('path');
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);


const {
    playerJoin,
    getCurrentPlayer,
    playerLeave,
    getRoomPlayers
  } = require('./utils/players');

app.use(express.static(path.join(__dirname, 'public')));


io.on('connection', socket =>{
    socket.on('joinRoom', ({username, room}) =>{
        let connected = [];
        connected =  [getRoomPlayers(room)];
        let length = connected.length;
        if(length > 2){
            return;
        } 
        const player = playerJoin(socket.id, username, room);
        socket.join(player.room);
        io.to(player.room).emit('roomPlayers', {
            room: player.room,
            players: getRoomPlayers(player.room)
          });
    });
    socket.on('move', pos =>{
        const player = getCurrentPlayer(socket.id);
        io.to(player.room).emit('moveOpponent', pos);
    });
    socket.on('gameOver', msg =>{
        const player = getCurrentPlayer(socket.id);
        socket.to(player.room).emit('youWin', msg);
    });
    socket.on('disconnect', () => {
        const player = playerLeave(socket.id);
        if(player){
            io.to(player.room).emit(
                'disc',
                player.id);
            io.to(player.room).emit('roomPlayers', {
                room: player.room,
                players: getRoomPlayers(player.room)
              });
        }
          });
        
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
