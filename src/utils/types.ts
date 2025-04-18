import {
  ANSWER_STATUS,
  DELIVERY_ADDRESS_TYPE,
  DELIVERY_STATUS_TYPE,
  DELIVERY_TYPE,
  QNA_TYPE,
  SHIPPING_MESSAGES,
} from "@/utils/constants";

export type TError = IResponse<{ errorMessage: string }>;

export type TQnaType = keyof typeof QNA_TYPE;

export type TAnswerStatus = keyof typeof ANSWER_STATUS;

export type TDeliveryType = keyof typeof DELIVERY_TYPE;

export type TDeliveryStatusType = keyof typeof DELIVERY_STATUS_TYPE;

export type TDeliveryAddressType = keyof typeof DELIVERY_ADDRESS_TYPE;

export type TShippingMessages = keyof typeof SHIPPING_MESSAGES;

export interface IResponse<T = unknown> {
  result: T;
  responseMessage: string;
  status: number;
}

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

export interface INotification {
  createdAt: string;
  description: string;
  id: number;
  isRead: boolean;
  memberId: number;
  notificationType: "Coupon";
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

export type TRequestResetPasswordTokenParams = Pick<ISignUpParams, "email">;

export type TResetPasswordParams = Pick<ISignUpParams, "password" | "passwordConfirm">;

export interface IPageList<T> {
  content: T;
  page: number;
  totalCount: number;
}

export interface IProductDetail {
  qnADetailResponses: IQnAWaiting[];
  reviewDetailResponses: IReview[];
}

export interface IProduct {
  id: number;
  name: string;
  brand: string;
  category: string;
  descriptionImageUrls: string[];
  productNum: string;
  price: number;
  defectiveStock: number;
  discountRate: number;
  description: string[];
  mainImageUrl: string;
  liked: boolean;
  size: "XL" | "L" | "M" | "S";
  soldQuantity: number;
  stock: number;
  color: string;
  imageUrl: string;
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
  name: string;
}

export type TRole = "center" | "admin" | "user";

export interface ICoupon {
  id: number;
  name: string;
  discountRate: number;
  startDate: string;
  endDate: string;
  assignBy: string;
}

export interface IQna {
  answerStatus: TAnswerStatus;
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

export interface IQnAWaiting {
  id: number;
  qnAType: TQnaType;
  subject: string;
  productNum: number | null;
  orderNum: number | null;
  description: string;
  memberEmail: string;
  createAt: string;
  answer: string | null;
  answerDate: number | null;
  answererEmail: number | null;
  answerStatus: TAnswerStatus;
}

export type TAnswer = Pick<IQnAWaiting, "answer">;

export interface IShipping {
  id: number;
  deliveryNum: string;
  orderDate: string;
  deliveryAddress: string;
  totalAmount: number;
  products: {
    productId: number;
    price: number;
    quantity: number;
    size: string;
    color: string;
  }[];
  deliveryType: string;
  arrivedDate: string | null;
  departureDate: string | null;
  deliveryStatusType: TDeliveryStatusType;
  deliveryCost: number;
  memberEmail: string;
}

export type TShippingSearchParams = Pick<
  IShipping,
  "deliveryNum" | "deliveryAddress" | "memberEmail"
>;

export interface IReview {
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

export interface IOrderParams {
  productId: number;
  price: number;
  quantity: number;
  size: string;
  color: string;
  deliveryType: TDeliveryType;
  deliveryAddressType: TDeliveryAddressType;
  deliveryAddress: string;
  shippingMessages: TShippingMessages;
  customMessage: string;
  pointsUsed: number;
  couponId: number;
}

export interface IOrder {
  id: number;
  orderNum: string;
  orderDate: string;
  deliveryAddress: string;
  totalAmount: number;
  pointsUsed: number;
  pointsEarned: number;
  products: { productId: number; price: number; quantity: number }[];
}

export interface IReviewParams {
  description: string;
  ratingType: "ONE" | "TWO" | "THREE" | "FOUR" | "FIVE";
  imageUrl1: string;
  imageUrl2: string;
  imageUrl3: string;
}

export interface ICart {
  id: number;
  name: string;
  brand: string;
  price: number;
  discountRate: number;
  imageUrl: string;
  quantity: number;
  color: string;
}
