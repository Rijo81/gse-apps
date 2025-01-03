import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonHeader, IonToolbar, IonButtons, IonTitle, IonContent, IonCardHeader, IonCard,
  IonCardTitle, IonCardContent, IonList, IonLabel, IonItem, IonInput, IonButton, IonSelect,
  IonSelectOption, IonMenuButton } from "@ionic/angular/standalone";
import { CategoriesI } from 'src/app/models/category.models';
import { TypeRequestsI } from 'src/app/models/requests.models';
import { RolsI } from 'src/app/models/rols.models';

@Component({
  selector: 'app-typerequests',
  templateUrl: './typerequests.component.html',
  styleUrls: ['./typerequests.component.scss'],
  standalone: true,
  imports: [IonButton, IonInput, IonItem, IonLabel, IonList, IonCardContent, IonCardTitle, IonCard,
    IonCardHeader, IonContent, IonTitle, IonButtons, IonToolbar, IonHeader,  FormsModule,
        ReactiveFormsModule, IonSelect, IonSelectOption, IonMenuButton, CommonModule] // import the necessary components here
})
export class TyperequestsComponent  implements OnInit {

    typeRequestForm: FormGroup;
    typeRequests: TypeRequestsI[] = [];
    categories: CategoriesI[] = [];
    rols: RolsI[] = [];

    constructor(private fb: FormBuilder) {
      // Inicialización del formulario reactivo
      this.typeRequestForm = this.fb.group({
        name: ['', [Validators.required, Validators.minLength(3)]],
        category: [null, Validators.required],
        rols: [null, Validators.required],
        fields: this.fb.array([]),
      });
      this.loadTypeRequests();
    }

    ngOnInit() {
      const savedCategories = localStorage.getItem('categories');
      const savedRols = localStorage.getItem('rols');

      if (savedCategories) {
        this.categories = JSON.parse(savedCategories);
      }

      if (savedRols) {
        this.rols = JSON.parse(savedRols);
      }
    }

    // Getter para el array de campos
    get fields(): FormArray {
      return this.typeRequestForm.get('fields') as FormArray;
    }

    // Añadir un nuevo campo dinámico
    addField() {
      const fields = this.typeRequestForm.get('fields') as FormArray;
      const fieldGroup = this.fb.group({
        name: ['', Validators.required],
        type: ['', Validators.required],
        options: this.fb.array([]), // Agregar FormArray para opciones si es necesario
      });

      // if (['radiobutton', 'lista', 'checkbox'].includes()) {
      //   const optionsArray = fieldGroup.get('options') as FormArray;
      //   optionsArray.push(this.fb.control('')); // Agregar al menos una opción vacía por defecto
      // }

      fields.push(fieldGroup);

    }

    // Eliminar un campo dinámico
    removeField(index: number) {
      this.fields.removeAt(index);
    }

    // Manejo del cambio de tipo de campo
    onFieldTypeChange(index: number) {

      const fields = this.typeRequestForm.get('fields') as FormArray;
  const field = fields.at(index) as FormGroup;

  if (['radiobutton', 'lista', 'checkbox'].includes(field.get('type')?.value)) {
    if (!field.get('options')) {
      field.addControl('options', this.fb.array([])); // Agregar FormArray de opciones
    }
  } else {
    if (field.get('options')) {
      field.removeControl('options'); // Eliminar FormArray de opciones
    }
  }
      // const field = this.fields.at(index) as FormGroup;
      // const type = field.get('type')?.value;

      // if (type === 'list' || type === 'radiobutton') {
      //   if (!field.get('options')) {
      //     field.addControl('options', this.fb.array([]));
      //   }
      // } else {
      //   field.removeControl('options');
      // }
    }

    // Añadir una opción a un campo específico
    addOption(fieldIndex: number) {

      const fields = this.typeRequestForm.get('fields') as FormArray;
      const options = fields.at(fieldIndex).get('options') as FormArray;
      options.push(this.fb.control('')); // Agrega una nueva opción vacía
      // const options = this.getOptions(fieldIndex);
      // options.push(this.fb.control('', Validators.required));
    }

    // Eliminar una opción de un campo específico
    removeOption(fieldIndex: number, optionIndex: number) {
      const fields = this.typeRequestForm.get('fields') as FormArray;
      const options = fields.at(fieldIndex).get('options') as FormArray;
      options.removeAt(optionIndex); // Elimina la opción seleccionada
      // const options = this.getOptions(fieldIndex);
      // options.removeAt(optionIndex);
    }

    // Obtener el array de opciones para un campo
    getOptions(fieldIndex: number): FormArray {
      return this.fields.at(fieldIndex).get('options') as FormArray;
    }

    // Guardar el tipo de solicitud
    saveTypeRequest() {
      console.log('saveTypeRequest: ', this.typeRequestForm);

      if (this.typeRequestForm.invalid) {
        alert('Por favor complete todos los campos obligatorios.');
        return;
      }

      const newTypeRequest: TypeRequestsI = {
        id: Date.now(),
        ...this.typeRequestForm.value,
      };
      console.log(newTypeRequest);

      // Verificar unicidad de nombres de campos
      const fieldNames = newTypeRequest.fields.map((field) => field.name?.trim() || '');
      console.log('ver valores: ', fieldNames);

      if (new Set(fieldNames).size !== fieldNames.length) {
        alert('Los nombres de los campos deben ser únicos.');
        return;
      }

      this.typeRequests.push(newTypeRequest);
      this.saveToLocalStorage();
      this.typeRequestForm.reset();
      this.fields.clear();
    }

    // Cargar tipos de solicitudes desde LocalStorage
    loadTypeRequests() {
      const stored = localStorage.getItem('requestTypes');
      if (stored) {
        this.typeRequests = JSON.parse(stored);
      }
    }

    // Guardar tipos de solicitudes en LocalStorage
    saveToLocalStorage() {
      localStorage.setItem('requestTypes', JSON.stringify(this.typeRequests));
    }

}
