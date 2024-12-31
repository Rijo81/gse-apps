import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { IonModal, IonToolbar, IonHeader, IonButtons, IonButton, IonTitle, IonContent, IonItem, IonInput, IonCheckbox, IonLabel } from "@ionic/angular/standalone";
import { RolsI } from 'src/app/models/rols.models';

@Component({
  selector: 'app-update-modal',
  templateUrl: './update-modal.component.html',
  styleUrls: ['./update-modal.component.scss'],
  standalone: true,
  imports: [IonLabel, IonCheckbox, IonInput, IonItem, IonContent, IonTitle, IonButton, IonButtons,
    IonHeader, IonToolbar, FormsModule, CommonModule]
})
export class UpdateModalComponent   {

  @Input() rols = {
    name: '',
    permition_categories: false,
    permition_states: false,
    permition_users: false,
    permition_viewsolic: false,
    permition_requests: false,
  };

  constructor(private modalController: ModalController) {}

  // Cerrar modal sin guardar cambios
  dismiss() {
    this.modalController.dismiss();
  }

  // Confirmar cambios y cerrar modal
  confirm() {
    this.modalController.dismiss(this.rols);
  }
}
