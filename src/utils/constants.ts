import Accounts from "@/pages/accounts";
import Categories from "@/pages/members";
import Products from "@/pages/products";
import { AccountBookOutlined, ProductOutlined, UserOutlined } from "@ant-design/icons";

export const ADMIN_ACCESS_TOKEN = "ADMIN_ACCESS_TOKEN" as const;

export const DEFAULT_LIST_PAGE_SIZE = "5" as const;

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
  {
    key: "2",
    Icon: AccountBookOutlined,
    Page: Accounts,
    path: "/accounts",
    label: "권한관리",
    searchable: false,
  },
];
