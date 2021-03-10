
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
        let alreadyConnect = null;
        alreadyConnect = getRoomPlayers(room);
        let length = alreadyConnect.length;
        if(length >  1){
           socket.emit('fullSize', username);
        }else{
            const player = {id: socket.id, username, room, color: null};
            console.log(player);
            player.color = length ? 'black' : 'white';
            playerJoin(player);
            socket.join(player.room);
            io.to(player.room).emit('roomPlayers', {
                room: player.room,
                players: getRoomPlayers(player.room),
              });
            socket.to(player.room).emit('opponentConnect', player.id);
            if(length > 0){
                io.in(player.room).emit('start', player.id);
            }
            console.log(player);
            console.log(getRoomPlayers(player.room));
        }
        
    });
    socket.on('move', pos =>{
        const player = getCurrentPlayer(socket.id);
        io.to(player.room).emit('move', pos);
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
