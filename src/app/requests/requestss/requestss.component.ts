import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonContent, IonCard, IonCardHeader,
  IonCardTitle, IonCardContent, IonItem, IonLabel, IonList, IonInput, IonRadioGroup,
  IonRadio, IonCheckbox, IonButton, IonSelect, IonSelectOption, IonMenuButton  } from "@ionic/angular/standalone";
import { TypeRequestsI } from 'src/app/models/requests.models';

@Component({
  selector: 'app-requestss',
  templateUrl: './requestss.component.html',
  styleUrls: ['./requestss.component.scss'],
  standalone: true,
  imports: [IonButton, IonCheckbox, IonRadio, IonRadioGroup, IonInput, IonList, IonLabel,
    IonItem, IonCardContent, IonCardTitle, IonCardHeader, IonCard, IonContent, IonButtons,
    IonTitle, IonToolbar, IonHeader, IonSelect, IonSelectOption, IonMenuButton, ReactiveFormsModule,
  FormsModule, CommonModule ]
})
export class RequestssComponent  implements OnInit {

  typeRequests: TypeRequestsI[] = [];
    selectedTypeId: number | null = null;
    selectedType: TypeRequestsI | null = null;
    formData: { [key: string]: any } = {};
    requests: any[] = [];

    constructor() {
      this.loadTypeRequests();
      this.loadRequests();
    }
    ngOnInit() {
      const stored = localStorage.getItem('requests');
      if (stored) {
        this.requests = JSON.parse(stored);
      }

      console.log('Loaded categories:', this.requests);
    }

    loadTypeRequests() {
      const stored = localStorage.getItem('requestTypes');
      if (stored) {
        this.typeRequests = JSON.parse(stored);
      }
    }

    loadRequests() {
      const stored = localStorage.getItem('requests');
      if (stored) {
        this.requests = JSON.parse(stored);
      }
    }

    onTypeChange() {
      this.selectedType = this.typeRequests.find(type => type.id === this.selectedTypeId) || null;
      this.formData = {};
    }

    clearLocalStorage(){
      localStorage.removeItem('requests');
    }

    onFileChange(event: any, fieldName: string) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          this.formData[fieldName] = reader.result; // Guardamos la base64 del archivo.
        };
        reader.readAsDataURL(file);
      }
    }

    saveRequest() {
      const newRequest = {
        id: Date.now(),
        typeName: this.selectedType?.name,
        formData: { ...this.formData }
      };
      this.requests.push(newRequest);
      this.saveToLocalStorage();
      this.formData = {};
      this.selectedTypeId = null;
    }

    saveToLocalStorage() {
      localStorage.setItem('requests', JSON.stringify(this.requests));
      const stored = localStorage.getItem('requests');
      console.log('resultados: ', stored);

    }

}
