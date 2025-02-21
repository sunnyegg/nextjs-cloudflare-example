import { UpdateProfileRequest } from "@/types/profiles";
import { ResponseApiError, ResponseApiSuccess } from "@/types/responses";
import { useMutation } from "@tanstack/react-query";

type ResponseApi = ResponseApiSuccess<UpdateProfileRequest> | ResponseApiError;

export default function useUpdateProfile() {
  return useMutation({
    mutationFn: async (payload: UpdateProfileRequest) => {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as ResponseApi;

      if (data.isError) {
        throw data.error;
      }

      return data.data;
    },
  });
}
