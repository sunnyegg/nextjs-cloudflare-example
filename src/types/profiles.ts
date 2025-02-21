export type Profile = {
  id: string;
  role_id: string;
  full_name: string;
  avatar_url: string;
  created_at: string;
  updated_at: string;
};

export type GetProfile = {
  role_id: string;
  full_name: string;
  avatar_url: string;
};

export type UpdateProfileRequest = GetProfile;
