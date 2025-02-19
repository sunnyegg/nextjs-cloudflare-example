import { createClient } from "@/lib/supabase/server";

export const runtime = "edge";

export async function GET() {
  const supabase = await createClient();
  const { data: userSession, error } = await supabase.auth.getUser();
  if (error) {
    return new Response(JSON.stringify(error), {
      status: error.status,
    });
  }
  const profileData = await supabase
    .from("profiles")
    .select("role_id,full_name,avatar_url")
    .eq("id", userSession.user.id);

  if (profileData.error) {
    return new Response(JSON.stringify(profileData.error), {
      status: 500,
    });
  }

  if (profileData.data.length === 0) {
    return new Response(JSON.stringify({}), {
      status: 404,
    });
  }

  const outputData = profileData.data[0];

  return new Response(JSON.stringify(outputData));
}
