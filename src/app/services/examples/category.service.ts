import { Injectable } from '@angular/core';
import { HttpService } from '../http.service';

// Colocar esto en la carpeta models y definir sus propiedades
class AppointmentCategoryModel {

}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  constructor(private apiService: HttpService) { }

  async getCategories(): Promise<Array<AppointmentCategoryModel>> {
    const response = await this.apiService.get(`api/product/category`)
    if (response.status > 300) {
      throw new Error(response.data.error)
    }
    return response.data.data.categories
  }

  async createCategory(category: AppointmentCategoryModel): Promise<AppointmentCategoryModel> {
    const response = await this.apiService.post('api/product/category', category)
    if (response.status > 300) {
      throw new Error(response.data.error.message)
    }
    return response.data.result.category
  }

  async editCategory(id: number, category: AppointmentCategoryModel): Promise<AppointmentCategoryModel> {
    const response = await this.apiService.post(`api/product/category/${id}/`, category)
    if (response.status > 300) {
      throw new Error(response.data.error.message)
    }
    return response.data.result.category
  }

  async deleteCategory(id: number): Promise<void> {
    const response = await this.apiService.post(`api/product/category/${id}/archive`, {})
    if (response.status > 300) {
      throw new Error(response.data.error.message)
    }
  }
}
