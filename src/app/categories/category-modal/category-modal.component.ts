import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent, IonItem, IonLabel,
   IonSelectOption, IonList, IonInput, IonSelect } from "@ionic/angular/standalone";

@Component({
  selector: 'app-category-modal',
  templateUrl: './category-modal.component.html',
  styleUrls: ['./category-modal.component.scss'],
  standalone: true,
  imports: [IonInput, IonList, IonLabel, IonItem, IonContent, IonButton, IonButtons, IonTitle,
    IonToolbar, IonHeader,  CommonModule, FormsModule, ReactiveFormsModule, IonSelectOption, IonSelect ]
})
export class CategoryModalComponent  {

  @Input() parentcategories: { id: string; name: string; description: string, parentcategory: string }[] = [];
  categoryName: string = '';
  categoryDescription: string = '';
  selectedSubcategory: string = '';

  constructor(private modalCtrl: ModalController) {}

  closeModal() {
    this.modalCtrl.dismiss();
  }

  createCategory() {
    if (this.categoryName) {
      const newCategory = {
        name: this.categoryName,
        description: this.categoryDescription,
        parentcategory: this.selectedSubcategory,
      };
      this.modalCtrl.dismiss(newCategory); // Devuelve los datos al componente padre
    } else {
      alert('Completa todos los campos');
    }
  }
}
