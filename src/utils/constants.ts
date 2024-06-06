import Products from "@/pages/products";
import Categories from "@/pages/members";
import EditNote from "@/pages/editNote";
import { EditOutlined, ProductOutlined, UserOutlined } from "@ant-design/icons";

export const ADMIN_ACCESS_TOKEN = "ADMIN_ACCESS_TOKEN" as const;

export const SAVE_ID = "SAVE_ID" as const;

export const SIGN_IN_ROUTES = [
  {
    key: "0",
    Icon: ProductOutlined,
    Page: Products,
    path: "/products",
    label: "상품관리",
  },
  {
    key: "1",
    Icon: UserOutlined,
    Page: Categories,
    path: "/members",
    label: "멤버관리",
  },
  {
    key: "2",
    Icon: EditOutlined,
    Page: EditNote,
    path: "/editNote",
    label: "수정노트",
  },
];
