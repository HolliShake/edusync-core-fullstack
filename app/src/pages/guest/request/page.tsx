import { useModal } from '@/components/custom/modal.component';
import TitledPage from '@/components/pages/titled.page';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { PaginationEllipsis, PaginationItem, PaginationLink } from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/context/auth.context';
import RequestDocumentView from '@/views/shared/request-application.view';
import { useGetDocumentRequestPaginated } from '@rest/api';
import { DocumentRequestLogAction, type DocumentRequest } from '@rest/models';
import type React from 'react';
import { useMemo, useState } from 'react';

export default function GuestRequestDocument(): React.ReactNode {
  const { session } = useAuth();
  const documentRequestModal = useModal<DocumentRequest>();
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [viewingStatus, setViewingStatus] = useState<DocumentRequest | null>(null);

  const {
    data: documentRequestResponse,
    isLoading,
    refetch,
  } = useGetDocumentRequestPaginated(
    {
      'filter[user_id]': session?.id ?? 0,
      page: page,
      rows: rowsPerPage,
    },
    {
      query: { enabled: !!session?.id },
    }
  );

  const allDocumentRequests = useMemo(
    () => documentRequestResponse?.data?.data ?? [],
    [documentRequestResponse]
  );

  const totalPages = useMemo(
    () => Math.ceil((documentRequestResponse?.data?.total ?? 0) / rowsPerPage),
    [documentRequestResponse, rowsPerPage]
  );

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<
      string,
      { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }
    > = {
      [DocumentRequestLogAction.submitted]: { variant: 'outline', label: 'Submitted' },
      [DocumentRequestLogAction.processing]: { variant: 'secondary', label: 'Processing' },
      [DocumentRequestLogAction.completed]: { variant: 'default', label: 'Completed' },
      [DocumentRequestLogAction.rejected]: { variant: 'destructive', label: 'Rejected' },
      [DocumentRequestLogAction.cancelled]: { variant: 'destructive', label: 'Cancelled' },
      [DocumentRequestLogAction.pickup]: { variant: 'secondary', label: 'Ready for Pickup' },
    };

    const config = statusConfig[status?.toLowerCase()] || { variant: 'outline', label: status };
    return (
      <Badge variant={config.variant} className="text-xs px-2 py-0">
        {config.label}
      </Badge>
    );
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleModalSubmit = () => {
    refetch();
  };

  const handleViewStatus = (request: DocumentRequest) => {
    setViewingStatus(request);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (value: string) => {
    setRowsPerPage(Number(value));
    setPage(1);
  };

  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      items.push(
        <PaginationItem key="1">
          <PaginationLink onClick={() => handlePageChange(1)}>1</PaginationLink>
        </PaginationItem>
      );
      if (startPage > 2) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink onClick={() => handlePageChange(i)} isActive={page === i}>
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink onClick={() => handlePageChange(totalPages)}>{totalPages}</PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  const getStatusColor = (action: string) => {
    switch (action) {
      case DocumentRequestLogAction.completed:
        return 'bg-green-500';
      case DocumentRequestLogAction.rejected:
        return 'bg-red-500';
      case DocumentRequestLogAction.cancelled:
        return 'bg-gray-500';
      case DocumentRequestLogAction.submitted:
        return 'bg-blue-500';
      case DocumentRequestLogAction.processing:
        return 'bg-yellow-500';
      case DocumentRequestLogAction.pickup:
        return 'bg-purple-500';
      default:
        return 'bg-gray-400';
    }
  };

  if (isLoading) {
    return (
      <TitledPage title="Request a Document" description="Request a document from the school">
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="py-2">
              <CardHeader className="py-2 px-4">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2 mt-1" />
              </CardHeader>
              <CardContent className="py-2 px-4">
                <Skeleton className="h-3 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </TitledPage>
    );
  }

  return (
    <TitledPage title="Request a Document" description="Request a document from the school">
      <RequestDocumentView />
    </TitledPage>
  );
}
