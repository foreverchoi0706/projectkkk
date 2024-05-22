import { type Response } from "@/app/_utils/types";

class Fetcher {
  isServer = typeof window === "undefined";
  constructor(private baseUrl: string) {}

  async get<T>(url: string, options?: RequestInit): Promise<Response<T>> {
    const response = await fetch(
      this.isServer ? `${this.baseUrl}${url}` : url,
      {
        headers: {
          "Content-Type": "application/json",
          ...options?.headers,
        },
        ...options,
      },
    );
    const result: Response<T> = await response.json();
    if (result.status > 400) throw new Error(result.ResponseMessage);
    return result;
  }

  async post<T, U = unknown>(
    url: string,
    body?: U extends unknown ? Object : U,
  ): Promise<Response<T>> {
    const response = await fetch(
      this.isServer ? `${this.baseUrl}${url}` : url,
      {
        body: JSON.stringify(body as U),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      },
    );
    const result: Response<T> = await response.json();
    if (result.status >= 400) throw new Error(result.ResponseMessage);
    return result;
  }

  async delete<T, U>(url: string): Promise<Response<T>> {
    const response = await fetch(
      this.isServer ? `${this.baseUrl}${url}` : url,
      {
        headers: {
          "Content-Type": "application/json",
        },
        method: "DELETE",
      },
    );
    const result: Response<T> = await response.json();
    if (result.status >= 400) throw new Error(result.ResponseMessage);
    return result;
  }
}

const fetcher = new Fetcher("http://projectkkk.com/api");
export default fetcher;
