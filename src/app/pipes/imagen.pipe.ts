import { Pipe, PipeTransform } from '@angular/core';
import { URL_SEVICIOS } from '../config/config';

@Pipe({
  name: 'imagen'
})
export class ImagenPipe implements PipeTransform {

  transform(img: string, tipo: string = 'usuario'): any {
    let url = URL_SEVICIOS + '/img';

    if ( !img ) {
      return url + '/usuario/xxx';
    }

    if ( img.indexOf('https') >= 0) {
      return img;
    }

    switch ( tipo ) {
      case 'usuario':
         url += '/usuarios/' +  img;
      break;
      case 'medico':
         url += '/medicos/' +  img;
      break;
      case 'hospital':
         url += '/hospitales/' +  img;
      break;
      default:
       console.log('tipo de imagen no existe, usuario, medicos, hospitales');
        url += '/usuario/xxx';
      }

    return url;
  }

}
