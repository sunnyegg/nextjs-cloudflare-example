import { ResponseApiError, ResponseApiSuccess } from "@/types/responses";
import { GetRole } from "@/types/roles";
import { useQuery } from "@tanstack/react-query";

interface useGetRolesProps {
  enabled: boolean;
}

type ResponseApi = ResponseApiSuccess<GetRole[]> | ResponseApiError;

export default function useGetRoles(props: useGetRolesProps) {
  const { enabled } = props;

  return useQuery({
    queryKey: ["getRoles"],
    queryFn: async () => {
      const response = await fetch("/api/roles");
      const data = (await response.json()) as ResponseApi;

      if (data.isError) {
        throw data.error;
      }

      return data.data;
    },
    enabled,
  });
}
