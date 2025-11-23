'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useMemo, useState } from 'react';
import { ButtonGroup } from '../ui/button-group';
import { ChevronLeftIcon, ChevronRightIcon, Download, Edit, Trash2 } from 'lucide-react';
import TableLegends from './tableLegends';
import { useProjectsQuery } from '@/graphql/queries/project.generated';
import { Project } from '@/types';
import { useRouter } from 'next/navigation';
import { downloadPdf } from '@/lib/fetcher';
import CommonModal from './CommonModal';
import { useDeleteProjectMutation } from '@/graphql/mutations/project.generated';
import { notify } from '@/lib/utils';
import { ALERT_TYPES } from '@/constants';
import PrimaryButton from './PrimaryButton';

export interface Column<T> {
  key: keyof T;
  label: string;
  render?: (value: any, row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<Project>[];
  pageSize?: number;
  showPagination?: boolean;
}

export function DataTable<T>({ columns, pageSize = 10, showPagination = true }: DataTableProps<T>) {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { data, isLoading } = useProjectsQuery({
    pagination: {
      page,
      pageSize,
    },
  });

  const { mutateAsync } = useDeleteProjectMutation();

  const { paginatedData, startIndex, endIndex, totalData, totalPages } = useMemo(() => {
    const pageInfo = data?.projects_connection?.pageInfo;

    const page = pageInfo?.page ?? 1;
    const pageSize = pageInfo?.pageSize ?? 10;
    const total = pageInfo?.total ?? 0;

    const startIndex = (page - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, total);

    return {
      paginatedData: data?.projects_connection?.nodes ?? [],
      startIndex,
      endIndex,
      totalData: total,
      totalPages: pageInfo?.pageCount ?? 1,
    };
  }, [data]);

  const openDeleteModal = (project: Project) => {
    setSelectedProject(project);
    setShowDeleteModal(true);
  };

  const handleDeleteProject = () => {
    if (!selectedProject) return;

    setDeleteLoading(true);

    mutateAsync({ documentId: selectedProject.documentId })
      .then(() => {
        setShowDeleteModal(false);
        setSelectedProject(null);
        notify('Project deleted successfully');
      })
      .catch((error) => {
        notify(error.message, ALERT_TYPES.error);
      })
      .finally(() => {
        setDeleteLoading(false);
      });
  };

  const actionColumn = {
    key: 'actions' as any,
    label: 'Actions',
    render: (_: any, row: Project) => (
      <ButtonGroup className="flex gap-0">
        <Button
          size="icon"
          variant="outline"
          onClick={() => {
            router.push('/projects/update/' + row.documentId);
          }}
        >
          <Edit className="h-4 w-4" />
        </Button>

        <Button size="icon" variant="outline" onClick={() => downloadPdf(row)}>
          <Download className="h-4 w-4" />
        </Button>

        <Button
          size="icon"
          variant="outline"
          className="text-red-500 hover:text-red-600"
          onClick={() => openDeleteModal(row)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </ButtonGroup>
    ),
  };

  const allColumns: Column<Project>[] = [...columns, actionColumn];

  return (
    <div className="relative w-full max-w-full overflow-hidden">
      {/* 👇 Dedicated scroll container */}
      <div className="w-full overflow-x-auto rounded-2xl border bg-white p-4 shadow-sm">
        <Table className="w-full min-w-[1200px] border-collapse">
          <TableHeader className="bg-muted/40 sticky top-0 rounded-[12px]">
            <TableRow className="rounded-[12px] border-b-0 bg-[#F1F4F9]!">
              {allColumns.map((col) => (
                <TableHead
                  key={String(col.key)}
                  className="text-sm font-medium whitespace-nowrap text-gray-600"
                >
                  {col.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((row, i) => (
              <TableRow key={i} className="py-2!">
                {allColumns.map((col) => (
                  <TableCell
                    key={String(col.key)}
                    className="text-sm whitespace-nowrap text-gray-700"
                  >
                    {col.render ? col.render(row[col.key], row) : String(row[col.key])}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {showPagination && totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
          <span>
            Showing {startIndex + 1}-{endIndex} of {totalData}
          </span>
          <ButtonGroup className="">
            <Button
              variant="outline"
              size="icon"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeftIcon />
            </Button>
            <Button
              variant="outline"
              size="icon"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRightIcon />
            </Button>
          </ButtonGroup>
        </div>
      )}

      <TableLegends />

      <CommonModal open={showDeleteModal} setOpen={setShowDeleteModal} title="Delete Project">
        <div className="space-y-4">
          <p className="text-primary text-sm">
            Are you sure you want to delete the project {selectedProject?.permit_no}?
          </p>

          <div className="flex w-full gap-2">
            <Button
              className="flex-1"
              type="button"
              variant={'outline'}
              disabled={isLoading}
              onClick={() => {
                setShowDeleteModal(false);
              }}
            >
              Cancel
            </Button>

            <PrimaryButton
              className="bg-secondary hover:bg-secondary h-9 flex-1 rounded-md hover:opacity-85"
              onClick={handleDeleteProject}
              label="Yes"
              isLoading={deleteLoading}
              type="button"
              disabled={isLoading}
            />
          </div>
        </div>
      </CommonModal>
    </div>
  );
}
