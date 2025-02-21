import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client } from "@aws-sdk/client-s3";
import type { NextRequest } from "next/server";
import { CreateResponseApiError, CreateResponseApiSuccess } from "@/lib/utils";
import { cache } from "@/lib/cache";
import { CreateRateLimit } from "@/lib/rateLimit";

const ACCOUNT_ID = process.env.ACCOUNT_ID!;
const ACCESS_KEY_ID = process.env.ACCESS_KEY_ID!;
const SECRET_ACCESS_KEY = process.env.SECRET_ACCESS_KEY!;

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

  // Get url from cache
  const cachedUrl = cache.get("avatar-url-" + filename);
  if (cachedUrl) {
    return CreateResponseApiSuccess(cachedUrl);
  }

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

    // Cache the url for 600 seconds
    cache.set("avatar-url-" + filename, url, 600 * 1000);

    return CreateResponseApiSuccess(url);
  } catch (error) {
    if (error instanceof Error) {
      return CreateResponseApiError(error);
    }
    return CreateResponseApiError(new Error("Unknown error"));
  }
}

// Get Pre-Signed URL for Upload
export async function POST(request: NextRequest) {
  // Rate limit
  const rateLimitResponse = CreateRateLimit(request, {
    interval: 60000, // 60 seconds
    maxRequests: 5,
  });
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  // Get file from request
  const formData = await request.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return CreateResponseApiError(new Error("No file found"), 400);
  }

  // Check for file type
  if (!file.type.startsWith("image/")) {
    return CreateResponseApiError(new Error("Invalid file type"), 400);
  }

  // Check for file size
  // Max file size is 2MB
  if (file.size > 1024 * 1024 * 2) {
    return CreateResponseApiError(new Error("File too large"), 400);
  }

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

    return CreateResponseApiSuccess(filename);
  } catch (error) {
    if (error instanceof Error) {
      return CreateResponseApiError(error);
    }
    return CreateResponseApiError(new Error("Unknown error"));
  }
}
