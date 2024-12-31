import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { IonToolbar, IonBackButton, IonButtons, IonContent, IonImg, IonLabel, IonList, IonItem, IonInput,
  IonIcon, IonButton, IonSelect, IonSelectOption } from "@ionic/angular/standalone";
import { RolsI } from 'src/app/models/rols.models';

@Component({
  selector: 'app-register-modal',
  templateUrl: './register-modal.component.html',
  styleUrls: ['./register-modal.component.scss'],
  standalone: true,
  imports: [IonButton, IonIcon, IonInput, IonItem, IonList, IonLabel, IonImg, IonContent, IonButtons,
    IonBackButton, IonToolbar, IonSelect, IonSelectOption, FormsModule, CommonModule ]
})
export class RegisterModalComponent  implements OnInit {

  customPopoverOptions = {
      header: 'Tipo de Usuarios',
      subHeader: 'Roles',
      message: 'Seleccione el rol a asignar',
    };
    rols: RolsI[] = [];
    image: string = '../../../assets/logo.png';

    @Input() dataRegisterUser: { id_user: string; name: string; email: string, rol: string, password: string }[] = [];
      name: string = '';
      email: string = '';
      selectRol: string = '';
      pass: string = '';

      constructor(private modalCtrl: ModalController) {}
      ngOnInit() {
        const storedRoles = localStorage.getItem('rols');
        if (storedRoles) {
          this.rols = JSON.parse(storedRoles);  // Convertir el JSON a un objeto de tipo Role[]
        }
        if (this.dataRegisterUser && this.dataRegisterUser.length > 0) {
          const user = this.dataRegisterUser[0]; // Suponiendo que el array tiene un solo usuario
          this.name = user.name;
          this.email = user.email;
          this.selectRol = user.rol;
          this.pass = user.password;
        }
      }
      closeModal() {
        this.modalCtrl.dismiss();
      }

      createUser() {
        if (this.name || this.email || this.pass) {
          const newUser = {
            name: this.name,
            email: this.email,
            rol: this.selectRol,
            password: this.pass,
          };
          this.modalCtrl.dismiss(newUser);
        } else {
          alert('Completa todos los campos');
        }
      }

      updateUser() {
        if (this.name && this.email && this.pass) {
          const updatedUser = {
            id_user: this.dataRegisterUser[0].id_user,  // Mantener el ID del usuario original
            name: this.name,
            email: this.email,
            rol: this.selectRol,
            password: this.pass,
          };
          this.modalCtrl.dismiss(updatedUser);  // Pasar el usuario actualizado al componente principal
        } else {
          alert('Completa todos los campos');
        }
      }
}
