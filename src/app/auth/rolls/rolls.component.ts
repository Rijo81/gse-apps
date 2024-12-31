import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonContent, IonLabel, IonAvatar, IonPopover,
  IonModal, IonButton, IonItem, IonInput, IonCheckbox, IonList, IonReorderGroup, IonIcon, IonFab,
  IonFabButton, IonMenuButton } from "@ionic/angular/standalone";
import { ItemReorderEventDetail, OverlayEventDetail } from '@ionic/core';
import { RolsI } from 'src/app/models/rols.models';
import { RolsService } from 'src/app/services/rols/rols.service';
import { UserService } from 'src/app/services/user/user.service';
import { UpdateModalComponent } from './update-modal/update-modal.component';

@Component({
  selector: 'app-rolls',
  templateUrl: './rolls.component.html',
  styleUrls: ['./rolls.component.scss'],
  standalone: true,
  imports: [IonFabButton, IonFab, IonIcon, IonReorderGroup, IonList, IonCheckbox, IonInput, IonItem,
    IonButton, IonModal, IonPopover, IonAvatar, IonLabel, IonContent, IonButtons, IonTitle,
    IonToolbar, IonHeader, IonMenuButton, FormsModule, CommonModule ]
})
export class RollsComponent  implements OnInit {

  isLoading = false
     isClosePopoverOpen = false

     userProfile?: string;
     user: any;
     presentingElement: any = null;

     rols: RolsI[] = [];
     selectedRole: any = null;
     rolsInput = {
        name: '',
        permition_categories: false,
        permition_states: false,
        permition_users: false,
        permition_requests: false,
        permition_viewsolic: false
     }

     constructor(private rolsService: RolsService,
       private alertCtrl: AlertController,
       private modalController: ModalController,
       private router: Router,
       private userService: UserService) {

       this.loadRols();
     }

     @ViewChild(IonModal) modal: IonModal;

     cancel() {
       this.modal.dismiss(null, 'cancel');
     }

     confirm() {
       this.modal.dismiss(this.addRole(),  'confirm');
     }

     onWillDismiss(event: Event) {
       const ev = event as CustomEvent<OverlayEventDetail<string>>;
       if (ev.detail.role === 'confirm') {
         //this.message = `Hello, ${ev.detail.data}!`;
         console.log(`Hello, ${ev.detail.data}!`);
         this.loadRols();

       }
     }

     @ViewChild('popover') popover: any;
     ngOnInit() {
       this.presentingElement = document.querySelector('.ion-page');

       this.userProfile = this.userService.userProfileImage
       this.user = this.userService.user
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
     async loadRols() {
       this.rols = await this.rolsService.getRols();
       console.log(this.rols);

     }

     async addRole() {
      if (this.rolsInput.name.trim()) {
        console.log('Esto es el if rolsinput' ,this.rolsInput.name.trim());

        const newRols: RolsI = {
          id: '',
          name: this.rolsInput.name,
          permition_categories:  this.rolsInput.permition_categories,
          permition_states: this.rolsInput.permition_states,
          permition_users: this.rolsInput.permition_users,
          permition_requests: this.rolsInput.permition_requests,
          permition_viewsolic: this.rolsInput.permition_viewsolic
        };

        await this.rolsService.createRol(newRols);

        this.rolsInput = {
          name: '',
          permition_categories: false,
          permition_states: false,
          permition_users: false,
          permition_requests: false,
          permition_viewsolic: false
        };

      }
    }

    saveRoles() {
      localStorage.setItem('rols', JSON.stringify(this.rols));
    }

    async openEditModalRol(rol: RolsI) {
        const modal = await this.modalController.create({
          component: UpdateModalComponent,
          componentProps: {
            rol: {...rol},
            rols: {...this.rols},
          },
        });

        modal.onDidDismiss().then((result) => {
          if (result.data) {
            const updatedRol: RolsI = result.data;
             // Actualizar el rol en el listado
             const index = this.rols.findIndex((cat) => cat.id === updatedRol.id);
             if (index !== -1) {
               this.rols[index] = {...updatedRol};
             }
             localStorage.setItem('rols', JSON.stringify(this.rols));
            this.loadRols();
          }
        });

        return await modal.present();
      }


    // Eliminar un rol
    // updateRole(role: any) {
    //   this.selectedRole = { ...role }; // Crear una copia del rol seleccionado
    //   const modal = document.querySelector('ion-modal#edit-modal-rol')!;
    //   this.modal.present();
    // }

    // // Cancelar la edición
    // cancelEdit() {
    //   this.selectedRole = null; // Limpiar el rol seleccionado
    //   const modal = document.querySelector('ion-modal#edit-modal-rol')!;
    //   this.modal.dismiss();
    // }

    // // Confirmar y guardar los cambios
    // confirmEdit() {
    //   if (this.selectedRole) {
    //     const index = this.rols.findIndex((r) => r.id === this.selectedRole.id);
    //     if (index !== -1) {
    //       this.rols[index] = { ...this.selectedRole }; // Actualizar el rol en la lista
    //       localStorage.setItem('roles', JSON.stringify(this.rols)); // Guardar cambios en LocalStorage
    //     }
    //     this.selectedRole = null; // Limpiar el rol seleccionado
    //     const modal = document.querySelector('ion-modal#edit-modal-rol')!;
    //     this.modal.dismiss();
    //   }
    // }

    // // Dismiss del modal de edición
    // onEditDismiss(event: any) {
    //   this.selectedRole = null; // Asegurar que el rol seleccionado se limpia al cerrar el modal
    // }

    // async delRol(id: string) {
    //   this.rols = await this.rols.filter((rol) => rol.id !== id);
    //   localStorage.setItem('rols', JSON.stringify(this.rols));
    // }

     async delRol(id: string) {
       const alert = await this.alertCtrl.create({
         header: 'Eliminar Rol',
         subHeader: 'Esta segurdo de eliminar el Rol',
         buttons: [
           { text: 'Cancelar', role: 'cancel' },
           {
             text: 'Eliminar',
             handler: async () => {
               await this.rolsService.deleteRol(id);
               this.loadRols();
             },
           },
         ],
       });
       await alert.present();
     }

}
