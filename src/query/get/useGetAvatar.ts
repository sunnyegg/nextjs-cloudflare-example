import { ResponseApiError, ResponseApiSuccess } from "@/types/responses";
import { useQuery } from "@tanstack/react-query";

type ResponseApi = ResponseApiSuccess<string> | ResponseApiError;

export default function useGetAvatar(filename: string) {
  return useQuery({
    queryKey: ["getAvatar", filename],
    queryFn: async () => {
      const response = await fetch("/api/profile/avatar?filename=" + filename);
      const data = (await response.json()) as ResponseApi;

      if (data.isError) {
        throw data.error;
      }

      return data.data;
    },
    enabled: !!filename,
  });
}
