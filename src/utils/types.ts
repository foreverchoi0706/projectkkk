export interface IResponse<T = unknown> {
  result: T;
  ResponseMessage: string;
  status: number;
}

export interface IError {
  detail: string;
  instance: string;
  properties: null;
  status: number;
  title: string;
  type: string;
}

export interface IUserInfo {
  grantType: "Bearer";
  accessToken: string;
  refreshToken: string;
}

export interface ISignInParams {
  email: string;
  password: string;
}

export interface ISignUpParams {
  id: number;
  email: string;
  password: string;
  rePassword: string;
  name: string;
  phone: string;
}

export interface IPageList<T> {
  content: T;
  page: number;
  totalCount: number;
}

export interface IProduct {
  id: number;
  brand: string;
  selledcount: number;
  name: string;
  category: string;
  stock: number;
  image: string;
}

export interface IProductSearchParams {
  id?: string;
  brand?: string;
  contents?: string;
  page?: number | null;
}

export interface IMember {
  id: number;
  email: string;
  name: string;
  phone: string;
}

export interface IMemberSearchParams {
  id: number;
  email: string;
}

export interface IAccount {
  id: number;
  role: "center" | "admin" | "user";
  name: string;
}
