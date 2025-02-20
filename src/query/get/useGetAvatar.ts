import { useQuery } from "@tanstack/react-query";

export default function useGetAvatar(filename: string) {
  return useQuery({
    queryKey: ["getAvatar", filename],
    queryFn: async () => {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL;
      const pathName = "/api/profile/avatar?filename=" + filename;
      const response = await fetch(appUrl + pathName);
      const data = await response.json();
      if (!response.ok) {
        throw data;
      }
      return appUrl + pathName;
    },
    enabled: !!filename,
  });
}
