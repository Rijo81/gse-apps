import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { IonModal, IonToolbar, IonHeader, IonButtons, IonButton, IonTitle, IonContent, IonItem, IonInput, IonCheckbox, IonLabel } from "@ionic/angular/standalone";
import { RolsI } from 'src/app/models/rols.models';
import { RolsService } from 'src/app/services/rols/rols.service';

@Component({
  selector: 'app-update-modal',
  templateUrl: './update-modal.component.html',
  styleUrls: ['./update-modal.component.scss'],
  standalone: true,
  imports: [IonLabel, IonCheckbox, IonInput, IonItem, IonContent, IonTitle, IonButton, IonButtons,
    IonHeader, IonToolbar, FormsModule, CommonModule, ReactiveFormsModule]
})
export class UpdateModalComponent   {

  @Input() rol: RolsI; // Recibe la categoría seleccionada
  @Input() rols: RolsI[]; // Lista de todas las categorías (incluyendo padres)
  editRolForm: FormGroup;

  constructor(
    private modalController: ModalController,
    private fb: FormBuilder,
    private rolService: RolsService // Servicio para manejar categorías
  ) {
    this.editRolForm = this.fb.group({
      name: ['', Validators.required],
      permitionCategory: [false],
      permitionState: [false],
      permitionUsers: [false],
      permitionViewRequests: [false],
      permitionRequests: [false],
    });
  }

  ngOnInit() {
    if (this.rol) {

        this.editRolForm.patchValue(this.rol); // Rellenar el formulario con los datos del rol seleccionado
    }
  }

  dismiss() {
    this.modalController.dismiss();
  }

  async updateRol() {
    if (this.editRolForm.valid) {
      //const updatedCategory = this.editCategoryForm.value;
      const updateRol = { ...this.rol, ...this.editRolForm.value, };

      try {
        await this.rolService.editRol(this.rol.id, updateRol); // Usamos async/await
        this.modalController.dismiss(updateRol); // Cerrar el modal y pasar el rol actualizado
      } catch (error) {
        console.error('Error al actualizar el Rol', error);
      }
    }
  }
}
