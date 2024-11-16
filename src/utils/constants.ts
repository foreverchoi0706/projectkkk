import Accounts from "@/pages/admin/accounts";
import Brands from "@/pages/admin/brands";
import Categories from "@/pages/admin/members";
import Products from "@/pages/admin/products";
import AdminQnas from "@/pages/admin/qnas";
import Setting from "@/pages/admin/setting";
import AdminShipping from "@/pages/admin/shippings";
import Carts from "@/pages/user/carts";
import UserCategories from "@/pages/user/categories";
import Home from "@/pages/user/home";
import Picks from "@/pages/user/picks";
import UserProductsDetail from "@/pages/user/products/[id]";
import Search from "@/pages/user/search";
import UserSetting from "@/pages/user/settings";
import UserAccounts from "@/pages/user/settings/accounts";
import UserCoupons from "@/pages/user/settings/coupons";
import UserOrders from "@/pages/user/settings/orders";
import UserOrdersDetail from "@/pages/user/settings/orders/[id]";
import UserQnas from "@/pages/user/settings/qnas";
import UserReviews from "@/pages/user/settings/reviews";
import SignIn from "@/pages/user/signIn";

import SignUp from "@/pages/user/signUp";
import {
  ApartmentOutlined,
  MessageOutlined,
  ProductOutlined,
  SettingOutlined,
  TagsOutlined,
  UserOutlined,
} from "@ant-design/icons";

export const ACCESS_TOKEN = "ACCESS_TOKEN" as const;
export const REFRESH_TOKEN = "REFRESH_TOKEN" as const;

export const RECENT_SEARCH_KEYWORD = "RECENT_SEARCH_KEYWORD" as const;

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

export const USER_SIGN_IN_ROUTES = [
  {
    Page: Home,
    path: "/",
    requiredAuth: false,
    accessAbleAuth: true,
  },
  {
    Page: Search,
    path: "search",
    requiredAuth: false,
    accessAbleAuth: true,
  },
  {
    Page: SignIn,
    path: "signin",
    requiredAuth: false,
    accessAbleAuth: false,
  },
  {
    Page: SignUp,
    path: "signup",
    requiredAuth: false,
    accessAbleAuth: false,
  },
  {
    Page: UserCategories,
    path: "categories",
    requiredAuth: false,
    accessAbleAuth: true,
  },
  {
    Page: Carts,
    path: "carts",
    requiredAuth: true,
    accessAbleAuth: true,
  },
  {
    Page: UserProductsDetail,
    path: "products/:id",
    requiredAuth: false,
    accessAbleAuth: true,
  },
  {
    Page: Picks,
    path: "picks",
    requiredAuth: true,
    accessAbleAuth: true,
  },
  {
    Page: UserSetting,
    path: "settings",
    requiredAuth: true,
    accessAbleAuth: true,
  },
  {
    Page: UserOrders,
    path: "settings/orders",
    requiredAuth: true,
    accessAbleAuth: true,
  },
  {
    Page: UserOrdersDetail,
    path: "settings/orders/:id",
    requiredAuth: true,
    accessAbleAuth: true,
  },
  {
    Page: UserOrders,
    path: "settings/orders",
    requiredAuth: true,
    accessAbleAuth: true,
  },
  {
    Page: UserReviews,
    path: "settings/reviews",
    requiredAuth: true,
    accessAbleAuth: true,
  },
  {
    Page: UserCoupons,
    path: "settings/coupons",
    requiredAuth: true,
    accessAbleAuth: true,
  },
  {
    Page: UserQnas,
    path: "settings/qnas",
    requiredAuth: true,
    accessAbleAuth: true,
  },
  {
    Page: UserAccounts,
    path: "settings/accounts",
    requiredAuth: true,
    accessAbleAuth: true,
  },
];

export const ADMIN_SIGN_IN_ROUTES = [
  {
    key: "0",
    Icon: ProductOutlined,
    Page: Products,
    path: "products",
    label: "상품관리",
    accessibleRoles: new Set(["center", "admin"]),
  },
  {
    key: "1",
    Icon: UserOutlined,
    Page: Categories,
    path: "members",
    label: "멤버관리",
    accessibleRoles: new Set(["center", "admin"]),
  },
  {
    key: "2",
    Icon: ApartmentOutlined,
    Page: Accounts,
    path: "accounts",
    label: "권한관리",
    accessibleRoles: new Set(["center"]),
  },
  {
    key: "3",
    Icon: TagsOutlined,
    Page: Brands,
    path: "brands",
    label: "브랜드관리",
    accessibleRoles: new Set(["center", "admin"]),
  },
  {
    key: "4",
    Icon: MessageOutlined,
    Page: AdminQnas,
    path: "qnas",
    label: "QnA관리",
    accessibleRoles: new Set(["center", "admin"]),
  },
  {
    key: "5",
    Icon: ProductOutlined,
    Page: AdminShipping,
    path: "shippings",
    label: "배송관리",
    accessibleRoles: new Set(["center", "admin"]),
  },
  {
    key: "6",
    Icon: SettingOutlined,
    Page: Setting,
    path: "setting",
    label: "마이페이지",
    accessibleRoles: new Set(["center", "admin"]),
  },
];

export const DELIVERY_TYPE = {
  STRAIGHT_DELIVERY: "STRAIGHT_DELIVERY",
  ORDINARY_DELIVERY: "ORDINARY_DELIVERY",
  REMOTE_DELIVERY: "REMOTE_DELIVERY",
} as const;

export const DELIVERY_ADDRESS_TYPE = {
  DEFAULT_ADDRESS: "DEFAULT_ADDRESS",
  NEW_ADDRESS: "NEW_ADDRESS",
} as const;

export const SHIPPING_MESSAGES = {
  LEAVE_AT_DOOR: "LEAVE_AT_DOOR",
  DIRECT_HANDOFF: "DIRECT_HANDOFF",
  LEAVE_WITH_CONCIERGE: "LEAVE_WITH_CONCIERGE",
  CONTACT_BEFORE_DELIVERY: "CONTACT_BEFORE_DELIVERY",
  CUSTOM: "CUSTOM",
} as const;
