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

let vasos = [{num: 1, veneno: false, lleno: true}, {num: 2, veneno: true, lleno: true}, {num: 3, veneno: false, lleno: true}, {num: 4, veneno: false, lleno: true}, {num: 5, veneno: false, lleno: true},
              {num: 6, veneno: false, lleno: true}, {num: 7, veneno: false, lleno: true}, {num: 8, veneno: false, lleno: true}, {num: 9, veneno: false, lleno: true}, {num: 10, veneno: false, lleno: true},
              {num: 11, veneno: false, lleno: true}, {num: 12, veneno: false, lleno: true}, {num: 13, veneno: false, lleno: true}, {num: 14, veneno: false, lleno: true}, {num: 15, veneno: false, lleno: true},
              {num: 16, veneno: false, lleno: true}];

//MEZCLAR ARRAY
function shuffle(lista){
  for(var j, x, i = lista.length; i; j = Math.floor(Math.random() * i), x = lista[--i], lista[i] = lista[j], lista[j] = x);
  return lista;
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
    vasos2 = shuffle(vasos);
    room = salaN;
    io.to("sala-" + salaN).emit('joinSala', "Estás en la sala: " + salaN);

    let turno = false;
    if (jugadoresSala[salaN-1].length+1 == 1) turno = true;

    jugadoresSala[salaN-1].push({num: jugadoresSala[salaN-1].length+1, nombre: socket.username, turno: turno, puntos: 0, vidas: 1});
    if(jugadoresSala[salaN-1].length == 2){
      jugadoresSala.push([]);
      io.to("sala-" + room).emit('vasos', vasos2);
      io.to("sala-" + room).emit('jugadores', jugadoresSala[salaN-1]);
    }

    //CHAT SALA
    socket.on('nuevo-mensaje-sala', function(msg) {
      io.to("sala-" + room).emit('mensajeChatSala', msg);
    });

    //ELEGIR VASO
    socket.on('vaso-elegido', function(msg) {
      if(!vasos2[msg].veneno){
        vasos2[msg].lleno = false;
        io.to("sala-" + room).emit('vaso', vasos2.indexOf(vasos2[msg]));
        for(let jugador of jugadoresSala[salaN-1]){
          if (jugador.turno == true) {
            jugador.turno = false;
            jugador.puntos += 20;
          }
          else jugador.turno = true;
          io.to("sala-" + room).emit('jugadores', jugadoresSala[salaN-1]);
        }
      }
      else {
        for(let jugador of jugadoresSala[salaN-1]){
          if (jugador.nombre == socket.username) {
            jugador.vidas -= 1;
            jugador.puntos -= 20;
          }
        }
        for(let elem of vasos2) elem.lleno = true;
        io.to("sala-" + room).emit('mensajeChatSala', {nombre: 'SISTEMA', mensaje: 'Has perdido ' + socket.username});
        io.to("sala-" + room).emit('fin', jugadoresSala[salaN-1]);
      }
    });

    //REINICIAR PARTIDA
    // socket.on('reiniciar', function() {
    //   for(let jugador of jugadoresSala[salaN-1]){
    //     jugador.puntos = 0;
    //     jugador.vidas = 1;
    //   }
    //   io.to("sala-" + room).emit('jugadores', jugadoresSala[salaN-1]);
    //   vasos = shuffle(vasos);
    //   for(let vaso of vasos){
    //     vaso.lleno = true;
    //   }
    //   io.to("sala-" + room).emit('vasos', vasos);
    //   reinicio = 0;
    // });

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
