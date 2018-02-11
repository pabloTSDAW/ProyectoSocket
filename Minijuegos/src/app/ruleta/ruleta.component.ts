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
  veneno;

  constructor(private _ServicioService:ServicioService) {}

  ngOnInit() {
    $('.mensaje').hide();
    this._ServicioService.getSala().subscribe(data=>{
      this.sala = data;
      console.log(this.sala)
    });
    this._ServicioService.getVasos().subscribe(data=>{
      this.vasos = data;
    });
    this._ServicioService.getVasoElegido().subscribe(data=>{
      console.log(data);
      this.perder(this.vasos[data])
    });
  }

  muestra(event, elem){
    this._ServicioService.sendVasoElegido(this.vasos.indexOf(elem));
  }

  perder(elem){
    if(elem.veneno){
      elem.lleno = true;
      console.log('MUERTO!!!!!');
      $('.mensaje').show();
    }
    else{
      elem.lleno = false;
    }
  }

}
