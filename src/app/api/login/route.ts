import { createClient } from "@/lib/supabase/server";
import { Provider } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { provider: string };
  if (!body) {
    return new Response(JSON.stringify({}), {
      status: 400,
    });
  }
  if (!body.provider) {
    return new Response(JSON.stringify({}), {
      status: 400,
    });
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: body.provider as Provider,
    options: {
      redirectTo: "http://localhost:3000/api/auth/callback",
    },
  });
  if (error) {
    return new Response(JSON.stringify(error), {
      status: error.status,
    });
  }

  revalidatePath("/", "layout");

  return new Response(JSON.stringify(data), {
    status: 200,
  });
}
