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
  /** Optional extra "create" action shown next to the primary create button. */
  secondaryCreate?: { label: string; path: string };
  editPath: (id: string) => string;
  /**
   * Optional per-row edit path override. When provided, its return value is used
   * instead of editPath — e.g. to route game-less aggregate lines to a different
   * editor. Falls back to editPath when it returns undefined.
   */
  editPathFor?: (row: T) => string | undefined;
  deleteApiRoute: (id: string) => string;
  deleteLabel: (row: T) => string;
}
