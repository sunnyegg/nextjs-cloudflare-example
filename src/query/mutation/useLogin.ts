import { Login } from "@/types/login";
import { ResponseApiError, ResponseApiSuccess } from "@/types/responses";
import { useMutation } from "@tanstack/react-query";

type ResponseApi = ResponseApiSuccess<Login> | ResponseApiError;

export default function useLogin() {
  return useMutation({
    mutationFn: async (provider: string) => {
      const payload = {
        provider,
      };
      const response = await fetch("/api/login", {
        method: "POST",
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
