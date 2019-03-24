import { Injectable } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { URL_SEVICIOS } from 'src/app/config/config';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';
import swal from 'sweetalert';


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuario: Usuario;
  token: string;
  menu: any[] = [];

  constructor( public http: HttpClient,
               public router: Router,
               public _subirArchivoService: SubirArchivoService ) {
     this.cargarStorage();
   }

   renuevaToken() {
     let url = URL_SEVICIOS + '/login/renuevatoken';
     url += '?token=' + this.token;
     return this.http.get(url)
     .pipe (map ((resp: any) => {
        this.token = resp.token;
        localStorage.setItem('token', this.token);
        return true;
     }))
     .pipe (
      catchError((err: HttpErrorResponse) => {
        this.router.navigate(['/login']);
       swal('No se pudo renovar token', 'No fue posible renovar token', 'error');
      return throwError(err);
      })
   );
   }

   estaLogiado() {
     return ( this.token.length > 5 ) ? true : false;
   }

   cargarStorage() {
     if ( localStorage.getItem('token')) {
       this.token = localStorage.getItem('token');
       this.usuario = JSON.parse( localStorage.getItem('usuario'));
       this.menu = JSON.parse( localStorage.getItem('menu'));
     } else {
       this.token = '';
       this.usuario = null;
       this.menu = [];
     }
   }

   guardarStorage( id: string, token: string, usuario: Usuario, menu: any ) {
    localStorage.setItem('id', id );
    localStorage.setItem('token', token );
    localStorage.setItem('usuario', JSON.stringify(usuario) );
    localStorage.setItem('menu', JSON.stringify(menu) );

    this.usuario = usuario;
    this.token = token;
    this.menu = menu;

   }

   loginGoogle( token: string ) {
     const url = URL_SEVICIOS + '/login/google';

     return this.http.post( url, { token })
     .pipe(map ( (resp: any ) => {
       this.guardarStorage( resp.id, resp.token, resp.usuario, resp.menu );
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
         this.guardarStorage( resp.id, resp.token, resp.usuario, resp.menu  );
        return true;
      } ))
      .pipe (
        catchError((err: HttpErrorResponse) => {
         swal('Error en el login', err.error.mensaje, 'error');
        return throwError(err);
        })
     );
   }

   crearUsuario( usuario: Usuario) {
      const url = URL_SEVICIOS + '/usuario';
      return this.http.post( url, usuario )
      .pipe(map( (resp: any) => {
        swal('Usuario creado', usuario.email, 'success');
        return resp.usuario;
      }))
      .pipe (
        catchError((err: HttpErrorResponse) => {
          swal(err.error.message, err.error.errors.message, 'error');
        return throwError(err);
        })
     );
   }

   logout() {
     this.token = '';
     this.usuario = null;
     this.menu = [];
     localStorage.removeItem('token');
     localStorage.removeItem('usuario');
     localStorage.removeItem('menu');
     this.router.navigate(['/login']);
   }

   actualizarUsuario( usuario: Usuario ) {
      let url = URL_SEVICIOS + '/usuario/' + usuario._id;
      url += '?token=' + this.token;
      return this.http.put( url, usuario )
        .pipe(map( (resp: any) => {
          if ( usuario._id === this.usuario._id ) {
            const usuarioDB: Usuario = resp.usuario;
            this.guardarStorage( usuarioDB._id, this.token, usuarioDB, this.menu );
          }
          swal('Usuario actualizado', usuario.nombre, 'success');
          return true;
        }))
        .pipe (
          catchError((err: HttpErrorResponse) => {
            swal(err.error.message, err.error.errors.message, 'error');
          return throwError(err);
          })
       );
   }

   cambiarImagen( archivo: File, id: string) {
    this._subirArchivoService.subirArchivo( archivo, 'usuarios', id )
    .then( (resp: any) => {
      this.usuario.img = resp.usuario.img;
      swal('Imagen Actualizada', this.usuario.nombre, 'success');
      this.guardarStorage( id, this.token, this.usuario, this.menu );
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
