import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useApiMutation } from "./use-mutation";

export const useGetMutation = (key, url, params = {}, options = {}) => {
  const { trigger } = useApiMutation();
  const queryClient = useQueryClient();

  const buildUrl = (baseUrl, extraParams = {}) => {
    const hasQuery = baseUrl.includes("?");
    const connector = hasQuery ? "&" : "?";
    const searchParams = new URLSearchParams(extraParams).toString();
    return `${baseUrl}${searchParams ? `${connector}${searchParams}` : ""}`;
  };

  const query = useQuery({
    queryKey: [key, params],
    queryFn: async () => {
      const finalUrl = buildUrl(url, params);
      const response = await trigger({ url: finalUrl });
      return response || [];
    },
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
    ...options,
  });

  const prefetchPage = async (extraParams) => {
    const finalUrl = buildUrl(url, { ...params, ...extraParams });

    await queryClient.prefetchQuery({
      queryKey: [key, { ...params, ...extraParams }],
      queryFn: async () => {
        const response = await trigger({ url: finalUrl });
        return response || [];
      },
      staleTime: 5 * 60 * 1000,
    });
  };

  return { ...query, prefetchPage };
};
