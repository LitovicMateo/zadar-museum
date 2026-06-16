import apiClient from '@/lib/ApiClient';
import { API_ROUTES } from '@/constants/Routes';

export const deleteVenue = (id: string): Promise<void> =>
  apiClient.delete(API_ROUTES.delete.venue(id));
