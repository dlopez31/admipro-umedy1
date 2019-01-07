import { Injectable } from '@angular/core';

@Injectable()
export class SidebarService {

  menu: any = [
    {
      titulo: 'Principan',
      icono: 'mdi mdi-gauge',
      submenu: [
        { titulo: 'Dashboard', url: '/dashboard' },
        { titulo: 'ProggressBar', url: '/progress' },
        { titulo: 'Graficas', url: '/graficas1' }
      ]
    }
];

    constructor() {}
}
