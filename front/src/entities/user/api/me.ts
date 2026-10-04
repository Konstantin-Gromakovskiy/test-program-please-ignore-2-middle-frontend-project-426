import { queryOptions } from "@tanstack/react-query";
import { type UserDto, me, meQueryKey } from "@/shared/api";

export const meQueryOptions = () =>
  queryOptions({
    queryKey: meQueryKey(),

    queryFn: async (): Promise<UserDto | null> => {
      const { data, error } = await me();
      if (error) {
        if (error.status === 401) return null;
        throw error;
      }
      return data;
    },
  });
