import { Component, OnInit } from '@angular/core';
import { ServicioService } from '../servicio.service';

@Component({
  selector: 'app-chat-sala',
  templateUrl: './chat-sala.component.html',
  styleUrls: ['./chat-sala.component.css']
})
export class ChatSalaComponent implements OnInit {
  msj;
  lista=[];
  nick;
  sala;

  constructor(private _ServicioService: ServicioService) { }

  ngOnInit() {
    this.nick = this._ServicioService.nombre;
    this._ServicioService.getSala().subscribe(data=>{
      this.sala = data;
    });
    this._ServicioService.getMessageSala().subscribe(data=>{
      this.lista.push(data);
    });
  }

  enviarMensaje(){
    this._ServicioService.sendMessageSala({nombre: this.nick, mensaje: this.msj});
    this.msj = "";
  }

}
