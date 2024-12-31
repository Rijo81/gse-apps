import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent, IonItem, IonInput, IonIcon,
  IonLabel, IonSelect, IonSelectOption } from "@ionic/angular/standalone";
import { RolsI } from 'src/app/models/rols.models';
import { UsersI } from 'src/app/models/users.models';
import { UsersService } from 'src/app/services/user/users.service';

@Component({
  selector: 'app-update-user-modal',
  templateUrl: './update-user-modal.component.html',
  styleUrls: ['./update-user-modal.component.scss'],
  standalone: true,
  imports: [IonLabel, IonIcon, IonInput, IonItem, IonContent, IonButton, IonButtons, IonTitle, IonToolbar,
    IonHeader, IonSelect, IonSelectOption, ReactiveFormsModule, FormsModule, CommonModule ]
})
export class UpdateUserModalComponent  implements OnInit {

   @Input() user: UsersI; // Recibe la categoría seleccionada
    @Input() users: UsersI[];
    rols: RolsI[] = [];
    editUsersForm: FormGroup;

    constructor(
      private modalController: ModalController,
      private fb: FormBuilder,
      private userService: UsersService // Servicio para manejar categorías
    ) {
      this.editUsersForm = this.fb.group({
        name: ['', Validators.required],
        email: ['', Validators.required],
        selectRol: [ ],
        pass: ['', Validators.required],
      });
    }

    ngOnInit() {
      const storedRoles = localStorage.getItem('rols');
      if (storedRoles) {
          this.rols = JSON.parse(storedRoles);  // Convertir el JSON a un objeto de tipo Role[]
      }
      if (this.user) {
          this.editUsersForm.patchValue(this.user); // Rellenar el formulario con los datos del rol seleccionado
      }
    }

    dismiss() {
      this.modalController.dismiss();
    }

    async updateUser() {
      if (this.editUsersForm.valid) {
        //const updatedCategory = this.editCategoryForm.value;
        const updateUser = { ...this.user, ...this.editUsersForm.value, };
        try {
          await this.userService.editUsers(this.user.id_user, updateUser); // Usamos async/await
          this.modalController.dismiss(updateUser); // Cerrar el modal y pasar el rol actualizado
        } catch (error) {
          console.error('Error al actualizar el Usuario', error);
        }
      }
    }

}
