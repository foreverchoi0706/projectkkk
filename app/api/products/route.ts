import { NextRequest, NextResponse } from "next/server";

import fetcher from "@/app/_utils/fetcher";
import { Product } from "@/app/_utils/types";

export const GET = async (request: NextRequest) => {
  const response = await fetcher.get<Product[]>(
    `/product/FindAllProduct${request.nextUrl.search}`,
  );
  return NextResponse.json(response);
};

export const POST = async () => {
  const response = await fetcher.post("/product/CreateProduct");
  return NextResponse.json(response);
};
