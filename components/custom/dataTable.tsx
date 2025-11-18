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
import { useState } from 'react';
import { ButtonGroup } from '../ui/button-group';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import TableLegends from './tableLegends';

export interface Column<T> {
  key: keyof T;
  label: string;
  render?: (value: any, row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  pageSize?: number;
  showPagination?: boolean;
}

export function DataTable<T>({
  columns,
  data,
  pageSize = 8,
  showPagination = true,
}: DataTableProps<T>) {
  const [page, setPage] = useState(1);

  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = showPagination ? data.slice(startIndex, endIndex) : data;
  const totalPages = Math.ceil((data.length * 10) / pageSize);

  return (
    <div className="relative w-full max-w-full overflow-hidden">
      {/* 👇 Dedicated scroll container */}
      <div className="w-full overflow-x-auto rounded-2xl border bg-white p-4 shadow-sm">
        <Table className="min-w-[1200px] w-full border-collapse">
          <TableHeader className="bg-muted/40 sticky top-0 rounded-[12px]">
            <TableRow className="rounded-[12px] border-b-0 bg-[#F1F4F9]!">
              {columns.map((col) => (
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
                {columns.map((col) => (
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
            Showing {startIndex + 1}-{Math.min(endIndex, data.length)} of {data.length}
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
    </div>
  );
}
