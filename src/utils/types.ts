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

export interface IAuth {
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
  email: string;
  password: string;
  passwordConfirm: string;
  name: string;
  phone: string;
  gender: string;
  birthDate: string;
  defaultAddress: string;
}

export interface IPageList<T> {
  content: T;
  page: number;
  totalCount: number;
}

export interface ITest {
  qnADetailResponses: IPageList<IReiew[]>;
  reviewDetailResponses: IPageList<IReiew[]>;
}

export interface IProduct {
  id: number;
  name: string;
  brand: string;
  category: string;
  productNum: string;
  price: number;
  discountRate: number;
  description: string;
  imageUrl: string;
  liked: boolean;
  size: "XL" | "L" | "M" | "S";
  color: string;
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

export type TProductSearchParams = Pick<IProductSearchParams, "brand" | "category">;

export interface IMember {
  id: number;
  email: string;
  name: string;
  phone: string;
}

export interface IMemberInfo {
  id: number;
  email: string;
  name: string;
  phone: string;
  role: string;
  gender: string;
  birthDate: string;
  defaultAddress: string;
  secondAddress: string | null;
  thirdAddress: string | null;
  grade: string;
  point: number;
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

export interface ICategory {
  id: number;
  code: string;
  name: string;
  level: number;
  parent: null | number;
  children: ICategory[];
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

export interface Coupon {
  id: number;
  name: string;
  discountRate: number;
  startDate: string;
  endDate: string;
  assignBy: string;
}

export type TQnaType = "SHIPPING" | "ORDER" | "REFUND" | "OTHER";

export interface IQna {
  answerStatus: "WAITING";
  createAt: string;
  memberEmail: string;
  qnAId: number;
  qnAType: TQnaType;
  subject: string;
}

export interface IQnaParams {
  qnAType: TQnaType;
  subject: string;
  productNum: string;
  orderNum: string;
  description: string;
}

export interface IShipping {
  id: number;
  deliveryNum: string;
  orderDate: string;
  deliveryAddress: string;
  totalAmount: number;
  products: { productId: number; price: number; quantity: number; size: string; color: string }[];
  deliveryType: string;
  arrivedDate: string | null;
  departureDate: string | null;
  deliveryStatusType: string;
  deliveryCost: number;
  memberEmail: string;
}

export interface IReiew {
  createAt: string;
  description: string;
  helpful: number;
  imageUrl1: string;
  imageUrl2: string;
  imageUrl3: string;
  memberEmail: string;
  productName: string;
  rating: string;
  reviewId: number;
}

// export interface IOrderParams {
//   productOrders: {
//     productId: number;
//     price: number;
//     quantity: number;
//     size: string;
//     color: string;
//   }[];
//   shippingInfo: {
//     deliveryType: string;
//     deliveryAddressType: string;
//     deliveryAddress: string;
//     shippingMessages: string;
//     customMessage: string;
//   };
//   pointsUsed: number;
//   couponId: number;
// }

export interface IOrderParams {
  productId: number;
  price: number;
  quantity: number;
  size: string;
  color: string;
  deliveryType: string;
  deliveryAddressType: string;
  deliveryAddress: string;
  shippingMessages: string;
  customMessage: string;
  pointsUsed: number;
  couponId: number;
}
