import Accounts from "@/pages/admin/accounts";
import Brands from "@/pages/admin/brands";
import Categories from "@/pages/admin/members";
import Products from "@/pages/admin/products";
import Setting from "@/pages/admin/setting";
import {
  ApartmentOutlined,
  ProductOutlined,
  SettingOutlined,
  TagsOutlined,
  UserOutlined,
} from "@ant-design/icons";

export const USER_ACCESS_TOKEN = "USER_ADMIN_ACCESS_TOKEN" as const;
export const USER_REFRESH_TOKEN = "USER_ADMIN_ACCESS_TOKEN" as const;
export const ADMIN_ACCESS_TOKEN = "ADMIN_ACCESS_TOKEN" as const;
export const ADMIN_REFRESH_TOKEN = "ADMIN_REFRESH_TOKEN" as const;
export const DEFAULT_LIST_PAGE_SIZE = 10 as const;

export const REQUIRED_NAME = "이름을 입력해주세요" as const;
export const REQUIRED_EMAIL = "이메일을 입력해주세요" as const;
export const REQUIRED_PASSWORD = "비밀번호를 입력해주세요" as const;
export const REQUIRED_PHONE = "연락처를 입력해주세요" as const;
export const REQUIRED_PRODUCT_NAME = "상품명을 입력해주세요" as const;
export const REQUIRED_BRAND_NAME = "브랜드를 입력해주세요" as const;
export const REQUIRED_SOLD_QUANTITY_NAME = "현재 판매량을 입력해주세요" as const;
export const REQUIRED_CATEGORY_NAME = "카테고리를 입력해주세요" as const;
export const REQUIRED_STOCK_NAME = "재고를 입력해주세요" as const;
export const INVALID_FORMAT_EMAIL = "이메일형식이 올바르지 않습니다" as const;
export const INVALID_FORMAT_PASSWORD = "비밀번호형식이 올바르지 않습니다" as const;
export const INVALID_FORMAT_PHONE = "연락처형식이 올바르지 않습니다" as const;
export const INVALID_RE_PASSWORD = "비밀번호와 일치하지 않습니다" as const;

export const SIGN_IN_ROUTES = [
  {
    key: "0",
    Icon: ProductOutlined,
    Page: Products,
    path: "/products",
    label: "상품관리",
    searchable: false,
    accessibleRoles: new Set(["center", "admin", "user"]),
  },
  {
    key: "1",
    Icon: UserOutlined,
    Page: Categories,
    path: "/members",
    label: "멤버관리",
    searchable: false,
    accessibleRoles: new Set(["center", "admin"]),
  },
  {
    key: "2",
    Icon: ApartmentOutlined,
    Page: Accounts,
    path: "/accounts",
    label: "권한관리",
    searchable: false,
    accessibleRoles: new Set(["center"]),
  },
  {
    key: "3",
    Icon: TagsOutlined,
    Page: Brands,
    path: "/brands",
    label: "브랜드관리",
    searchable: false,
    accessibleRoles: new Set(["center", "admin", "user"]),
  },
  {
    key: "4",
    Icon: SettingOutlined,
    Page: Setting,
    path: "/setting",
    label: "마이페이지",
    searchable: false,
    accessibleRoles: new Set(["center", "admin", "user"]),
  },
];
