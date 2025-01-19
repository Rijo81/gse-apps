import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  public appPages = [
    {title: 'Inicio', url: '/segments', icon: 'home'},
    {title: 'Estados', url: '/state', icon: 'list'},
    {title: 'Categorias', url: '/categories', icon: 'duplicate'},
    {title: 'Grupos', url: '/groups', icon: 'grid'},
    {title: 'Tipos de Solicitudes', url: '/typerequests', icon: 'keypad'},
    {title: 'Solicitudes', url: '/requests', icon: 'send'},
    {title: 'Roles', url: '/rols', icon: 'settings'},
    {title: 'Usuarios', url: '/auth/users', icon: 'people'},
    {title: 'Ver Solicitudes', url: '/received', icon: 'eye'},
  ];
  constructor() {}
}
