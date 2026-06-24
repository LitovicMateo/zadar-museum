import apiClient from '@/lib/ApiClient';
import { API_ROUTES } from '@/constants/Routes';

export const deletePlayer = (id: string): Promise<void> =>
  apiClient.delete(API_ROUTES.delete.player(id));
