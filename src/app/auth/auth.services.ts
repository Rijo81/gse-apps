/* eslint-disable max-len */
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root' // Esto hace que el servicio esté disponible de forma global
  })

export class AuthService {

    
  constructor(private httpClient: HttpClient) { }
  private userRegister = new Subject<any>()

  sendEventUser(datos: any) {
    this.userRegister.next(datos);
  }

  getEventUser() {
    return this.userRegister.asObservable();
  }

  login(body: any){
    const url = "https://kabaygroup.com/api/authenticate"
    return this.httpClient.post(url, body);
  }

}
