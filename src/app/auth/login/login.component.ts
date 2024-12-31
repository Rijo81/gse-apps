import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UserService } from 'src/app/services/user/user.service';
import { QuickIonicService } from 'src/app/services/quick.ionic.service';
import { StorageService } from 'src/app/services/storage.service';
import { SAVE_CREDENTIAL } from 'src/app/constansts';
import { IonContent, IonIcon, IonProgressBar, IonInput, IonLabel, IonItem, IonToggle, IonButton } from "@ionic/angular/standalone";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [IonButton, IonToggle, IonItem, IonLabel, IonInput, IonProgressBar, IonIcon, IonContent, CommonModule, ReactiveFormsModule  ]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false

  constructor(
    private router: Router,

    private formBuilder: FormBuilder,
    private userService: UserService,
    private quickIonicService: QuickIonicService,
    private storageService: StorageService
  ) {
    this.loginForm = this.formBuilder.group({
      phone: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required])],
      saveCredential: false,
    });
  }


  navigate(url = "auth/register") {
    this.router.navigate([url])
  }
  async ngOnInit(): Promise<void> {
    this.isLoading = true
    const credentials = await this.storageService.get(SAVE_CREDENTIAL)
    if (credentials) {
      this.loginForm.get("saveCredential")?.setValue(credentials.saveCredential)
      this.loginForm.get("phone")?.setValue(credentials.phone)
      this.loginForm.get("password")?.setValue(credentials.password)
    }
    this.isLoading = false

  }

  async login() {
    try {
      this.isLoading = true

      await this.storageService.set(SAVE_CREDENTIAL, { saveCredential: this.saveCredential, phone: this.saveCredential ? this.phone : null, password: this.saveCredential ? this.password : null })

      if (this.loginForm.invalid) {
        await this.quickIonicService.QuickModalAlert("Faltan Campos", `Los datos deben ser debidamente completados`)
      }

      let loginForm = this.loginForm.value

      await this.userService.login({ login: loginForm.phone, password: loginForm.password });
      //state/list
      this.navigate("segments")
    } catch (error) {
      await this.quickIonicService.QuickModalAlert("No se pudo iniciar sesion", `${error}`)

    } finally {
      this.isLoading = false
    }
  }

  get phone() {
    return this.loginForm.get('phone')?.value;
  }

  get password() {
    return this.loginForm.get('password')?.value;
  }

  get saveCredential() {
    return this.loginForm.get('saveCredential')?.value;
  }
}
