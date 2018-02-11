import { Component, OnInit } from '@angular/core';
import { ServicioService } from '../servicio.service';

@Component({
  selector: 'app-chat-general',
  templateUrl: './chat-general.component.html',
  styleUrls: ['./chat-general.component.css']
})
export class ChatGeneralComponent implements OnInit {
  msj;
  lista=[];
  nick;

  constructor(private _ServicioService: ServicioService) { }

  ngOnInit() {
    this.nick = this._ServicioService.nombre;
    this._ServicioService.getMessage().subscribe(data=>{
      this.lista.push(data);
    });
  }

  enviarMenjase(){
    this._ServicioService.sendMessage({nombre: this.nick, mensaje: this.msj});
    this.msj = "";
  }

}
