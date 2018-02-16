const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');


const publicPath = path.join(__dirname, './public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

var conectados = [];
let salaN = 1;
let jugadoresSala = [[], []];

//MEZCLAR ARRAY
function shuffle(o){
  for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
  return o;
}


//--------------------------------CONEXION------------------------------------//

io.on('connection', (socket) => {
  console.log('user connected');

  socket.on('nuevo-usuario', function(user) {
    if(conectados.indexOf(user) == -1) socket.username = user;
    else socket.username = user + Math.floor(Math.random()*100);
    conectados.push(socket.username);
    io.emit('conectados', conectados);
  });

//CHAT GENERAL
  socket.on('nuevo-mensaje', function(msg) {
    io.emit('mensajeChat', msg);
  });

//--------------------------------PARTIDA------------------------------------//

  socket.on('nueva-partida', function(msg) {
    if (io.nsps['/'].adapter.rooms["sala-" + salaN] && io.nsps['/'].adapter.rooms["sala-" + salaN].length > 1) salaN++;
    socket.join("sala-" + salaN);
    let room;
    let vasos = [{num: 1, veneno: false, lleno: true}, {num: 2, veneno: true, lleno: true}, {num: 3, veneno: false, lleno: true}, {num: 4, veneno: false, lleno: true}, {num: 5, veneno: false, lleno: true},
                  {num: 6, veneno: false, lleno: true}, {num: 7, veneno: false, lleno: true}, {num: 8, veneno: false, lleno: true}, {num: 9, veneno: false, lleno: true}, {num: 10, veneno: false, lleno: true},
                  {num: 11, veneno: false, lleno: true}, {num: 12, veneno: false, lleno: true}];
    vasos = shuffle(vasos);
    room = salaN;
    io.to("sala-" + salaN).emit('joinSala', "Estás en la sala: " + salaN);

    let turno;
    if (jugadoresSala[salaN-1].length+1 == 1) turno = true;
    else turno = false;

    jugadoresSala[salaN-1].push({num: jugadoresSala[salaN-1].length+1, nombre: socket.username, turno: turno, vidas: 3});
    if(jugadoresSala[salaN-1].length == 2){
      jugadoresSala.push([]);
      io.to("sala-" + room).emit('vasos', vasos);
      io.to("sala-" + room).emit('jugadores', jugadoresSala[salaN-1]);
    }

    //CHAT SALA
    socket.on('nuevo-mensaje-sala', function(msg) {
      io.to("sala-" + room).emit('mensajeChatSala', msg);
    });

    //ELEGIR VASO
    socket.on('vaso-elegido', function(msg) {
      if(!vasos[msg].veneno){
        vasos[msg].lleno = false;
        io.to("sala-" + room).emit('vaso', vasos.indexOf(vasos[msg]));
      }
      else {
        for(let jugador of jugadoresSala[salaN-1]){
          if (jugador.turno == true) jugador.vidas -= 1;
          if (jugador.vidas == 0) io.to("sala-" + room).emit('fin', jugadoresSala[salaN-1]);
        }
        for(let vaso of vasos){
          vaso.lleno = true;
        }
        vasos = shuffle(vasos);
        io.to("sala-" + room).emit('vasos', vasos);
      }
      for(let jugador of jugadoresSala[salaN-1]){
        if (jugador.turno == true) jugador.turno = false;
        else jugador.turno = true;
        io.to("sala-" + room).emit('jugadores', jugadoresSala[salaN-1]);
      }
    });

    //REINICIAR PARTIDA
    socket.on('reiniciar', function() {
      for(let jugador of jugadoresSala[salaN-1]){
        jugador.vidas = 3;
        io.to("sala-" + room).emit('jugadores', jugadoresSala[salaN-1]);
        vasos = shuffle(vasos);
        io.to("sala-" + room).emit('vasos', vasos);
      }
    });

  });

//--------------------------------DESCONEXION---------------------------------//

  socket.on('disconnect', function() {
    console.log('user disconnected');
    conectados = conectados.filter(user=> user != socket.username);
    console.log(conectados);
    io.emit('conectados', conectados);
  });
});

server.listen(port, () => {
  console.log(`started on port: ${port}`);
});
