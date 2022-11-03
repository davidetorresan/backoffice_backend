export interface IRegister {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

export interface ILogin {
  email: string;
  password: string;
}

export interface IUser {
  _id: string;
  __v: number;
  firstname: string;
  lastname: string;
  email: string;
  hash: string;
  salt: string;
  createdAt: Date;
  updatedAt: Date;
}
