import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { UsersI } from 'src/app/models/users.models';
import { UsersService } from 'src/app/services/user/users.service';
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonContent, IonLabel, IonList, IonReorderGroup,
  IonItem, IonAvatar, IonIcon, IonFab, IonFabButton, IonMenuButton } from "@ionic/angular/standalone";

@Component({
  selector: 'app-received',
  templateUrl: './received.component.html',
  styleUrls: ['./received.component.scss'],
  standalone: true,
  imports: [IonFabButton, IonFab, IonIcon, IonAvatar, IonItem, IonReorderGroup, IonList,
    IonLabel, IonContent, IonButtons, IonTitle, IonToolbar, IonHeader, IonMenuButton ]
})
export class ReceivedComponent  {

  users: UsersI[] = [];
  data: string = '';
  iLogo: string = 'assets/logo.png';
  constructor(private usersListService: UsersService,
    private alertCtrl: AlertController,
    private router: Router) {
    this.loadUsers();
  }

  async loadUsers() {
    this.users = await this.usersListService.getUsers();
    console.log(this.users);

  }
  async updateUser(user: UsersI) {
    const alert = await this.alertCtrl.create({
      header: 'Editar Usuario',
      message: `<img src="${this.iLogo}" alt="logo" style="border-radius: 2px">`,
      inputs: [
        { name: 'name',
          type: 'text',
          placeholder: 'Nombre del Usuario',
          value: user.name },
        { name: 'name',
          type: 'text',
          placeholder: 'Nombre del Usuari0',
          value: user.name },
        { name: 'name',
          type: 'text',
          placeholder: 'Nombre del Usuario',
          value: user.name },

      ],
      buttons: [
        { text: 'Cancelar',
          role: 'cancel' },
        {
          text: 'Actualizar',
            handler: async (data) => {
              const updateUser = { ...user, name: data.name };


              await this.usersListService.editUsers(user.id_user, updateUser);
              this.loadUsers();
              console.log(this.loadUsers());

          },
        },
      ],
    });
    await alert.present();
  }

  async delUser(id: string) {
    const alert = await this.alertCtrl.create({
      header: 'Eliminar Usuario',
      subHeader: 'Esta segurdo de eliminar el Usuario',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          handler: async () => {
            await this.usersListService.deleteUser(id);
            this.loadUsers();
          },
        },
      ],
    });
    await alert.present();
  }
  async addUser(){
    const alert = await this.alertCtrl.create({
      header: 'Crear Usuario',
      message: `<img src="${this.iLogo}" alt="logo" style="border-radius: 2px">`,
      inputs: [
        { name: 'name',
          type: 'text',
          placeholder: 'Nombre completo',
         },
         { name: 'email',
          type: 'text',
          placeholder: 'Correo Electronico',
         },
         { name: 'rol',
          type: 'text',
          placeholder: 'Tipo de Usuario',
         },
         { name: 'password',
          type: 'text',
          placeholder: 'Contraseña',
         },
      ],
      buttons: [
        { text: 'Cancelar',
          role: 'cancel' },
        {
          text: 'Crear',
            handler: async (data) => {
              if (data.name_list !== '') {
                const newUser: UsersI = {
                  id_user: '',
                  name: data.name,
                  email: data.email,
                  rol: data.rol,
                  password: data.password,
                  // image_profile: '',
                  // token: '',
                  // date_created: '',
                };
                await this.usersListService.createUsers(newUser);
                this.loadUsers();
              }
          },
        },
      ],
    });
    await alert.present();
    console.log('FUniconnection');

  }

  handleReorder(event: any) {
    const movedItem = this.users.splice(event.detail.from, 1)[0];
    this.users.splice(event.detail.to, 0, movedItem);
    event.detail.complete();
    localStorage.setItem('users', JSON.stringify(this.users));
    //event.detail.complete();
  }
}
