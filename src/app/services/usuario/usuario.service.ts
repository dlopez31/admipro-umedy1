import { Injectable } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { URL_SEVICIOS } from 'src/app/config/config';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuario: Usuario;
  token: string;

  constructor( public http: HttpClient,
               public router: Router,
               public _subirArchivoService: SubirArchivoService ) {
     this.cargarStorage();
   }

   estaLogiado() {
     return ( this.token.length > 5 ) ? true : false;
   }

   cargarStorage() {
     if ( localStorage.getItem('token')) {
       this.token = localStorage.getItem('token');
       this.usuario = JSON.parse( localStorage.getItem('usuario'));
     } else {
       this.token = '';
       this.usuario = null;
     }
   }

   guardarStorage( id: string, token: string, usuario: Usuario) {
    localStorage.setItem('id', id );
    localStorage.setItem('token', token );
    localStorage.setItem('usuario', JSON.stringify(usuario) );

    this.usuario = usuario;
    this.token = token;

   }

   loginGoogle( token: string ) {
     const url = URL_SEVICIOS + '/login/google';

     return this.http.post( url, { token })
     .pipe(map ( (resp: any ) => {
       this.guardarStorage( resp.id, resp.token, resp.usuario );
        return true;
      }));
   }
   login(usuario: Usuario, recordar: boolean = false ) {

      if (recordar ) {
        localStorage.setItem('email', usuario.email);
      } else {
        localStorage.removeItem('email');
      }

      const url = URL_SEVICIOS + '/login';
      return this.http.post( url, usuario)
      .pipe(map( (resp: any) => {
         this.guardarStorage( resp.id, resp.token, resp.usuario );
        return true;
      } ))
      .pipe
     (
     catchError((error: HttpErrorResponse) => {
       if ( error.status === 400 ) {
        swal('Calve incorrecta', usuario.email, 'error');
       }
        return throwError(error.message || 'server error');
                                            })
     );
   }

   crearUsuario( usuario: Usuario) {
      const url = URL_SEVICIOS + '/usuario';
      return this.http.post( url, usuario )
      .pipe(map( (resp: any) => {
        swal('Usuario creado', usuario.email, 'success');
        return resp.usuario;
      }));
   }

   logout() {
     this.token = '';
     this.usuario = null;
     localStorage.removeItem('token');
     localStorage.removeItem('usuario');
     this.router.navigate(['/login']);
   }

   actualizarUsuario( usuario: Usuario ) {
      let url = URL_SEVICIOS + '/usuario/' + usuario._id;
      url += '?token=' + this.token;
      return this.http.put( url, usuario )
        .pipe(map( (resp: any) => {
          if ( usuario._id === this.usuario._id ) {
            const usuarioDB: Usuario = resp.usuario;
            this.guardarStorage( usuarioDB._id, this.token, usuarioDB);
          }
          swal('Usuario actualizado', usuario.nombre, 'success');
          return true;
        }));
   }

   cambiarImagen( archivo: File, id: string) {
    this._subirArchivoService.subirArchivo( archivo, 'usuarios', id )
    .then( (resp: any) => {
      this.usuario.img = resp.usuario.img;
      swal('Imagen Actualizada', this.usuario.nombre, 'success');
      this.guardarStorage( id, this.token, this.usuario);
    })
    .catch( resp => {
      console.log( resp );
    });
   }

   cargarUsuarios(desde: number = 0) {
      const url = URL_SEVICIOS + '/usuario?desde=' + desde;
      return this.http.get(url);
   }

   buscarUsuario( termino: string ) {
    const url = URL_SEVICIOS + '/busqueda/coleccion/usuarios/' + termino;
    return this.http.get(url)
      .pipe(
        map( (resp: any) => resp.usuarios ));
  }

  borrarUsuario( id: string ) {
    let url = URL_SEVICIOS + '/usuario/' + id;
    url += '?token=' + this.token;
    return this.http.delete(url)
      .pipe(
        map( (resp: any) => {
          swal('Usuario borrado', 'El usuario a sido eliminado correctamente', 'success');
          return true;
        }));
  }


}
