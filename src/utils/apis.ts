import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://projectkkk.com/api",
});

export const getProducts = async () => {
  const { data } = await axiosInstance.get("/product/FindAllProduct");
  return data;
};
