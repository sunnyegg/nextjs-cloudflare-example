import { useMutation } from "@tanstack/react-query";

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
      const data = await response.json();
      if (!response.ok) {
        throw data;
      }
      return data as {
        provider: string;
        url: string;
      };
    },
  });
}
