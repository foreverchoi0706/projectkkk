export interface Response<T> {
  result: T;
  ResponseMessage: string;
  status: number;
}

export interface SignUpParams {
  id: number;
  email: string;
  password: string;
  rePassword: string;
  name: string;
  phone: string;
}

export interface Product {
  id: number;
  brand: string;
  selledcount: any;
  name: string;
  category: string;
  stock: number;
  image: string;
}
