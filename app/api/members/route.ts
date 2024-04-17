import { NextResponse } from "next/server";

export const GET = async () => {
  return fetch("http://projectkkk.com/api/member/FindAllMember")
    .then((response) => response.json())
    .then((jsonResponse) => NextResponse.json(jsonResponse))
    .catch((reason) => NextResponse.json(reason));
};