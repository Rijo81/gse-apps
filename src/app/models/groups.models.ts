export interface GroupsI{
  id: number;
  name: string;
  //parentId: GroupsI | null;
  parentId: number | null;
}
