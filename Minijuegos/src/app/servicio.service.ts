import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ServicioService {
    //private url = 'http://localhost:3000';
    private url = environment.serverSocket;
    private socket;
    public nombre;
    public numero;

    constructor() {
        this.socket = io(this.url);
    }

    sendUser(nombre){
      this.socket.emit('nuevo-usuario', nombre);
    }

    getConectados(): Observable<number>{
      return Observable.create((observer)=>{
        this.socket.on('conectados', (data)=>{
          observer.next(data);
        });
      });
    }

    getNumeroJugadores(): Observable<number>{
      return Observable.create((observer)=>{
        this.socket.on('numero', (data)=>{
          observer.next(data);
          this.numero = data;
        });
      });
    }

    sendMessage(mensaje){
      this.socket.emit('nuevo-mensaje', mensaje);
    }

    getMessage(): Observable<any>{
      return Observable.create((observer)=>{
        this.socket.on('mensajeChat', (data)=>{
          observer.next(data);
        });
      });
    }

    sendPartida(nombre){
      this.socket.emit('nueva-partida', nombre);
    }

    getSala(): Observable<any>{
      return Observable.create((observer)=>{
        this.socket.on('joinSala', (data)=>{
          observer.next(data);
        });
      });
    }

    sendMessageSala(mensaje){
      this.socket.emit('nuevo-mensaje-sala', mensaje);
    }

    getMessageSala(): Observable<any>{
      return Observable.create((observer)=>{
        this.socket.on('mensajeChatSala', (data)=>{
          observer.next(data);
        });
      });
    }

    getVasos(): Observable<any>{
      return Observable.create((observer)=>{
        this.socket.on('vasos', (data)=>{
          observer.next(data);
        });
      });
    }

    sendVasoElegido(vaso){
      this.socket.emit('vaso-elegido', vaso);
    }

    getVasoElegido(){
      return Observable.create((observer)=>{
        this.socket.on('vaso', (data)=>{
          observer.next(data);
        });
      });
    }

    // sendVida(user){
    //   this.socket.emit('pierde-vida', user);
    // }

    getJugadoresSala(): Observable<any>{
      return Observable.create((observer)=>{
        this.socket.on('jugadores', (data)=>{
          observer.next(data);
        });
      });
    }

}
