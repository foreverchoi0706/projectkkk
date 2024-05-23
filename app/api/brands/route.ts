import { NextResponse } from "next/server";

import fetcher from "@/app/_utils/fetcher";

export const GET = async () => {
  const response = await fetcher.get<string[]>(
    "/product/brandList?page=0&size=100&sort=id",
  );
  return NextResponse.json(response);
};
