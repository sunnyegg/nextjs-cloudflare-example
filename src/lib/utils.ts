import { clsx, type ClassValue } from "clsx";
import { NextResponse } from "next/server";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function CreateResponseApiSuccess<T>(data: T, status?: number) {
  return NextResponse.json(
    {
      data,
      status: status || 200,
      isError: false,
    },
    { status: status || 200 }
  );
}

export function CreateResponseApiError(error: Error, status?: number) {
  const isDev = process.env.NODE_ENV === "development";
  console.error(error);
  return NextResponse.json(
    {
      error: {
        message: error.message,
        stack: isDev ? error.stack : undefined,
        name: error.name,
      },
      status: status || 500,
      isError: true,
    },
    {
      status: status || 500,
    }
  );
}
