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
  rival;
  ganador;
  perdedor;
  puntos = 0;

  constructor(private _ServicioService:ServicioService) {}

  ngOnInit() {
    this.nick = this._ServicioService.nombre;
    $('.mensaje').hide();
    $('.info').hide();
    $('.resultado').hide();
    $('.maspuntos').hide();
    $('.final').hide();
    this._ServicioService.getSala().subscribe(data=>{
      this.sala = data;
    });
    this._ServicioService.getVasos().subscribe(data=>{
      this.vasos = data;
      $('.esperando').hide();
    });
    this._ServicioService.getJugadoresSala().subscribe(data=>{
      for(let elem of data){
        if (this.nick == elem.nombre) {
          this.jugador = elem;
          this.puntos = elem.puntos;
        }
        else this.rival = elem;
      }
      $('.info').hide();
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
    else this._ServicioService.sendMessageSala({nombre: 'SISTEMA', mensaje: 'Es el turno de tu rival'});
  }

  perder(elem){
    if(elem.veneno){
      elem.lleno = true;
    }
    else{
      elem.lleno = false;
      if (this.jugador.turno) {
        $('.maspuntos').fadeIn("slow");
        $('.maspuntos').fadeOut("slow");
      }
    }
  }

  // verVidas(jugador){
  //   $('.vidas').empty();
  //   for(let i=1; i <= jugador.vidas; i++){
  //     $('.vidas').append('<img src="../assets/vida.png" width="50px" height="50px">');
  //   }
  // }

  compruebaGanador(lista){
    for(let elem of lista){
      if(elem.vidas == 0) this.perdedor = elem;
      else this.ganador = elem;
    }
    $('.vasos').hide();
    $('.modal-body').empty();
    $('.modal-body').append(
          '<p>El ganador ha sido: <span style="color: rgb(99, 183, 230); font-weight: bold;">' + this.ganador.nombre + '</span> con <span style="color: rgb(99, 183, 230); font-weight: bold;">' + this.ganador.puntos + '</span> puntos.</p>'+
          '<p>El perdedor ha sido: <span style="color: rgb(99, 183, 230); font-weight: bold;">' + this.perdedor.nombre + '</span> con <span style="color: rgb(99, 183, 230); font-weight: bold;">' + this.perdedor.puntos + '</span> puntos.</p>'
    );
    $('#myModal').modal('show');
  }

  cerrarModal(){
    $('#myModal').modal('hide');
  }

}
