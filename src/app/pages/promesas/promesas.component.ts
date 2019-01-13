import { Component, OnInit } from '@angular/core';
import { resolve } from 'q';

@Component({
  selector: 'app-promesas',
  templateUrl: './promesas.component.html',
  styles: []
})
export class PromesasComponent implements OnInit {

  constructor() {

    // promesa.then(
    //   () => console.log('Termino'),
    //   () => console.log('Error')
    // );

    this.constarTres( ).then(
      (mensaje) => console.log('Termino', mensaje)
    )
    .catch( error => console.log('Error en la promesa', error));

  }

  ngOnInit() {
  }

  constarTres(): Promise<boolean> {

   return new Promise( (resolve, reject) => {

      let contador = 0;

      const intervalo = setInterval( () => {
        contador += 1;
        console.log(contador);

        if ( contador === 3) {
          resolve( true );
          // reject('simplemente un error');
          clearInterval(intervalo);
        }

      }, 1000);

    });
  }

}
