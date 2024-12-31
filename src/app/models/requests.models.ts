import { CategoriesI } from "./category.models";
import { RolsI } from "./rols.models";

export interface TypeRequestsI {
  id: number;
  name: string;
  category?: CategoriesI,
  rols?: RolsI,
  fields: FieldsRequestsI[];
}

export interface FieldsRequestsI {
  name: string;
  type: 'string' | 'number' | 'document' | 'checkbox' | 'radiobutton' | 'list';
  options?: string[];
}
