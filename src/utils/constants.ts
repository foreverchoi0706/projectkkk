import Products from "@/pages/products";
import Categories from "@/pages/members";
import { ProductOutlined, UserOutlined } from "@ant-design/icons";

export const ADMIN_ACCESS_TOKEN = "ADMIN_ACCESS_TOKEN" as const;

export const DEFAULT_LIST_PAGE_SIZE = "5" as const;

export const REMEMBER_ID = "REMEMBER_ID" as const;

export const SIGN_IN_ROUTES = [
  {
    key: "0",
    Icon: ProductOutlined,
    Page: Products,
    path: "/products",
    label: "상품관리",
    searchable: true,
  },
  {
    key: "1",
    Icon: UserOutlined,
    Page: Categories,
    path: "/members",
    label: "멤버관리",
    searchable: true,
  },
];
