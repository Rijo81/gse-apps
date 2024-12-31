import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  public appPages = [
    // { title: 'Inbox', url: '/folder/inbox', icon: 'mail' },
    // { title: 'Outbox', url: '/folder/outbox', icon: 'paper-plane' },
    // { title: 'Favorites', url: '/folder/favorites', icon: 'heart' },
    // { title: 'Archived', url: '/folder/archived', icon: 'archive' },
    // { title: 'Trash', url: '/folder/trash', icon: 'trash' },
    // { title: 'Spam', url: '/folder/spam', icon: 'warning' },

    {title: 'Inicio', url: '/segments', icon: 'home'},
    {title: 'Estados', url: '/state/list-state', icon: 'list'},
    {title: 'Categorias', url: '/list-categories', icon: 'duplicate'},
    {title: 'Tipos de Solicitudes', url: '/typerequests', icon: 'keypad'},
    {title: 'Solicitudes', url: '/requests', icon: 'send'},
    {title: 'Roles', url: '/rolls', icon: 'settings'},
    {title: 'Usuarios', url: '/auth/users', icon: 'people'},
  ];
  //public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  constructor() {}
}
