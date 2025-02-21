import { ResponseApiError, ResponseApiSuccess } from "@/types/responses";
import { useMutation } from "@tanstack/react-query";

type ResponseApi = ResponseApiSuccess<string> | ResponseApiError;

export default function useUploadAvatar() {
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("filename", file.name);

      const response = await fetch("/api/profile/avatar", {
        method: "POST",
        body: formData,
      });
      const data = (await response.json()) as ResponseApi;

      if (data.isError) {
        throw data.error;
      }

      return data.data;
    },
  });
}
