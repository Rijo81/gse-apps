import { Injectable } from '@angular/core';
import { HttpService } from '../http.service';
import { PickerModel } from 'src/app/models/picker.model';
import { BaseModel, UserModel } from 'src/app/models/odoo.model';


// Colocar esto en la carpeta models y definir sus propiedades

export class ProductPriceList extends BaseModel { }

export class ProductTemplateModel {
  id!: number;
  name!: string;
  duration!: number;
  user_specific!: boolean;
  users_allowed!: Array<UserModel>;
  price!: number;
  currency!: string;
  product_main_image?: string;
  product_additional_images?: Array<string> = []
}

export class ProductTemplateRequestModel {
  name?: string;
  duration?: number;
  price?: number;
  user_specific?: boolean;
  users_allowed?: Array<number> = [];
  category_id?: number;
  product_main_image?: Blob;
  product_additional_images?: Array<Blob> = []
}


@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private apiService: HttpService) { }

  async getProducts(): Promise<Array<ProductTemplateModel>> {
    const response = await this.apiService.get(`api/appointment/product/template`)
    if (response.status > 300) {
      throw new Error(response.data.error)
    }

    return response.data.data.products
  }

  async getInitialData(): Promise<{ users: Array<PickerModel>, categories: Array<PickerModel> }> {
    const response = await this.apiService.get(`api/appointment/product/template/initial/data`)
    if (response.status > 300) {
      throw new Error(response.data.error)
    }
    return response.data.data
  }

  getFormData(product: ProductTemplateRequestModel) {
    const formData = new FormData();
    if (product.category_id) formData.append('category_id', `${product.category_id}`)
    if (product.duration) formData.append('duration', `${product.duration}`)
    if (product.name) formData.append('name', `${product.name}`)
    if (product.price) formData.append('price', `${product.price}`)
    if (product.user_specific) formData.append('user_specific', `${product.user_specific}`)
    if (product.users_allowed) formData.append('users_allowed', `${product.users_allowed}`)

    if (product.product_main_image) formData.append('product_main_image', product.product_main_image ?? '')


    if (product.product_additional_images) {
      product.product_additional_images.forEach((image, index) => {
        formData.append(`product_additional_images_${index}`, image ?? '')
      })
    }
    return formData
  }
  async createProduct(product: ProductTemplateRequestModel): Promise<ProductTemplateModel> {

    const formData = this.getFormData(product)

    const response = await this.apiService.postFormData('api/appointment/product/template', formData)

    if (response.status > 300) {
      throw new Error(response.data.error.message)
    }
    return response.data.product
  }

  async editProduct(id: number, product: ProductTemplateRequestModel): Promise<ProductTemplateModel> {
    const formData = this.getFormData(product)

    const response = await this.apiService.postFormData(`api/appointment/product/template/${id}/`, formData)
    if (response.status > 300) {
      throw new Error(response.data.error.message)
    }

    return response.data.product
  }

  async deleteProduct(id: number): Promise<void> {
    const response = await this.apiService.post(`api/appointment/product/template/${id}/archive`, {})
    if (response.status > 300) {
      throw new Error(response.data.error.message)
    }
  }
}
