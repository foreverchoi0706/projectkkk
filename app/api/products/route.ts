import { NextRequest, NextResponse } from "next/server";

import fetcher from "@/app/_utils/fetcher";
import { Product } from "@/app/_utils/types";

export const GET = async (request: NextRequest) => {
  const response = await fetcher.get<Product[]>(
    `/product/FindAllProduct${request.nextUrl.search}`,
  );
  return NextResponse.json(response);
};

export const POST = async (request: NextRequest) => {
  console.log("dsaddsa");
  const json = await request.json();
  console.log(json);
  const response = await fetcher.post<Product, Product>(
    "/product/CreateProduct",
    json,
  );
  return NextResponse.json(response);
};
