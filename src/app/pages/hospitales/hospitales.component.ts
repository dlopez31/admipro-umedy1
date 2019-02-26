import { Component, OnInit } from '@angular/core';
import { Hospital } from 'src/app/models/hospital.model';
import { ModalUploadService } from 'src/app/components/modal-upload/modal-upload.service';
import { HospitalService } from '../../services/hospital/hospital.service';

declare var swal: any;

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: []
})
export class HospitalesComponent implements OnInit {

  public cargando: boolean = false;
  public totalRegistros: number = 0;
  public hospitales: Hospital[] = [];
  public desde: number = 0;

  constructor(public _hospitalService: HospitalService,
              public _modalUploadService: ModalUploadService) { }

  ngOnInit() {
    this.cargarHospitales();
    this._modalUploadService.notificacion
    .subscribe( resp => this.cargarHospitales());
  }

  mostrarModal( id: string ) {
      this._modalUploadService.mostrarModal( 'hospitales', id);
  }

  guardarHospital( hospital: Hospital ) {
    this._hospitalService.actualizarHospital( hospital )
      .subscribe();
  }

  crearHospital() {
    swal({
      title: 'Crear Hospital',
      text: 'Ingrese el nombre del hospital',
      icon: 'info',
      buttons: {
        cancel: true,
        confirm: 'Crear'
      },
      content: {
        element: 'input',
        attributes: {
          placeholder: 'Nombre del hospital',
          type: 'text',
        },
      },
    })
    .then( (valor: string) => {
          if ( !valor || valor.length === 0 ) {
            return;
          }
            this._hospitalService.crearHospital( valor )
              .subscribe( () => this.cargarHospitales());
    });
  }

  borrarHospital( hospital: Hospital) {
    swal({
      title: '¿Esta seguro?',
      text: 'Esta a punto de borrar a hospital: ' + hospital.nombre,
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    })
    .then( borrar => {
      if ( borrar ) {
        this._hospitalService.borrarHospital( hospital._id)
          .subscribe( borrado => {
            this.cargarHospitales();
          });
      }
    });
  }

  buscarHospital(termino: string) {
    if ( termino.length <= 0 ) {
      this.cargarHospitales();
      return;
    }
    this.cargando = true;

    this._hospitalService.buscarHospital( termino )
      .subscribe( (hospital: Hospital[]) => {
        this.hospitales = hospital;
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
    this.cargarHospitales();
  }

  cargarHospitales() {
    this.cargando = true;
    this._hospitalService.cargarHospitales( this.desde )
      .subscribe( (resp: any) => {
        this.totalRegistros = resp.total;
        this.hospitales = resp.hospitales;
        this.cargando = false;
      });
  }

}
