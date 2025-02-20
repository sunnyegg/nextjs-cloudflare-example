import { useMutation } from "@tanstack/react-query";

export default function useUploadAvatar() {
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        "/api/profile/avatar?filename=" + file.name,
        {
          method: "PUT",
          body: formData,
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw data;
      }
      return data as {
        status: string;
      };
    },
  });
}
