import supabase from "@/service/supabase";
import { useQuery } from "@tanstack/react-query";

export default function useGetUser() {
  return useQuery({
    queryKey: ["getUser"],
    queryFn: async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        throw error;
      }
      return data;
    },
  });
}
