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

export interface RequestI {
  id: number;
  formData: Record<string, any>;
  group_origin: { id: number; name: string; parentId?: number };
  group_destine: { id: number; name: string; parentId?: number };
  typeName: string;
}
