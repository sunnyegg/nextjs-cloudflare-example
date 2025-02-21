import { createClient } from "@/lib/supabase/server";
import { CreateResponseApiError, CreateResponseApiSuccess } from "@/lib/utils";
import { Provider } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { provider: string };
  if (!body) {
    return CreateResponseApiError(new Error("Invalid request body"), 400);
  }
  if (!body.provider) {
    return CreateResponseApiError(new Error("Invalid provider"), 400);
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: body.provider as Provider,
    options: {
      redirectTo: appUrl + "/api/auth/callback",
    },
  });
  if (error) {
    return CreateResponseApiError(error, error.status);
  }

  revalidatePath("/", "layout");

  return CreateResponseApiSuccess(data);
}
