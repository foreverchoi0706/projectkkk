import Accounts from "@/pages/accounts";
import Categories from "@/pages/members";
import Brands from "@/pages/brands";
import Products from "@/pages/products";
import { AccountBookOutlined, ProductOutlined, UserOutlined } from "@ant-design/icons";
import Setting from "@/pages/setting";

export const ACCESS_TOKEN = "ACCESS_TOKEN" as const;
export const REFRESH_TOKEN = "REFRESH_TOKEN" as const;
export const DEFAULT_LIST_PAGE_SIZE = "5" as const;

export const REQUIRED_NAME = "이름을 입력해주세요" as const;
export const REQUIRED_EMAIL = "이메일을 입력해주세요" as const;
export const REQUIRED_PASSWORD = "비밀번호를 입력해주세요" as const;
export const REQUIRED_PHONE = "연락처를 입력해주세요" as const;
export const REQUIRED_PRODUCT_NAME = "상품명을 입력해주세요" as const;
export const REQUIRED_BRAND_NAME  = "브랜드를 입력해주세요" as const;
export const REQUIRED_SOLD_QUANTITY_NAME  = "현재 판매량을 입력해주세요" as const;
export const REQUIRED_CATEGORY_NAME  = "카테고리를 입력해주세요" as const;
export const REQUIRED_STOCK_NAME  = "재고를 입력해주세요" as const;
export const INVALILD_FORMAT_EMAIL = "이메일형식이 올바르지 않습니다" as const;
export const INVALILD_FORMAT_PASSWORD = "비밀번호형식이 올바르지 않습니다" as const;
export const INVALILD_FORMAT_PHONE = "연락처형식이 올바르지 않습니다" as const;
export const INVALILD_REPASWORD = "비밀번호와 일치하지 않습니다" as const;

export const SIGN_IN_ROUTES = [
  {
    key: "0",
    Icon: ProductOutlined,
    Page: Products,
    path: "/products",
    label: "상품관리",
    searchable: true,
    accessibleRoles: new Set(["center", "admin", "user"]),
  },
  {
    key: "1",
    Icon: UserOutlined,
    Page: Categories,
    path: "/members",
    label: "멤버관리",
    searchable: true,
    accessibleRoles: new Set(["center", "admin"]),
  },
  {
    key: "2",
    Icon: AccountBookOutlined,
    Page: Accounts,
    path: "/accounts",
    label: "권한관리",
    searchable: false,
    accessibleRoles: new Set(["center"]),
  },
  {
    key: "3",
    Icon: AccountBookOutlined,
    Page: Brands,
    path: "/brands",
    label: "브랜드",
    searchable: false,
    accessibleRoles: new Set(["center", "admin","user"]),
  },
  {
    key: "4",
    Icon: AccountBookOutlined,
    Page: Setting,
    path: "/setting",
    label: "마이페이지",
    searchable: false,
    accessibleRoles: new Set(["center", "admin","user"]),
  },
];
