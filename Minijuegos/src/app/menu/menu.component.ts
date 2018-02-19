import { Component, OnInit, OnDestroy } from '@angular/core';
import { ServicioService } from '../servicio.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit, OnDestroy {
  suscripcion;
  jugador;
  conectados;
  numero_conectados = 0;

  constructor(private _ServicioService:ServicioService) {}
  ngOnInit() {
    this.jugador = this._ServicioService.nombre;
    this.suscripcion = this._ServicioService.getConectados().subscribe(data=>{
      this.conectados = data;
      // this.numero_conectados = data.length;
    });
  }

  ngOnDestroy() {
    this.suscripcion.unsubscribe();
  }

  jugar(){
    this._ServicioService.sendPartida(this.jugador);
  }

}
