import {
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  Pagination as ShadcnPagination,
} from '@/components/ui/pagination';
import { cn } from '@/lib/utils';
import React from 'react';

export type PaginationProps = {
  currentPage: number;
  totalPages: number;
  perPage: number;
  total: number;
  onPageChange: (page: number) => void;
  className?: string;
};

export default function Pagination({
  currentPage,
  totalPages,
  perPage,
  total,
  onPageChange,
  className,
}: PaginationProps): React.ReactNode {
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push('ellipsis');
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('ellipsis');
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  const from = total === 0 ? 0 : (currentPage - 1) * perPage + 1;
  const to = Math.min(currentPage * perPage, total);

  return (
    <div className={cn('w-full', className)}>
      <div className="flex w-full flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground order-2 sm:order-1">
          <span className="hidden sm:inline">Showing</span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-muted/50 text-foreground font-semibold tabular-nums">
            {from}
            <span className="text-muted-foreground font-normal">-</span>
            {to}
          </span>
          <span className="text-muted-foreground/80">of</span>
          <span className="font-semibold text-foreground tabular-nums">{total}</span>
          <span className="hidden sm:inline text-muted-foreground/80">
            {total === 1 ? 'result' : 'results'}
          </span>
        </div>

        <ShadcnPagination className="w-auto shrink-0 mx-0 order-1 sm:order-2">
          <PaginationContent className="gap-1">
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(currentPage - 1)}
                className={cn(
                  'transition-all duration-200 h-9 px-3',
                  currentPage === 1
                    ? 'pointer-events-none opacity-40'
                    : 'cursor-pointer hover:bg-accent hover:text-accent-foreground hover:scale-105 active:scale-95'
                )}
              />
            </PaginationItem>

            {getPageNumbers().map((page, index) => (
              <PaginationItem key={index}>
                {page === 'ellipsis' ? (
                  <PaginationEllipsis className="text-muted-foreground/60" />
                ) : (
                  <PaginationLink
                    onClick={() => handlePageChange(page)}
                    isActive={currentPage === page}
                    className={cn(
                      'h-9 min-w-[2.25rem] transition-all duration-200 font-medium tabular-nums',
                      currentPage === page
                        ? 'bg-primary text-primary-foreground shadow-sm hover:bg-primary hover:text-primary-foreground scale-105 font-semibold'
                        : 'cursor-pointer hover:bg-accent hover:text-accent-foreground hover:scale-105 active:scale-95'
                    )}
                  >
                    {page}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(currentPage + 1)}
                className={cn(
                  'transition-all duration-200 h-9 px-3',
                  currentPage === totalPages
                    ? 'pointer-events-none opacity-40'
                    : 'cursor-pointer hover:bg-accent hover:text-accent-foreground hover:scale-105 active:scale-95'
                )}
              />
            </PaginationItem>
          </PaginationContent>
        </ShadcnPagination>
      </div>
    </div>
  );
}
