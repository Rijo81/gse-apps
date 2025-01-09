import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent, IonList, IonItem, IonLabel,
  IonInput, IonSelect, IonSelectOption } from "@ionic/angular/standalone";
import { GroupsI } from 'src/app/models/groups.models';

@Component({
  selector: 'app-group-modal-create',
  templateUrl: './group-modal-create.component.html',
  styleUrls: ['./group-modal-create.component.scss'],
  standalone: true,
  imports: [IonInput, IonLabel, IonItem, IonList, IonContent, IonButton, IonButtons, IonTitle, IonToolbar,
    IonHeader, IonSelect, IonSelectOption, FormsModule  ]
})
export class GroupModalCreateComponent {

 @Input() parentGroup: { id: number; name: string; parentId: GroupsI }[] = [];
   groupName: string = '';
   selectedGroup: string = '';


   constructor(private modalCtrl: ModalController) {}

   closeModal() {
     this.modalCtrl.dismiss();
   }

   createGroup() {
     if (this.groupName) {
       const newGroup = {
         name: this.groupName,
         parentId: this.selectedGroup,
       };
       this.modalCtrl.dismiss(newGroup); // Devuelve los datos al componente padre
     } else {
       alert('Completa todos los campos');
     }
   }

}
