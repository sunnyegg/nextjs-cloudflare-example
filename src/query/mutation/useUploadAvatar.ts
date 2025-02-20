import { useMutation } from "@tanstack/react-query";

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
