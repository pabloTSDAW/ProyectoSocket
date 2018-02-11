import { Component, OnInit } from '@angular/core';
import { ServicioService } from '../servicio.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  jugador;
  conectados;
  numero_conectados;

  constructor(private _ServicioService:ServicioService) {}
  ngOnInit() {
    this.jugador = this._ServicioService.nombre;
    this._ServicioService.getNumeroJugadores().subscribe(data=>{
      this.numero_conectados = data;
    });
    this._ServicioService.getConectados().subscribe(data=>{
      this.conectados = data;
      console.log(this.conectados);
    });
  }

  jugar(){
    this._ServicioService.sendPartida(this.jugador);
  }

}
