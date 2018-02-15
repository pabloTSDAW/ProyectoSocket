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
  ganador;
  perdedor;

  constructor(private _ServicioService:ServicioService) {}

  ngOnInit() {
    this.nick = this._ServicioService.nombre;
    $('.mensaje').hide();
    $('.info').hide();
    $('.resultado').hide();
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
      this.verVidas(this.jugador);
    });
    this._ServicioService.getVasoElegido().subscribe(data=>{
      this.perder(this.vasos[data])
    });
    this._ServicioService.getGanador().subscribe(data=>{
      this.compruebaGanador(data);
    });
  }

  muestra(event, elem){
    if (this.jugador.turno) this._ServicioService.sendVasoElegido(this.vasos.indexOf(elem));
    else $('.info').show();
  }

  perder(elem){
    if(elem.veneno){
      elem.lleno = true;
    }
    else{
      elem.lleno = false;
    }
  }

  verVidas(jugador){
    $('.vidas').empty();
    for(let i=1; i <= jugador.vidas; i++){
      $('.vidas').append('<img src="../assets/vida.png" width="50px" height="50px">');
    }
  }

  compruebaGanador(lista){
    for(let elem of lista){
      if(elem.vidas == 0) this.perdedor = elem;
      else this.ganador = elem;
    }
    $('.vasos').hide();
    $('.modal-body').append(
          '<p>El ganador ha sido: <span>' + this.ganador.nombre + '</span> con <span>' + this.ganador.vidas + '</span> vidas restantes.</p>'+
          '<p>El perdedor ha sido: <span>' + this.perdedor.nombre + '</span> con <span>' + this.perdedor.vidas + '</span> vidas restantes.</p>'
    );
    $('#myModal').modal('show');
  }

  reiniciarPartida(){
    $('#myModal').modal('hide');
    this._ServicioService.sendReiniciar();
  }

  cerrarModal(){
    $('#myModal').modal('hide');
  }

}
