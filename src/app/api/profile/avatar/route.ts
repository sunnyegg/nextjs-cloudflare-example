import { getRequestContext } from "@cloudflare/next-on-pages";
import type { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const fileName = request.nextUrl.searchParams.get("filename") as string;
  try {
    const obj = await getRequestContext().env.AVATARS.get(fileName);

    if (obj === null) {
      return new Response("Object  Not Found", { status: 404 });
    }

    return new Response(obj.body);
  } catch (err) {
    console.log(err);
    return Response.json({ status: "error" });
  }
}

export async function PUT(request: NextRequest) {
  const fileName = request.nextUrl.searchParams.get("filename") as string;

  const formData = await request.formData();
  const file = formData.get("file");
  try {
    const res = await getRequestContext().env.AVATARS.put(fileName, file);
    console.log(res);
    return Response.json({ status: "success" });
  } catch (err) {
    console.log(err);
    return Response.json({ status: "error" });
  }
}
