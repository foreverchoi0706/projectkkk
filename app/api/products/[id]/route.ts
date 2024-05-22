import { NextResponse } from "next/server";

import fetcher from "@/app/_utils/fetcher";
import { Product } from "@/app/_utils/types";

export const GET = async () => {
  const response = await fetcher.get<Product[]>(
    "/product/DetailProduct?productName=a",
  );
  return NextResponse.json(response);
};
