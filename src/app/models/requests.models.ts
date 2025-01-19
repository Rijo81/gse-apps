import { CategoriesI } from "./category.models";
import { GroupsI } from "./groups.models";

export interface TypeRequestsI {
  id: number;
  name: string;
  category?: CategoriesI,
  group_origin?: GroupsI,
  group_destine?: GroupsI;
  fields: FieldsRequestsI[];
}

export interface FieldsRequestsI {
  name: string;
  type: 'string' | 'number' | 'document' | 'checkbox' | 'radiobutton' | 'list';
  options?: string[];
}
