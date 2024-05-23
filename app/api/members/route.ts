import { NextRequest, NextResponse } from "next/server";

import fetcher from "@/app/_utils/fetcher";
import { Product } from "@/app/_utils/types";

export const GET = async (request: NextRequest) => {
  console.log(`/member/FindAllMember${request.nextUrl.search}`);
  const response = await fetcher.get<Product[]>(
    `/member/FindAllMember${request.nextUrl.search}`,
  );
  return NextResponse.json(response);
};

export const POST = async (nextRequest: NextRequest) => {
  const body = await nextRequest.json();
  return fetch("http://projectkkk.com/api/member/Join", {
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  })
    .then((response) => response.json())
    .then((jsonResponse) => NextResponse.json(jsonResponse))
    .catch((reason) => NextResponse.json(reason));
};
