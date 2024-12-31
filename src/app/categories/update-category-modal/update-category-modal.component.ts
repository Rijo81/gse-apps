import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent, IonItem, IonLabel,
  IonInput, IonSelect, IonSelectOption } from "@ionic/angular/standalone";
import { CategoriesI } from 'src/app/models/category.models';
import { CategoriesService } from 'src/app/services/categories/categories.service';

@Component({
  selector: 'app-update-category-modal',
  templateUrl: './update-category-modal.component.html',
  styleUrls: ['./update-category-modal.component.scss'],
  standalone: true,
  imports: [IonInput, IonLabel, IonItem, IonContent, IonButton, IonButtons, IonTitle, IonToolbar,
    IonHeader, IonSelect, IonSelectOption, ReactiveFormsModule, FormsModule, CommonModule ]
})
export class UpdateCategoryModalComponent  implements OnInit {

  @Input() category: CategoriesI; // Recibe la categoría seleccionada
  @Input() categories: CategoriesI[]; // Lista de todas las categorías (incluyendo padres)
  editCategoryForm: FormGroup;

  constructor(
    private modalController: ModalController,
    private fb: FormBuilder,
    private categoryService: CategoriesService // Servicio para manejar categorías
  ) {
    this.editCategoryForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      parentCategory: [null],
    });
  }

  ngOnInit() {
    if (this.category) {

        this.editCategoryForm.patchValue(this.category); // Rellenar el formulario con los datos de la categoría seleccionada
    }
    // {
    //   name: this.category.name,
    //   description: this.category.description,
    //   parentcategory: this.category.parentcategory || null, // Asignar el id del parentCategory
    // }
 }

  dismiss() {
    this.modalController.dismiss();
  }

  async updateCategory() {
    if (this.editCategoryForm.valid) {
      //const updatedCategory = this.editCategoryForm.value;
      const updatedCategory = { ...this.category, ...this.editCategoryForm.value, };

      try {
        await this.categoryService.editCategory(this.category.id, updatedCategory); // Usamos async/await
        this.modalController.dismiss(updatedCategory); // Cerrar el modal y pasar la categoría actualizada
      } catch (error) {
        console.error('Error updating category', error);
      }
    }
  }
}

