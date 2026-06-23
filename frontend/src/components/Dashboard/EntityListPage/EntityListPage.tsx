import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Pencil, Trash2 } from 'lucide-react';

import apiClient from '@/lib/ApiClient';
import { useAdminList } from '@/hooks/queries/dashboard/UseAdminList';
import Button from '@/components/UI/Button';
import { Input } from '@/components/UI/Input';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { EntityListConfig } from './types';

const PAGE_SIZE = 20;

interface EntityListPageProps<T extends { documentId: string }> {
  config: EntityListConfig<T>;
}

export function EntityListPage<T extends { documentId: string }>({
  config,
}: EntityListPageProps<T>) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<T | null>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  const { data, isPending, isFetching } = useAdminList<T>({
    apiRoute: config.apiRoute,
    entityType: config.entityType,
    page,
    pageSize: PAGE_SIZE,
    search: debouncedSearch,
  });

  const deleteMutation = useMutation({
    mutationFn: (row: T) => apiClient.delete(config.deleteApiRoute(row.documentId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [config.entityType, 'admin-list'] });
      toast.success('Deleted successfully');
      setDeleteTarget(null);
    },
    onError: (err: Error) => {
      toast.error(`Delete failed: ${err.message}`);
      setDeleteTarget(null);
    },
  });

  const items = data?.data ?? [];
  const total = data?.meta.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const from = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, total);

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-100">{config.title}</h1>
          <p className="text-sm text-slate-500">{total} total</p>
        </div>
        <Button onClick={() => navigate(config.createPath)}>
          + Create new {config.title.replace(/s$/, '')}
        </Button>
      </div>

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <Input
          placeholder={config.searchPlaceholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <div className="flex items-center gap-2 text-sm text-slate-400 whitespace-nowrap">
          <span className="text-slate-500">Showing {from}–{to} of {total}</span>
          <Button variant="outline" size="sm" onClick={() => setPage((p) => p - 1)} disabled={page <= 1 || isFetching}>
            ← Prev
          </Button>
          <span className="font-semibold text-slate-200">{page} / {totalPages}</span>
          <Button variant="outline" size="sm" onClick={() => setPage((p) => p + 1)} disabled={page >= totalPages || isFetching}>
            Next →
          </Button>
        </div>
      </div>

      <Table className={isFetching ? 'opacity-60 transition-opacity' : ''}>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10">#</TableHead>
            {config.columns.map((col) => (
              <TableHead key={col.header} className={col.className}>
                {col.header}
              </TableHead>
            ))}
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isPending && (
            <TableRow>
              <TableCell colSpan={config.columns.length + 2} className="text-center text-slate-500 py-8">
                Loading...
              </TableCell>
            </TableRow>
          )}
          {!isPending && items.length === 0 && (
            <TableRow>
              <TableCell colSpan={config.columns.length + 2} className="text-center text-slate-500 py-8">
                No results
              </TableCell>
            </TableRow>
          )}
          {items.map((row, idx) => (
            <TableRow key={row.documentId}>
              <TableCell className="text-slate-500 text-sm">{from + idx}</TableCell>
              {config.columns.map((col) => (
                <TableCell key={col.header} className={col.className}>
                  {col.cell(row)}
                </TableCell>
              ))}
              <TableCell>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" size="sm" onClick={() => navigate(config.editPath(row.documentId))}>
                    <Pencil size={13} className="mr-1" /> Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => setDeleteTarget(row)}>
                    <Trash2 size={13} className="mr-1" /> Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete {deleteTarget ? config.deleteLabel(deleteTarget) : ''}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteTarget && deleteMutation.mutate(deleteTarget)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
