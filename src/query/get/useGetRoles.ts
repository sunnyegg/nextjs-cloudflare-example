import { useQuery } from "@tanstack/react-query";

interface useGetRolesProps {
  enabled: boolean;
}

export default function useGetRoles(props: useGetRolesProps) {
  const { enabled } = props;

  return useQuery({
    queryKey: ["getRoles"],
    queryFn: async () => {
      const response = await fetch("/api/roles");
      const data = await response.json();
      if (!response.ok) {
        throw data;
      }
      return data as [
        {
          id: string;
          name: string;
        }
      ];
    },
    enabled,
  });
}
