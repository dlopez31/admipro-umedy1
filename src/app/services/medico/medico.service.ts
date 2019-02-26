import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsuarioService } from '../usuario/usuario.service';
import { URL_SEVICIOS } from 'src/app/config/config';
import { map } from 'rxjs/operators';
import { Medico } from 'src/app/models/medico.model';


@Injectable({
  providedIn: 'root'
})
export class MedicoService {
  constructor(
    public http: HttpClient,
    public _usuarioService: UsuarioService
  ) {}

  cargarMedicos(desde: number = 0) {
    const url = URL_SEVICIOS + '/medico?desde=' + desde;
    return this.http.get(url);
  }

  cargarMedico(id: string) {
    const url = URL_SEVICIOS + '/medico/' + id;
    return this.http.get(url).pipe(map((resp: any) => resp.medico));
  }

  borrarMedico(id: string) {
    let url = URL_SEVICIOS + '/medico/' + id;
    url += '?token=' + this._usuarioService.token;
    return this.http.delete(url).pipe(
      map((resp: any) => {
        swal(
          'Médico borrado',
          'El médoco a sido eliminado correctamente',
          'success'
        );
        return resp;
      })
    );
  }

  buscarMedico( termino: string ) {
    const url = URL_SEVICIOS + '/busqueda/coleccion/medicos/' + termino;
    return this.http.get(url)
      .pipe(
        map( (resp: any) => resp.medicos ));
  }

  guardarMedico(medico: Medico) {

    let url = URL_SEVICIOS + '/medico/';

    if ( medico._id ) {
      // actualizando
      url += '/' + medico._id;
      url += '?token=' + this._usuarioService.token;
      return this.http.put( url, medico ).pipe(
        map((resp: any) => {
          swal('Médico actualizado', medico.nombre, 'success');
          return resp.medico;
        }));

    } else {
        // creando
        url += '?token=' + this._usuarioService.token;
        return this.http.post(url, medico).pipe(
          map((resp: any) => {
            swal('Médico creado', medico.nombre, 'success');
            return resp.medico;
          })
        );
      }
    }
}
