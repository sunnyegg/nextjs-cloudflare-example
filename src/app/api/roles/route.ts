import { createClient } from "@/lib/supabase/server";

export const runtime = "edge";

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("roles").select("id,name");
  if (error) {
    return new Response(JSON.stringify(error), {
      status: 500,
    });
  }
  return new Response(JSON.stringify(data));
}
