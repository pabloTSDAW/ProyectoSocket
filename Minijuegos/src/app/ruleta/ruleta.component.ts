import { Component, OnInit } from '@angular/core';
import { ServicioService } from '../servicio.service';
declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-ruleta',
  templateUrl: './ruleta.component.html',
  styleUrls: ['./ruleta.component.css']
})
export class RuletaComponent implements OnInit {
  sala;
  vasos;
  nick;
  jugador;

  constructor(private _ServicioService:ServicioService) {}

  ngOnInit() {
    this.nick = this._ServicioService.nombre;
    $('.mensaje').hide();
    $('.info').hide();
    this._ServicioService.getSala().subscribe(data=>{
      this.sala = data;
    });
    this._ServicioService.getVasos().subscribe(data=>{
      this.vasos = data;
      $('.esperando').hide();
    });
    this._ServicioService.getJugadoresSala().subscribe(data=>{
      for(let elem of data){
        if (this.nick == elem.nombre) this.jugador = elem;
      }
      $('.info').hide();
    });
    this._ServicioService.getVasoElegido().subscribe(data=>{
      this.perder(this.vasos[data])
    });
  }

  muestra(event, elem){
    if (this.jugador.turno) this._ServicioService.sendVasoElegido(this.vasos.indexOf(elem));
    else $('.info').show();
  }

  perder(elem){
    if(elem.veneno){
      elem.lleno = true;
      console.log('MUERTO!!!!!');
      $('.mensaje').show();
      console.log(this.jugador);
      // this._ServicioService.sendVida(this.jugador);
    }
    else{
      elem.lleno = false;
      console.log(this.jugador);
    }
  }

}
