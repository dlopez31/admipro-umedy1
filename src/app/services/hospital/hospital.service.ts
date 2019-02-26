import { Injectable } from '@angular/core';
import { URL_SEVICIOS } from 'src/app/config/config';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Hospital } from '../../models/hospital.model';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  constructor( public http: HttpClient,
               public _usuarioService: UsuarioService) { }

  cargarHospitales(desde: number = 0) {
    const url = URL_SEVICIOS + '/hospital?desde=' + desde;
    return this.http.get(url);
  }

  obtenerHospital( id: string ) {
    const url = URL_SEVICIOS + '/hospital/' + id;
    return this.http.get(url)
      .pipe(
        map( (resp: any) => resp.hospital ));
  }

  borrarHospital( id: string) {
    let url = URL_SEVICIOS + '/hospital/' + id;
    url += '?token=' + this._usuarioService.token;
    return this.http.delete(url)
      .pipe(
        map( (resp: any) => {
          swal('Hospital borrado', 'El hospital a sido eliminado correctamente', 'success');
          return true;
        }));
  }

  crearHospital( nombre: string) {
    let url = URL_SEVICIOS + '/hospital';
    url += '?token=' + this._usuarioService.token;
    return this.http.post( url, { nombre } )
    .pipe(map( (resp: any) => {
      swal('Hospital creado', nombre, 'success');
      return resp;
    }));
  }

  buscarHospital( termino: string) {
    const url = URL_SEVICIOS + '/busqueda/coleccion/hospital/' + termino;
    return this.http.get(url)
      .pipe(
        map( (resp: any) => resp.hospital ));
  }

  actualizarHospital(hospital: Hospital) {
    let url = URL_SEVICIOS + '/hospital/' + hospital._id;
    url += '?token=' +  this._usuarioService.token;
    return this.http.put( url, hospital )
      .pipe(map( (resp: any) => {
        swal('Hospital actualizado', hospital.nombre, 'success');
        return resp.hospital;
      }));
  }
}
