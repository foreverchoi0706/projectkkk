import { ProductFilled, UserOutlined } from "@ant-design/icons";

export const ACCESS_TOKEN = "ACCESS_TOKEN" as const;

export const SAVE_ID = "SAVE_ID" as const;

export const SIGN_IN_ROUTES = [
  {
    Icon: ProductFilled,
    key: "0",
    label: "상품 관리",
    path: "/products",
  },
  {
    Icon: UserOutlined,
    key: "1",
    label: "멤버 관리",
    path: "/members",
  },
];
