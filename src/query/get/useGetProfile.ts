import { useQuery } from "@tanstack/react-query";

export default function useGetProfile() {
  return useQuery({
    queryKey: ["getProfile"],
    queryFn: async () => {
      const response = await fetch("/api/profile");
      const data = await response.json();
      if (!response.ok) {
        throw data;
      }
      return data as {
        role_id: string;
        full_name: string;
        avatar_url: string;
      };
    },
  });
}
