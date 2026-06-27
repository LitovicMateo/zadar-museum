import { ReactNode } from 'react';

export interface AdminColumnDef<T> {
  header: string;
  cell: (row: T) => ReactNode;
  className?: string;
}

export interface AdminListResponse<T> {
  data: T[];
  meta: { total: number; page: number; pageSize: number };
}

export interface EntityListConfig<T extends { documentId: string }> {
  title: string;
  entityType: string;
  apiRoute: (params: string) => string;
  columns: AdminColumnDef<T>[];
  searchPlaceholder: string;
  createPath: string;
  editPath: (id: string) => string;
  deleteApiRoute: (id: string) => string;
  deleteLabel: (row: T) => string;
}
