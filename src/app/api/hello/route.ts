import { NextRequest } from "next/server";
import { getRequestContext } from "@cloudflare/next-on-pages";

export const runtime = "edge";

export async function GET() {
  return new Response("OK");
}

export async function PUT(request: NextRequest) {
  const env = getRequestContext().env;
  const key = "TESTING";
  await env.MY_BUCKET.put(key, request.body);
  return new Response(`PUT ${key} success`, { status: 200 });
}
