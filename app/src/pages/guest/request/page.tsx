import { useModal } from '@/components/custom/modal.component';
import DocumentRequestUserModal from '@/components/document/document-request-user.modal';
import TitledPage from '@/components/pages/titled.page';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { useAuth } from '@/context/auth.context';
import { useGetDocumentRequestPaginated } from '@rest/api';
import type { DocumentRequest } from '@rest/models';
import { AlertCircle, Calendar, Clock, FileText } from 'lucide-react';
import type React from 'react';
import { useMemo, useState } from 'react';

export default function GuestRequestDocument(): React.ReactNode {
  const { session } = useAuth();
  const documentRequestModal = useModal<DocumentRequest>();
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

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
    [documentRequestResponse]
  );

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<
      string,
      { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }
    > = {
      pending: { variant: 'outline', label: 'Pending' },
      processing: { variant: 'secondary', label: 'Processing' },
      completed: { variant: 'default', label: 'Completed' },
      rejected: { variant: 'destructive', label: 'Rejected' },
    };

    const config = statusConfig[status?.toLowerCase()] || { variant: 'outline', label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
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

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
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

  if (isLoading) {
    return (
      <TitledPage title="Request a Document" description="Request a document from the school">
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader className="py-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-3 w-1/2 mt-1" />
              </CardHeader>
              <CardContent className="py-2">
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
      <div className="space-y-4">
        <div className="flex justify-end items-end">
          <Button onClick={() => documentRequestModal.openFn()} size="sm">
            <FileText className="mr-2 h-4 w-4" />
            New Request
          </Button>
        </div>

        {allDocumentRequests.length === 0 ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You haven't made any document requests yet. Click "New Request" to get started.
            </AlertDescription>
          </Alert>
        ) : (
          <>
            <div className="grid gap-2">
              {allDocumentRequests.map((request: DocumentRequest) => (
                <Card key={request.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="py-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-0.5">
                        <CardTitle className="flex items-center gap-2 text-base">
                          <FileText className="h-4 w-4" />
                          {request.document_type?.document_type_name ?? 'Document Request'}
                        </CardTitle>
                        <CardDescription className="text-xs">
                          Request ID: #{request.id}
                        </CardDescription>
                      </div>
                      {getStatusBadge(request.latest_status_label || 'pending')}
                    </div>
                  </CardHeader>
                  <CardContent className="py-2">
                    <div className="grid gap-2 md:grid-cols-2">
                      <div className="flex items-center gap-2 text-xs">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span className="text-muted-foreground">Requested:</span>
                        <span className="font-medium">{formatDate(request.created_at)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-muted-foreground">Last Updated:</span>
                        <span className="font-medium">{formatDate(request.updated_at)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {totalPages > 1 && (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handlePageChange(Math.max(1, page - 1))}
                      className={page === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                  {renderPaginationItems()}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
                      className={
                        page === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
        )}
      </div>

      <DocumentRequestUserModal controller={documentRequestModal} onSubmit={handleModalSubmit} />
    </TitledPage>
  );
}
