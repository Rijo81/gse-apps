export interface CategoriesI{
  id: number;
  name: string;
  description: string;
  parentcategory: CategoriesI | null;

}

export interface CategoriesChildI{
  id: string;
  name: string;
  parentcategory?: string[];
}
