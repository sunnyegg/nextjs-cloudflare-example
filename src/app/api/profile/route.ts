import { createClient } from "@/lib/supabase/server";
import { CreateResponseApiError, CreateResponseApiSuccess } from "@/lib/utils";
import { GetProfile, UpdateProfileRequest } from "@/types/profiles";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET() {
  const supabase = await createClient();
  const { data: userSession, error } = await supabase.auth.getUser();
  if (error) {
    return CreateResponseApiError(error, error.status);
  }
  const profileData = await supabase
    .from("profiles")
    .select("role_id,full_name,avatar_url")
    .eq("id", userSession.user.id);

  if (profileData.error) {
    return CreateResponseApiError(profileData.error, 500);
  }

  if (profileData.data.length === 0) {
    return CreateResponseApiError(new Error("Profile not found"), 404);
  }

  const outputData = profileData.data[0] as GetProfile;

  return CreateResponseApiSuccess(outputData);
}

export async function PUT(request: NextRequest) {
  const body = (await request.json()) as UpdateProfileRequest;
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) {
    return CreateResponseApiError(new Error("Unauthorized"), 401);
  }

  const { error } = await supabase
    .from("profiles")
    .update(body)
    .eq("id", data.user.id);

  if (error) {
    return CreateResponseApiError(error);
  }

  return CreateResponseApiSuccess(body);
}
