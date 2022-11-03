export interface ICreate {
  createdBy: string;
  title: string;
  data: Object;
  type: Number;
}

export interface IDoc {
  _id: string;
  __v: number;
  createdBy: string;
  title: string;
  data: Object;
  path: string;
  type: Number;
  createdAt: Date;
  updatedAt: Date;
}
