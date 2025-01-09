import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonLabel, IonAvatar, IonPopover, IonContent,
  IonReorderGroup, IonList, IonItem, IonIcon, IonFab, IonFabButton, IonMenuButton } from "@ionic/angular/standalone";
import { GroupsI } from 'src/app/models/groups.models';
import { GroupService } from 'src/app/services/groups/group.service';
import { UserService } from 'src/app/services/user/user.service';
import { GroupModalCreateComponent } from '../group-modal-create/group-modal-create.component';
import { GroupModalUpdateComponent } from '../group-modal-update/group-modal-update.component';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss'],
  standalone: true,
  imports: [IonFabButton, IonFab, IonIcon, IonItem, IonList, IonContent, IonPopover,
    IonAvatar, IonLabel, IonButtons, IonTitle, IonToolbar, IonHeader, IonMenuButton, FormsModule, CommonModule  ]
})
export class GroupComponent  implements OnInit {

   public folder!: string;
    private activatedRoute = inject(ActivatedRoute);

    isLoading = false
    isClosePopoverOpen = false

    userProfile?: string;
    user: any;
    presentingElement: any = null;
    groups: GroupsI[] = [];
    isModalOpen = false;
    selectedGroup: GroupsI | null;

    constructor(private groupsService: GroupService,
      private alertCtrl: AlertController,
      private userService: UserService,
      private router: Router,
      private modalCtrl: ModalController) {
    }
    @ViewChild('popover') popover: any;
    async ngOnInit() {
      this.folder = this.activatedRoute.snapshot.paramMap.get('id') as string;
      this.presentingElement = document.querySelector('.ion-page');

      this.userProfile = this.userService.userProfileImage
      this.user = this.userService.user
      await this.loadGroups();
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
    async loadGroups() {
      this.groups = await this.groupsService.getGrops();
      console.log('viendo: ', this.groups);
    }

    async openCreateGroupModal() {
      const modal = await this.modalCtrl.create({
        component: GroupModalCreateComponent,
        componentProps: { parentGroup: this.groups },
      });

      modal.onDidDismiss().then((result) => {
        if (result.data) {
          console.log('Nuevo grupo:', result.data);
          const newGroup: GroupsI = {
                          id: 0,
                          name: result.data.name,
                          parentId: result.data.parentId,
          };
            this.groupsService.createGroup(newGroup);
        }
      });
      await this.loadGroups();
      await modal.present();
    }

    async openEditModalGroup(group: GroupsI) {
      const modal = await this.modalCtrl.create({
        component: GroupModalUpdateComponent,
        componentProps: {
          group,
          groups: this.groups,
        },
      });

      modal.onDidDismiss().then((result) => {
        if (result.data) {
          const updatedGroup = result.data;
           // Actualizar la categoría en el listado
           const index = this.groups.findIndex((cat) => cat.id === updatedGroup.id);
           if (index !== -1) {
             this.groups[index] = updatedGroup;
           }
        }
      });
      await this.loadGroups();
      return await modal.present();
    }

    async delGroup(id: number) {
      const alert = await this.alertCtrl.create({
        header: 'Eliminar Grupo',
        subHeader: 'Esta seguro de eliminar el Grupo',
        buttons: [
          { text: 'Cancelar', role: 'cancel' },
          {
            text: 'Eliminar',
            handler: async () => {
              await this.groupsService.deleteGroup(id);
              await this.loadGroups();
            },
          },
        ],
      });
      await alert.present();
    }
}
