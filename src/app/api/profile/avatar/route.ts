import { getRequestContext } from "@cloudflare/next-on-pages";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client } from "@aws-sdk/client-s3";
import type { NextRequest } from "next/server";

const ACCOUNT_ID = getRequestContext().env.ACCOUNT_ID;
const ACCESS_KEY_ID = getRequestContext().env.ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = getRequestContext().env.SECRET_ACCESS_KEY;

const S3 = new S3Client({
  region: "auto",
  endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
});

export const runtime = "edge";

// Get Pre-Signed URL for Download
export async function GET(request: NextRequest) {
  const filename = request.nextUrl.searchParams.get("filename") as string;
  try {
    const url = await getSignedUrl(
      S3,
      new GetObjectCommand({
        Bucket: "avatars",
        Key: filename,
      }),
      {
        expiresIn: 600,
      }
    );
    return Response.json({ url });
  } catch (error: any) {
    return Response.json({ error: error.message });
  }
}

// Get Pre-Signed URL for Upload
export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file");
  const filename = formData.get("filename")?.toString();

  try {
    const url = await getSignedUrl(
      S3,
      new PutObjectCommand({
        Bucket: "avatars",
        Key: filename,
      }),
      {
        expiresIn: 600,
      }
    );

    // Upload the file to Cloudflare R2
    const uploadRes = await fetch(url, {
      method: "PUT",
      body: file,
    });

    if (!uploadRes.ok) {
      const data = await uploadRes.json();
      throw data;
    }

    return Response.json({ message: "success" });
  } catch (error: any) {
    return Response.json({ error: error.message });
  }
}
