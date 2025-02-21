import { cache } from "@/lib/cache";
import { createClient } from "@/lib/supabase/server";
import { CreateResponseApiError, CreateResponseApiSuccess } from "@/lib/utils";

export const runtime = "edge";

export async function GET() {
  // Get roles from cache
  const cachedRoles = cache.get("roles");
  if (cachedRoles) {
    return CreateResponseApiSuccess(cachedRoles);
  }

  const supabase = await createClient();
  const { data, error } = await supabase.from("roles").select("id,name");
  if (error) {
    return CreateResponseApiError(error, 500);
  }
  if (data.length === 0) {
    return CreateResponseApiError(new Error("No roles found"), 404);
  }

  // Cache the roles for 600 seconds
  cache.set("roles", data, 600 * 1000);

  return CreateResponseApiSuccess(data);
}
