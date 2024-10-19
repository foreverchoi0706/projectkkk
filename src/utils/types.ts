export interface IResponse<T = unknown> {
  result: T;
  responseMessage: string;
  status: number;
}

export type TError = IResponse<{ errorMessage: string }>;

export interface IToken {
  accessToken: string;
  refreshToken: string;
}

export interface IUserInfo {
  grantType: "Bearer";
  accessToken: string;
  refreshToken: string;
  role: TRole;
}

export interface ISignInParams {
  email: string;
  password: string;
}

export interface ISignUpParams {
  id: number;
  email: string;
  password: string;
  passwordConfirm: string;
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
  soldQuantity: number;
}

export interface IProductSearchParams {
  id?: string;
  category?: string;
  productName?: string;
  brand?: string;
  content?: string;
  page?: number;
  size?: number;
}

export interface IMember {
  id: number;
  email: string;
  name: string;
  phone: string;
}

export interface IMemberSearchParams {
  name?: string;
  email?: string;
  phone?: string;
  role?: TRole;
  page?: number;
  size?: number;
}

export interface IAccount {
  id: number;
  role: TRole;
  name: string;
}

export interface IBrand {
  id: number;
  name: string;
  brand: string;
  category: string;
  productNum: string;
  price: number;
  discountRate: number;
  description: string;
  imageUrl: string;
  productCouponResponse: {
    id: 1;
    productNum: "20231018BR반000100";
    couponId: 1;
    issuedAt: "2024-10-18T17:06:25";
    usedAt: null;
    used: false;
  }[];
}

export type TRole = "center" | "admin" | "user";

export type INonNullable<T> = {
  [K in keyof T]: NonNullable<K>;
};
