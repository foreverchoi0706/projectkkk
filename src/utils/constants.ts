import Products from "@/pages/procuts";
import Categories from "@/pages/categories";
import { UserOutlined } from "@ant-design/icons";

export const ACCESS_TOKEN = "ACCESS_TOKEN" as const;

export const SAVE_ID = "SAVE_ID" as const;

export const SIGN_IN_ROUTES = [
  {
    key: "0",
    Icon: UserOutlined,
    Page: Products,
    path: "/products",
    label: "상품관리",
  },
  {
    key: "1",
    Icon: UserOutlined,
    Page: Categories,
    path: "/categories",
    label: "카테고리관리",
  },
];
