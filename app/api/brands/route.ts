import { NextResponse } from "next/server";

import fetcher from "@/app/_utils/fetcher";

export const GET = async () => {
  const response = await fetcher.get<string[]>(
    "http://projectkkk.com/api/product/brandList",
  );
  console.log("res:::", response);
  return NextResponse.json(response);
};
