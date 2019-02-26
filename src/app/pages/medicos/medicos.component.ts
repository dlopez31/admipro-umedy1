import { Component, OnInit } from '@angular/core';
import { MedicoService } from 'src/app/services/service.index';
import { Medico } from 'src/app/models/medico.model';

declare var swal: any;

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: []
})
export class MedicosComponent implements OnInit {

  public desde: number = 0;
  public totalRegistros: number = 0;
  public medicos: Medico[] = [];
  public cargando: boolean = false;

  constructor(public _medicoService: MedicoService) { }

  ngOnInit() {
    this.cargarMedicos();
  }

  cargarMedicos() {
    this.cargando = true;
    this._medicoService.cargarMedicos( this.desde )
      .subscribe( (resp: any) => {
        this.totalRegistros = resp.total;
        this.medicos = resp.medicos;
        this.cargando = false;
      });
  }

  cambiarDesde(valor: number) {
    const desde = this.desde + valor;
    if (desde >= this.totalRegistros ) {
      return;
    }
    if (desde < 0 ) {
      return;
    }
    this.desde += valor;
    this.cargarMedicos();
  }



  borrarMedico( medico: Medico) {
    swal({
      title: '¿Esta seguro?',
      text: 'Esta a punto de borrar al médico: ' + medico.nombre,
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    })
    .then( borrar => {
      if ( borrar ) {
        this._medicoService.borrarMedico( medico._id)
          .subscribe( borrado => {
            this.cargarMedicos();
          });
      }
    });
  }

  buscarMedico( termino: string) {

    if ( termino.length <= 0 ) {
      this.cargarMedicos();
      return;
    }
    this.cargando = true;

    this._medicoService.buscarMedico( termino )
      .subscribe( (medicos: Medico[]) => {
        this.medicos = medicos;
        this.cargando = false;
      });
  }

}
