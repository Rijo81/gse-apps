import { Component, OnInit, ViewChild} from '@angular/core';
import { AlertController,  ItemReorderEventDetail } from '@ionic/angular';
import { AppointmentStateModelI } from 'src/app/models/state.models';
import { StatesService } from 'src/app/services/states/states.service';
import { NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';
import { IonContent, IonHeader, IonLabel, IonAvatar, IonPopover, IonList, IonReorderGroup, IonItem,
  IonIcon, IonFab, IonFabButton, IonToolbar, IonTitle, IonButtons, IonMenuButton } from "@ionic/angular/standalone";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list-states',
  templateUrl: './list-states.component.html',
  styleUrls: ['./list-states.component.scss'],
  standalone: true,
  imports: [IonButtons, IonTitle, IonToolbar, IonFabButton, IonFab, IonIcon, IonItem, IonReorderGroup,
    IonList, IonPopover, IonAvatar, IonLabel, IonHeader, IonContent, IonMenuButton, CommonModule ]
})
export class ListStatesComponent implements OnInit  {
  isLoading = false
  isClosePopoverOpen = false

  userProfile?: string;
  user: any;
  presentingElement: any = null;

  states: AppointmentStateModelI[] = [];
  data: string = '';
  constructor(private stateService: StatesService,
    private alertCtrl: AlertController,
    private router: Router,
    private userService: UserService) {
    this.loadStates();
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
  async loadStates() {
    this.states = await this.stateService.getState();
    console.log(this.states);

  }
  async updateState(state: AppointmentStateModelI){
    const alert = await this.alertCtrl.create({
      header: 'Editar Estado',
      inputs: [
        { name: 'name',
          type: 'text',
          placeholder: 'Nombre del estado',
          value: state.name },
      ],
      buttons: [
        { text: 'Cancelar',
          role: 'cancel' },
        {
          text: 'Actualizar',
            handler: async (data) => {
              const updatedState = { ...state, name: data.name };


              await this.stateService.editState(state.id, updatedState);
              console.log(data.id);
              this.loadStates();
              console.log(this.loadStates);

          },
        },
      ],
    });
    await alert.present();
  }

  async delState(id: string) {
    const alert = await this.alertCtrl.create({
      header: 'Eliminar Estado',
      subHeader: 'Esta segurdo de eliminar el estado',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          handler: async () => {
            await this.stateService.deleteState(id);
            this.loadStates();
          },
        },
      ],
    });
    await alert.present();
  }
  async addState(){
    const alert = await this.alertCtrl.create({
      header: 'Crear Estado',
      inputs: [
        { name: 'name_state',
          type: 'text',
          placeholder: 'Nombre del estado'
         },
      ],
      buttons: [
        { text: 'Cancelar',
          role: 'cancel' },
        {
          text: 'Crear',
            handler: async (data) => {
              if (data.name_state !== '') {
                const newState: AppointmentStateModelI = {
                  id: '',
                  name: data.name_state,
                };
                await this.stateService.createState(newState);
                this.loadStates();
              }
          },
        },
      ],
    });
    await alert.present();
    console.log('FUniconnection');

  }


}

