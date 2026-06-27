import apiClient from '@/lib/ApiClient';
import { API_ROUTES } from '@/constants/Routes';

export const deleteStaff = (id: string): Promise<void> =>
  apiClient.delete(API_ROUTES.delete.staff(id));
