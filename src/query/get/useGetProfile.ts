import { GetProfile } from "@/types/profiles";
import { ResponseApiError, ResponseApiSuccess } from "@/types/responses";
import { useQuery } from "@tanstack/react-query";

type ResponseApi = ResponseApiSuccess<GetProfile> | ResponseApiError;

export default function useGetProfile() {
  return useQuery({
    queryKey: ["getProfile"],
    queryFn: async () => {
      const response = await fetch("/api/profile");
      const data = (await response.json()) as ResponseApi;

      if (data.isError) {
        throw data.error;
      }

      return data.data;
    },
  });
}
