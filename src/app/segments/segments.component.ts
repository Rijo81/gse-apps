import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild} from '@angular/core';

import {  IonTitle, IonButtons, IonToolbar, IonHeader, IonPopover, IonAvatar, IonIcon,
  IonFab, IonFabButton, IonContent, IonLabel, IonSegment, IonSegmentButton, IonMenuButton } from '@ionic/angular/standalone';
import { AlertController, IonicModule, ItemReorderEventDetail } from '@ionic/angular';
import { Router } from '@angular/router';
import { UserService } from '../services/user/user.service';
import { AppointmentStateModelI } from '../models/state.models';
import { ListCategoriesComponent } from '../categories/list-categories/list-categories.component';
import { CategoriesI } from '../models/category.models';

@Component({
  selector: 'app-segments',
  templateUrl: './segments.component.html',
  styleUrls: ['./segments.component.scss'],
  standalone: true,
  imports: [ IonTitle, IonButtons, IonToolbar, IonHeader, IonPopover, IonAvatar, IonIcon,
    IonFab, IonFabButton, IonContent, IonLabel, IonSegment, IonSegmentButton, CommonModule,
    FormsModule, IonMenuButton ]
})

export class SegmentsComponent  implements OnInit {
  selectedSegment: string = 'states'
  isLoading = false
  isClosePopoverOpen = false

  userProfile?: string;
  user: any;
  presentingElement: any = null;

  states: AppointmentStateModelI[] = [];
  categories: CategoriesI[] = [];
  data: string = '';
  constructor(
    private alertCtrl: AlertController,
    private router: Router,
    private userService: UserService) {
      //this.refreshList();
    }

    // @ViewChild(ListStatesComponent) listStatesComponent!: ListStatesComponent;
    // @ViewChild(ListCategoriesComponent) listCategoryComponent!: ListCategoriesComponent;

    refreshListStates() {
      //this.listStatesComponent.loadStates(); // Llama al método del componente hijo
    }
    refreshListCategories() {
      //this.listCategoryComponent.loadCategories(); // Llama al método del componente hijo
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
  async addStates(){
    // const alert = await this.alertCtrl.create({
    //   header: 'Crear Estado',
    //   inputs: [
    //     { name: 'name_state',
    //       type: 'text',
    //       placeholder: 'Nombre del estado'
    //      },
    //   ],
    //   buttons: [
    //     { text: 'Cancelar',
    //       role: 'cancel' },
    //     {
    //       text: 'Crear',
    //         handler: async (data) => {
    //           if (data.name_state !== '') {
    //             const newState: AppointmentStateModelI = {
    //               id: '',
    //               name: data.name_state,
    //             };
    //             await this.stateService.createState(newState);
    //             this.refreshListStates();
    //           }
    //       },
    //     },
    //   ],
    // });
    // await alert.present();
    // console.log('FUniconnection');

  }

  async addCategories(){
    // let enableSubcategory = false;
    // const alert = await this.alertCtrl.create({

    //   header: 'Crear Categoria',
    //   inputs: [
    //     { name: 'name_category',
    //       type: 'text',
    //       placeholder: 'Nombre de la Categoría'
    //      },
    //      { name: 'description_category',
    //       type: 'text',
    //       placeholder: 'Descripcion'
    //      },

    //   ],
    //   buttons: [
    //     { text: 'Cancelar',
    //       role: 'cancel' },
    //     {
    //       text: 'Crear',
    //         handler: async (data) => {
    //           console.log('adding categoria');
    //           if (data.name_category !== '') {
    //             const newCategory: CategoriesI = {
    //               id: '',
    //               name: data.name_category,
    //               description: data.description_category,
    //             };
    //            await this.categoriesService.createCategory(newCategory);

    //             this.refreshListCategories();
    //           }
    //       },
    //     },
    //   ],
    // });
    // await alert.present();
    // console.log('FUniconnection');
  }
}

