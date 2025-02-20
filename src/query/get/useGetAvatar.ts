import { useQuery } from "@tanstack/react-query";

export default function useGetAvatar(filename: string) {
  return useQuery({
    queryKey: ["getAvatar", filename],
    queryFn: async () => {
      const response = await fetch("/api/profile/avatar?filename=" + filename);
      const data = await response.json();
      if (!response.ok) {
        throw data;
      }
      return data as {
        url: string;
      };
    },
    enabled: !!filename,
  });
}
