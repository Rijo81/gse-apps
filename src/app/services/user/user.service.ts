import { Injectable } from '@angular/core';
import { HttpService } from '../http.service';
import { StorageService } from '../storage.service';
import { AgentModel, FileModel } from 'src/app/models/odoo.model';
import { CompanyModel } from 'src/app/models/company.model';
import { getSubDomain } from 'src/app/helpers/basic.helper';
import { FCM_TOKEN, TOKEN_AUTHENTICATION, USER_TYPE } from 'src/app/constansts';
import { environment } from 'src/environments/environment.prod';

const LOGIN_INFO = "login-info"

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public user: any = {}
  public token: string = "";
  public userProfileImage: string = "";
  public company?: CompanyModel

  private _isAuthenticated: boolean = false;

  constructor(private apiService: HttpService, private storageService: StorageService) { }

  async isAuthenticated() {
    if (!this._isAuthenticated) {
      const token = await this.storageService.get(TOKEN_AUTHENTICATION);
      if (token) {
        this.token = token;
        this._isAuthenticated = true
      }
    }

    return this._isAuthenticated
  }

  async SetCompany() {
    if (this.company) return;

    const subDomain = getSubDomain()
    if (subDomain) {
      const response = await this.apiService.get(`api/company/${subDomain}/app`)
      if (response.status > 300) {
        throw new Error(response.data.error)
      }

      this.company = response.data.data.company

      if (this.company?.version && this.company.version != environment.VERSION) {
        throw new Error(`Debes actualizar la aplicacion a la version ${this.company.version}`)
      }
    } else {
      const isAuthenticated = await this.isAuthenticated()
      if (!isAuthenticated) throw new Error("No hay una compañia definida. Inicia sesion para entrar a tu compañia")
    }
  }

  async login(credentials: { login: string; password: string }): Promise<void> {
    let savedToken = await this.storageService.get(FCM_TOKEN)
    const response = await this.apiService.post('api/authenticate', { ...credentials, fcmToken: savedToken })
    if (response.status >= 300) throw new Error(response.data.error.message)

    this._isAuthenticated = true
    this.storageService.set(TOKEN_AUTHENTICATION, response.data.result.token)
    this.storageService.set(LOGIN_INFO, response.data.result)
    this.storageService.set(USER_TYPE, response.data.result.user_type) // "user" | "driver"

    await this.setLoginInfo(response.data.result)
  }


  async setLoginInfo(dataResult?: any) {
    if (!dataResult)
      dataResult = await this.storageService.get(LOGIN_INFO);

    this.user = dataResult.userInfo;
    this.token = dataResult.token;
    this.company = dataResult.company
    this.userProfileImage = this.user.image ?? '';
  }

  async logout(): Promise<void> {
    this.user = {}
    this.token = ""
    this.userProfileImage = ""
    this._isAuthenticated = false;
    await this.storageService.remove(FCM_TOKEN);
    await this.storageService.remove(LOGIN_INFO);
    await this.storageService.remove(TOKEN_AUTHENTICATION);
    await this.storageService.remove(USER_TYPE);
  }

  async getUserInfo(userId: number): Promise<AgentModel> {
    const response = await this.apiService.get(`api/appointment/user/${userId}/info/`)
    return response.data.data.user
  }

  getFormData(manager: AgentModel) {
    const formData = new FormData();
    if (manager.biography) formData.append('biography', `${manager.biography}`)

    if (manager.social_networks) formData.append('socialNetworks', JSON.stringify(manager.social_networks))

    if (manager.main_image_blob) formData.append('profileImage', manager.main_image_blob ?? '')

    if (manager.partner_files) {
      manager.partner_files.filter(file => file.blob).forEach((fileModel: FileModel, index) => {
        formData.append(`partner_files_${index}`, fileModel.blob ?? '')
      })
    }
    return formData
  }

  async editManagerProfile(manager: AgentModel): Promise<AgentModel> {
    const formData = this.getFormData(manager)

    const response = await this.apiService.postFormData(`api/user/appointment/${manager.id}/profile/`, formData)
    if (response.status > 300) {
      throw new Error(response.data.error)
    }

    return response.data.product
  }
}
