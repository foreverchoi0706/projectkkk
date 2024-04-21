import { NextRequest, NextResponse } from "next/server";

export const GET = async () => {
  return fetch("http://projectkkk.com/api/member/FindAllMember")
    .then((response) => response.json())
    .then((jsonResponse) => NextResponse.json(jsonResponse))
    .catch((reason) => NextResponse.json(reason));
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
