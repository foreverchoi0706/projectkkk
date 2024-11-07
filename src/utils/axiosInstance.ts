import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/utils/constants";
import { deleteCookie, getCookie, hasCookie } from "@/utils/cookie";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development" ? "/api" : "https://34.64.87.216/api/",
});

axiosInstance.interceptors.request.use((config) => {
  if (hasCookie(ACCESS_TOKEN))
    config.headers.set("Authorization", `Bearer ${getCookie(ACCESS_TOKEN)}`);
  return config;
});

axiosInstance.interceptors.response.use(
  (value) => value,
  async (error) => {
    const { config, response } = error;
    if (config.url.includes("/auth/verify")) {
      alert("로그아웃 되었습니다");
      deleteCookie(ACCESS_TOKEN);
      deleteCookie(REFRESH_TOKEN);
      location.replace("/signIn");
    }
    return Promise.reject(response.data);
  },
);

export default axiosInstance;
