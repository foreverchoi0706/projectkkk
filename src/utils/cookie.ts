export interface CookieOptions {
  expires?: Date;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: "strict" | "lax" | "none";
  httpOnly?: boolean;
}

export const setCookie = (name: string, value: string, options?: CookieOptions) => {
  document.cookie = `${name}=${value}; ${options ? serializeOptions(options) : ""}`;
};

export const getCookie = (name: string) => {
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.split("=");
    if (cookieName.trim() === name) {
      return cookieValue.trim();
    }
  }
  return null;
};

export const deleteCookie = (name: string) => {
  setCookie(name, "", { expires: new Date(0), path: "/admin" });
  setCookie(name, "", { expires: new Date(0), path: "/" });
};

export const hasCookie = (name: string) => {
  return getCookie(name) !== null;
};

const serializeOptions = (options: CookieOptions): string => {
  const parts: string[] = [];
  if (options.expires) {
    parts.push(`expires=${options.expires.toUTCString()}`);
  }
  if (options.path) {
    parts.push(`path=${options.path}`);
  }
  if (options.domain) {
    parts.push(`domain=${options.domain}`);
  }
  if (options.secure) {
    parts.push("secure");
  }
  if (options.sameSite) {
    parts.push(`sameSite=${options.sameSite}`);
  }
  return parts.join("; ");
};
