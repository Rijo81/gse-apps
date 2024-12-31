import { FileModel } from "./odoo.model";
export class CompanyAddress {
  description?: string;
  latitude?: number;
  longitude?: number;
}
export class CompanyModel {
  id!: number;
  name!: string;
  version?: string;
  image_url?: string;
  phone?: string;
  mobile?: string;
  email?: string;
  address?: CompanyAddress;
  about_us?: string;
  images: Array<FileModel> = [];
}
