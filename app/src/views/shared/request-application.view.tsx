/*
 * Request Document View
 *
 * This component displays and manages document requests for authenticated users.
 * It provides a comprehensive interface for viewing, creating, and tracking document requests.
 *
 * @authentication Required
 * - Uses `useAuth` hook to access the current user session
 * - Session must be active for the component to function properly
 *
 * @features
 * - View paginated list of document requests
 * - Create new document requests via modal
 * - Edit existing document requests
 * - View detailed status history and timeline
 * - Real-time status updates with visual indicators
 * - Customizable pagination (5, 10, 20, 50 rows per page)
 * - Status badges with color-coded indicators
 * - Responsive card-based layout
 * - Loading states with skeleton screens
 *
 * @ui-components
 * - Card-based request list with status badges
 * - Sheet component for detailed status view
 * - Modal for creating/editing requests
 * - Pagination controls
 * - Status timeline with visual indicators
 *
 * @status-tracking
 * - Submitted: Initial request state (blue)
 * - Paid: Payment completed (green)
 * - Processing: Request being processed (yellow)
 * - Completed: Request fulfilled (green)
 * - Rejected: Request denied (red)
 * - Cancelled: Request cancelled (gray)
 * - Pickup: Ready for pickup (purple)
 *
 * @example
 * ```tsx
 * // Usage in a page component
 * <RequestDocumentView />
 * ```
 */

import { useModal } from '@/components/custom/modal.component';
import DocumentRequestUserModal from '@/components/document/document-request-user.modal';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/context/auth.context';
import { useCreateDocumentRequestLog, useGetDocumentRequestPaginated } from '@rest/api';
import { DocumentRequestLogAction, type DocumentRequest } from '@rest/models';
import { AlertCircle, Calendar, Clock, FileText } from 'lucide-react';
import type React from 'react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

export default function RequestDocumentView(): React.ReactNode {
  const { session } = useAuth();
  const documentRequestModal = useModal<DocumentRequest>();
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [viewingStatus, setViewingStatus] = useState<DocumentRequest | null>(null);

  const { mutateAsync: cancelDocumentRequest, isPending: isCancellingRequest } =
    useCreateDocumentRequestLog();

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
      [DocumentRequestLogAction.paid]: { variant: 'default', label: 'Paid' },
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

  const handleCancelRequest = async (request: DocumentRequest) => {
    try {
      await cancelDocumentRequest({
        data: {
          document_request_id: request.id!,
          user_id: session?.id ?? 0,
          note: 'Request cancelled',
          action: DocumentRequestLogAction.cancelled,
        },
      });
      refetch();
      toast.success('Request cancelled successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to cancel request');
    }
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
      case DocumentRequestLogAction.paid:
        return 'bg-emerald-500';
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
    );
  }

  return (
    <div className="space-y-3">
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Show</span>
            <Select value={rowsPerPage.toString()} onValueChange={handleRowsPerPageChange}>
              <SelectTrigger className="w-[60px] h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-xs text-muted-foreground">per page</span>
          </div>
          <Button onClick={() => documentRequestModal.openFn()} size="sm" className="h-8">
            <FileText className="mr-1.5 h-3.5 w-3.5" />
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
                <Card key={request.id} className="hover:shadow-sm transition-all duration-200">
                  <CardHeader className="py-1.5 px-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <FileText className="h-3 w-3 text-primary shrink-0" />
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-xs font-semibold truncate">
                            {request.document_type?.document_type_name ?? 'Document Request'}
                          </CardTitle>
                          <CardDescription className="text-[10px] flex items-center gap-1">
                            <span className="font-mono">#{request.id}</span>
                            <span className="text-muted-foreground/50">•</span>
                            <span className="truncate">{request.campus?.name ?? 'Campus'}</span>
                          </CardDescription>
                        </div>
                      </div>
                      {getStatusBadge(request.latest_status_label || 'pending')}
                    </div>
                  </CardHeader>
                  <CardContent className="py-1.5 px-3 space-y-1.5">
                    <div className="text-[10px]">
                      <span className="text-muted-foreground">Purpose: </span>
                      <span className="line-clamp-1">
                        {request.purpose || 'No purpose specified'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-2.5 w-2.5" />
                          <span>{formatDate(request.created_at)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-2.5 w-2.5" />
                          <span>{formatDate(request.updated_at)}</span>
                        </div>
                      </div>

                      <div className="flex gap-1.5">
                        {request.is_cancellable && (
                          <Button
                            variant="destructive"
                            size="sm"
                            className="h-6 text-[10px] px-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCancelRequest(request);
                            }}
                            disabled={!request.is_cancellable || isCancellingRequest}
                          >
                            Cancel
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-6 text-[10px] px-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewStatus(request);
                          }}
                        >
                          Status
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          className="h-6 text-[10px] px-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            documentRequestModal.openFn(request);
                          }}
                          disabled={!request.is_cancellable}
                        >
                          Edit
                        </Button>
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

      <Sheet open={viewingStatus != null} onOpenChange={() => setViewingStatus(null)}>
        <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader className="space-y-3 pb-6 border-b">
            <SheetTitle className="text-2xl font-bold">Request Status</SheetTitle>
            <SheetDescription className="text-base">
              Track the progress of your document request
            </SheetDescription>
          </SheetHeader>
          {viewingStatus && (
            <div className="mt-6 space-y-6">
              <div className="grid gap-4">
                <div className="group rounded-lg border bg-card p-2 transition-all hover:shadow-md">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    Document Type
                  </h3>
                  <p className="text-lg font-medium">
                    {viewingStatus.document_type?.document_type_name}
                  </p>
                </div>
                <div className="group rounded-lg border bg-card p-2 transition-all hover:shadow-md">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    Campus
                  </h3>
                  <p className="text-lg font-medium">{viewingStatus.campus?.name}</p>
                </div>
                <div className="group rounded-lg border bg-card p-2 transition-all hover:shadow-md">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    Purpose
                  </h3>
                  <p className="text-base leading-relaxed">{viewingStatus.purpose}</p>
                </div>
                <div className="group rounded-lg border bg-card p-2 transition-all hover:shadow-md">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    Current Status
                  </h3>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(viewingStatus.latest_status_label || 'pending')}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Status History
                </h3>
                <div className="relative">
                  <div className="absolute left-[15px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-primary/50 via-primary/30 to-transparent" />
                  <div className="space-y-4">
                    {viewingStatus.logs?.map((log, index) => (
                      <div key={index} className="relative pl-10">
                        <div
                          className={`absolute left-2 top-1 w-4 h-4 rounded-full border-2 border-background ${getStatusColor(log.action)}`}
                        />
                        <div className="p-3 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium">{log.action}</span>
                          </div>
                          <span className="text-xs text-muted-foreground block mt-1">
                            {new Date(log.created_at ?? '').toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
