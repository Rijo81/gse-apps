import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, ItemReorderEventDetail, ModalController } from '@ionic/angular';
import { UsersI } from 'src/app/models/users.models';
import { UsersService } from 'src/app/services/user/users.service';
import { RolsI } from 'src/app/models/rols.models';
import { IonHeader, IonTitle, IonToolbar, IonButtons, IonContent, IonLabel, IonAvatar,
  IonPopover, IonList, IonReorderGroup, IonItem, IonIcon, IonFab, IonFabButton, IonMenuButton } from "@ionic/angular/standalone";
import { RegisterModalComponent } from './register-modal/register-modal.component';
import { UpdateUserModalComponent } from './update-user-modal/update-user-modal.component';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  standalone: true,
  imports: [IonFabButton, IonFab, IonIcon, IonItem, IonReorderGroup, IonList, IonPopover,
    IonAvatar, IonLabel, IonContent, IonButtons, IonToolbar, IonTitle, IonHeader,
    FormsModule, CommonModule, IonMenuButton ]
})
export class UsersComponent  implements OnInit {

  isLoading = false
  isClosePopoverOpen = false

  userProfile?: string;
  user: any;
  presentingElement: any = null;

  users: UsersI[] = [];
  rols: RolsI[] = [];

  data: string = '';
  iLogo: string = 'assets/logo.png';
  constructor(private usersListService: UsersService,
    private alertCtrl: AlertController,
    private router: Router,
    private userService: UserService,
   private modalCtrl: ModalController) {
    this.loadUsers();
  }
  @ViewChild('popover') popover: any;
  ngOnInit() {
    this.presentingElement = document.querySelector('.ion-page');

    this.userProfile = this.userService.userProfileImage
    this.user = this.userService.user
    this.loadUsers();
  }

  presentClosePopover(e: Event) {
    this.popover.event = e;
    this.isClosePopoverOpen = true;
  }
  navigate(url: any) {
    this.router.navigate([url])
  }

  async closeSession() {
    try {
      this.isClosePopoverOpen = false
      this.isLoading = true
      await this.userService.logout()
      this.router.navigateByUrl('/auth', { replaceUrl: true });
    } catch (error) {

    } finally {
      this.isLoading = false
    }
  }

  handleReorder(ev: CustomEvent<ItemReorderEventDetail>) {
    console.log('Dragged from index', ev.detail.from, 'to', ev.detail.to);
    ev.detail.complete();
  }
  async loadUsers() {
    this.users = await this.usersListService.getUsers();
    console.log(this.users);

  }

  async openCreateUserModal() {
      const modal = await this.modalCtrl.create({
        component: RegisterModalComponent,
        componentProps: { dataRegisterUser: this.users },
      });

      modal.onDidDismiss().then((result) => {
        if (result.data) {
          console.log('Nuevo usuarios:', result.data);
          const newUsers: UsersI = {
                          id_user: '',
                          name: result.data.name,
                          email: result.data.email,
                          rol: result.data.rol,
                          password: result.data.pass
          };
            this.usersListService.createUsers(newUsers);
            this.loadUsers();
        }
      });

      await modal.present();
    }

  async openEditModalUser(user: UsersI) {
          const modal = await this.modalCtrl.create({
            component: UpdateUserModalComponent,
            componentProps: {
              user: {...user},
              users: {...this.users},
            },
          });

          modal.onDidDismiss().then((result) => {
            if (result.data) {
              const updatedUser: UsersI = result.data;
               // Actualizar el rol en el listado
               const index = this.users.findIndex((cat) => cat.id_user === updatedUser.id_user);
               if (index !== -1) {
                 this.users[index] = {...updatedUser};
               }
               localStorage.setItem('users', JSON.stringify(this.users));
              this.loadUsers();
            }
          });

          return await modal.present();
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
}
