import { keepPreviousData } from '@tanstack/react-query';
import apiClient from '@/lib/ApiClient';
import { useQuery } from '@/hooks/UseQueryWithToast';
import { AdminListResponse } from '@/components/Dashboard/EntityListPage/types';

interface UseAdminListParams {
  apiRoute: (params: string) => string;
  entityType: string;
  page: number;
  pageSize: number;
  search: string;
}

export function useAdminList<T>({
  apiRoute,
  entityType,
  page,
  pageSize,
  search,
}: UseAdminListParams) {
  return useQuery<AdminListResponse<T>>({
    queryKey: [entityType, 'admin-list', page, pageSize, search],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
        search,
        sort: 'createdAt',
        direction: 'desc',
      });
      const res = await apiClient.get(apiRoute(params.toString()));
      return res.data;
    },
    placeholderData: keepPreviousData,
    errorMessage: `Failed to load ${entityType} list`,
  });
}
