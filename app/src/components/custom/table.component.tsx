import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Table as UITable,
} from '@/components/ui/table';
import React from 'react';

export type TableColumn<RowType> = {
  key: keyof RowType | string;
  title: React.ReactNode;
  render?: (value: RowType[keyof RowType], row: RowType, rowIndex: number) => React.ReactNode;
  className?: string;
  headerClassName?: string;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
};

export type PaginationMeta = {
  current_page?: number;
  last_page?: number;
  per_page?: number;
  total?: number;
  from?: number | null;
  to?: number | null;
};

export type TableProps<RowType extends Record<string, any>> = {
  columns: Array<TableColumn<RowType>>;
  rows: RowType[];
  rowKey?: (row: RowType, index: number) => React.Key;
  className?: string;
  tableClassName?: string;
  theadClassName?: string;
  tbodyClassName?: string;
  trClassName?: string | ((row: RowType, index: number) => string | undefined);
  emptyState?: React.ReactNode;
  striped?: boolean;
  hoverable?: boolean;
  compact?: boolean;
  // Pagination props
  pagination?: PaginationMeta;
  onPageChange?: (page: number) => void;
  itemsPerPage?: number;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  showPagination?: boolean;
  onClickRow?: (row: RowType, index: number) => void;
  loading?: boolean;
};

function normalizeKeyPath(keyPath: string): Array<string | number> {
  if (!keyPath) return [];
  const dotted = keyPath.replace(/\[(\d+)\]/g, '.$1').replace(/\[("|'|`)([^"'`]+)\1\]/g, '.$2');
  return dotted
    .split('.')
    .filter(Boolean)
    .map((segment) => {
      if (/^\d+$/.test(segment)) return Number(segment);
      return segment;
    });
}

export function getValueByKeyPath<TRecord extends Record<string, any>>(
  record: TRecord,
  keyPath: string
): unknown {
  if (!record || !keyPath) return undefined;
  const segments = normalizeKeyPath(keyPath);
  let current: any = record;
  for (const segment of segments) {
    if (current == null) return undefined;
    current = current[segment as any];
  }
  return current;
}

export default function Table<RowType extends Record<string, any>>({
  columns,
  rows,
  rowKey,
  className,
  tableClassName,
  theadClassName,
  tbodyClassName,
  trClassName,
  emptyState,
  striped = false,
  hoverable = true,
  compact = false,
  pagination,
  onPageChange,
  showPagination = false,
  onClickRow = undefined,
  loading = false,
}: TableProps<RowType>) {
  const getRowKey = React.useCallback(
    (row: RowType, index: number): React.Key => {
      if (rowKey) return rowKey(row, index);
      const firstColKey = columns[0]?.key ?? '__index__';
      const firstVal =
        firstColKey === '__index__' ? index : getValueByKeyPath(row, firstColKey as string);
      return `${String(firstVal)}-${index}`;
    },
    [rowKey, columns]
  );

  const renderCell = React.useCallback(
    (column: TableColumn<RowType>, row: RowType, rowIndex: number) => {
      const rawValue = getValueByKeyPath(row, column.key as string);
      if (typeof column.render === 'function') {
        return column.render(rawValue as RowType[keyof RowType], row, rowIndex);
      }
      if (rawValue == null) return <span className="text-muted-foreground">—</span>;
      if (typeof rawValue === 'object')
        return (
          <code className="text-xs bg-muted px-1 py-0.5 rounded">{JSON.stringify(rawValue)}</code>
        );
      return String(rawValue);
    },
    []
  );

  const getRowClassName = (row: RowType, rowIndex: number) => {
    const baseClasses = [
      'transition-colors duration-150',
      hoverable && 'hover:bg-muted/50',
      striped && rowIndex % 2 === 1 && 'bg-muted/30',
    ].filter(Boolean);

    const customClass =
      typeof trClassName === 'function' ? trClassName(row, rowIndex) : trClassName;

    return [...baseClasses, customClass].filter(Boolean).join(' ');
  };

  const renderSkeletonRows = () => {
    const skeletonRowCount = pagination?.per_page || 10;
    return Array.from({ length: skeletonRowCount }).map((_, rowIndex) => (
      <TableRow key={`skeleton-row-${rowIndex}`}>
        {columns.map((col, colIndex) => (
          <TableCell
            key={`skeleton-cell-${rowIndex}-${colIndex}`}
            className={`
              ${compact ? 'px-3 py-2' : 'px-4 py-3'}
              ${col.className || ''}
            `}
          >
            <Skeleton className="h-5 w-full" />
          </TableCell>
        ))}
      </TableRow>
    ));
  };

  const renderPagination = () => {
    const {
      current_page = 1,
      last_page = 1,
      total = 0,
    } = pagination ?? {
      current_page: 1,
      last_page: 1,
      total: 0,
    };
    const currentPage = current_page;
    const totalPages = last_page;

    // Don't show pagination if showPagination is false
    if (!showPagination) return null;

    const getVisiblePages = () => {
      // If there's only one page, just return that page
      if (totalPages <= 1) {
        return [1];
      }

      const delta = 2;
      const range = [];
      const rangeWithDots = [];

      for (
        let i = Math.max(2, currentPage - delta);
        i <= Math.min(totalPages - 1, currentPage + delta);
        i++
      ) {
        range.push(i);
      }

      if (currentPage - delta > 2) {
        rangeWithDots.push(1, '...');
      } else {
        rangeWithDots.push(1);
      }

      rangeWithDots.push(...range);

      if (currentPage + delta < totalPages - 1) {
        rangeWithDots.push('...', totalPages);
      } else if (totalPages > 1) {
        rangeWithDots.push(totalPages);
      }

      return rangeWithDots;
    };

    const visiblePages = getVisiblePages();

    return (
      <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-background/50">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {loading ? (
            <Skeleton className="h-5 w-48" />
          ) : (
            <span>
              Showing {pagination?.from || 0} to {pagination?.to || 0} of {total} results
            </span>
          )}
        </div>
        <div className="flex items-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1 && !loading) {
                      onPageChange?.(currentPage - 1);
                    }
                  }}
                  className={
                    currentPage <= 1 || loading
                      ? 'pointer-events-none opacity-50'
                      : 'cursor-pointer'
                  }
                  href="#"
                />
              </PaginationItem>
              {visiblePages.map((page, index) => (
                <PaginationItem key={index}>
                  {page === '...' ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      onClick={(e) => {
                        e.preventDefault();
                        if (!loading) {
                          onPageChange?.(page as number);
                        }
                      }}
                      isActive={currentPage === page}
                      className={
                        loading
                          ? 'pointer-events-none opacity-50 cursor-not-allowed'
                          : 'cursor-pointer'
                      }
                      href="#"
                    >
                      {page}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages && !loading) {
                      onPageChange?.(currentPage + 1);
                    }
                  }}
                  className={
                    currentPage >= totalPages || loading
                      ? 'pointer-events-none opacity-50'
                      : 'cursor-pointer'
                  }
                  href="#"
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    );
  };

  return (
    <div
      role="region"
      aria-label="data table"
      className={`overflow-hidden rounded-xl shadow-md bg-card text-foreground ${className || ''}`}
    >
      <div className="overflow-x-auto">
        <UITable
          className={`w-full ${compact ? 'text-sm' : 'text-[0.95rem]'} ${tableClassName || ''}`}
        >
          <TableHeader className={theadClassName}>
            <TableRow>
              {columns.map((col, idx) => (
                <TableHead
                  key={`th-${idx}-${String(col.key)}`}
                  className={`
                    text-[0.75rem] leading-5 font-medium tracking-wide uppercase text-muted-foreground/90 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60
                    ${compact ? 'px-3 py-2' : 'px-4 py-3'}
                    ${col.headerClassName || ''}
                  `}
                  style={{
                    width: col.width,
                    textAlign: col.align ?? 'left',
                  }}
                >
                  {col.title}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody className={tbodyClassName}>
            {loading ? (
              renderSkeletonRows()
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-36 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-muted text-muted-foreground flex items-center justify-center">
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8V4a1 1 0 00-1-1H7a1 1 0 00-1 1v1m8 0V4.5"
                        />
                      </svg>
                    </div>
                    <div className="text-sm font-medium">{emptyState ?? 'No data available'}</div>
                    <div className="text-xs text-muted-foreground">No records found to display</div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row, rowIndex) => (
                <TableRow
                  key={getRowKey(row, rowIndex)}
                  className={` 
                    !cursor-pointer
                    ${getRowClassName(row, rowIndex)}
                  `}
                  onClick={() => onClickRow?.(row, rowIndex)}
                >
                  {columns.map((col, colIndex) => (
                    <TableCell
                      key={`td-${rowIndex}-${colIndex}`}
                      className={`
                        ${compact ? 'px-3 py-2' : 'px-4 py-3'}
                        ${col.className || ''}
                      `}
                      style={{ textAlign: col.align ?? 'left' }}
                    >
                      {renderCell(col, row, rowIndex)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </UITable>
      </div>
      {renderPagination()}
    </div>
  );
}
