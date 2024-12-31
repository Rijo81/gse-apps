import { CapacitorHttp, HttpOptions, HttpResponse } from '@capacitor/core';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { odooParseBodyRequest } from '../helpers/odoo-response';
import { StorageService } from './storage.service';
import { TOKEN_AUTHENTICATION } from '../constansts';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  private baseUrl: string;

  constructor(private storageService: StorageService) {
    this.baseUrl = environment.HOST
  }

  async getOptions(endpoint_resource: string, data?: any | null, params?: any | null): Promise<HttpOptions> {
    const token = await this.storageService.get(TOKEN_AUTHENTICATION)

    const options: HttpOptions = {
      url: `${this.baseUrl}/${endpoint_resource}`,
      headers: {
        'Content-Type': 'application/json'
      },
      params: params
    };


    if (token && options.headers) {
      console.log("______________________ token __________________");
      options['headers']['Authorization'] = `Bearer ${token}`
    }

    if (data)
      options['data'] = data

    return options
  }
  async get(enpoint_resource: string, params?: any | null): Promise<HttpResponse> {
    const options = await this.getOptions(enpoint_resource, null, params)
    return await CapacitorHttp.get(options)
  }

  async post(endpoint_resource: string, body: any | null): Promise<HttpResponse> {
    const options = await this.getOptions(endpoint_resource, odooParseBodyRequest(body))
    return await CapacitorHttp.post(options)
  }
  async postFormData(endpoint_resource: string, formData: FormData): Promise<HttpResponse> {
    const token = await this.storageService.get(TOKEN_AUTHENTICATION)

    const options: any = {
      url: `${this.baseUrl}/${endpoint_resource}`,
      data: formData,
      headers: {}
    };

    if (token && options.headers) {
      options['headers']['Authorization'] = `Bearer ${token}`
    }


    return await CapacitorHttp.post(options)
  }


  async getImage(url: string) {
    const response = await CapacitorHttp.get({ url, responseType: 'arraybuffer' })
    return `data:image/png;base64,${response.data}`; // Ajust
  }

}
