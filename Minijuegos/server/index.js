let express = require('express')
let app = express();

let http = require('http');
let server = http.Server(app);

let socketIO = require('socket.io');
let io = socketIO(server);

var numeroJugadores = 0;
var conectados = [];
let salaN = 1;
let salaUsers = [];

const port = process.env.PORT || 3000;

io.on('connection', (socket) => {
  console.log('user connected');

  socket.on('nuevo-usuario', function(user) {
    conectados.push(user);
    socket.username = user;
    numeroJugadores++;
    io.emit('numero', numeroJugadores);
    io.emit('conectados', conectados);
  });

  socket.on('nuevo-mensaje', function(msg) {
    io.emit('mensajeChat', msg);
  });

  socket.on('nueva-partida', function(msg) {
    if (io.nsps['/'].adapter.rooms["sala-" + salaN] && io.nsps['/'].adapter.rooms["sala-" + salaN].length > 1) salaN++;
    socket.join("sala-" + salaN);
    let room;
    let vasos = [{num: 1, veneno: false, lleno: true}, {num: 2, veneno: true, lleno: true}, {num: 3, veneno: false, lleno: true}, {num: 4, veneno: false, lleno: true}, {num: 5, veneno: false, lleno: true},
                  {num: 6, veneno: false, lleno: true}, {num: 7, veneno: false, lleno: true}, {num: 8, veneno: false, lleno: true}, {num: 9, veneno: false, lleno: true}, {num: 10, veneno: false, lleno: true},
                  {num: 11, veneno: false, lleno: true}, {num: 12, veneno: false, lleno: true}];
    io.to("sala-" + salaN).emit('joinSala', "Hola " + msg + ", estás en la sala: " + salaN);
    room = salaN;
    io.to("sala-" + room).emit('vasos', vasos);
    socket.on('nuevo-mensaje-sala', function(msg) {
      io.to("sala-" + room).emit('mensajeChatSala', msg);
    });
    socket.on('vaso-elegido', function(msg) {
      if(!vasos[msg].veneno){
        vasos[msg].lleno = false;
      }
      io.to("sala-" + room).emit('vaso', vasos.indexOf(vasos[msg]));
    });
  });

  // socket.on('nuevapartida', function () {
  //     if (io.nsps['/'].adapter.rooms["sala-" + salaN] && io.nsps['/'].adapter.rooms["sala-" + salaN].length > 2) salaN++;
  //     socket.join("sala-" + salaN);
  //     salaUsers[salaN - 1].push(socket.username);
  //     console.log(salaUsers[salaN - 1]);
  //     io.to("sala-" + salaN).emit('joinSala', {'usuario': salaUsers[salaN - 1], 'sala': salaN});
  //     if (salaUsers[salaN - 1].length == 3) {
  //       salaUsers.push([]);
  //     }

  socket.on('disconnect', function() {
    console.log('user disconnected');
    numeroJugadores--;
    conectados = conectados.filter(user=> user != socket.username);
    console.log(conectados);
    io.emit('conectados', conectados);
    io.emit('numero', numeroJugadores);
  });
});

server.listen(port, () => {
  console.log(`started on port: ${port}`);
});
