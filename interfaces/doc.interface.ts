import { ObjectId } from "mongoose";

export interface ICreate {
  createdBy: string;
  title: string;
  data: Object;
  type: Number;
}

export interface IDoc {
  createdBy: string;
  title: string;
  data: Object;
  path: string;
  type: Number;
  createdAt: Date;
  updatedAt: Date;
}
