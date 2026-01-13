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
 * - Responsive table layout
 * - Loading states with skeleton screens
 *
 * @ui-components
 * - Table-based request list with status badges
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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useAuth } from '@/context/auth.context';
import { useCreateDocumentRequestLog, useGetDocumentRequestPaginated } from '@rest/api';
import { DocumentRequestLogActionEnum, type DocumentRequest } from '@rest/models';
import { AlertCircle, Building2, Clock, FileText, MoreHorizontal, Plus } from 'lucide-react';
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

  const getStatusConfig = (status: string) => {
    const statusConfig: Record<
      string,
      {
        variant: 'default' | 'secondary' | 'destructive' | 'outline';
        label: string;
        colorClass: string;
        bgClass: string;
      }
    > = {
      [DocumentRequestLogActionEnum.submitted]: {
        variant: 'outline',
        label: 'Submitted',
        colorClass: 'text-blue-600',
        bgClass: 'bg-blue-50',
      },
      [DocumentRequestLogActionEnum.paid]: {
        variant: 'default',
        label: 'Paid',
        colorClass: 'text-emerald-600',
        bgClass: 'bg-emerald-50',
      },
      [DocumentRequestLogActionEnum.processing]: {
        variant: 'secondary',
        label: 'Processing',
        colorClass: 'text-yellow-600',
        bgClass: 'bg-yellow-50',
      },
      [DocumentRequestLogActionEnum.completed]: {
        variant: 'default',
        label: 'Completed',
        colorClass: 'text-green-600',
        bgClass: 'bg-green-50',
      },
      [DocumentRequestLogActionEnum.rejected]: {
        variant: 'destructive',
        label: 'Rejected',
        colorClass: 'text-red-600',
        bgClass: 'bg-red-50',
      },
      [DocumentRequestLogActionEnum.cancelled]: {
        variant: 'destructive',
        label: 'Cancelled',
        colorClass: 'text-gray-600',
        bgClass: 'bg-gray-50',
      },
      [DocumentRequestLogActionEnum.pickup]: {
        variant: 'secondary',
        label: 'Ready for Pickup',
        colorClass: 'text-purple-600',
        bgClass: 'bg-purple-50',
      },
    };

    return (
      statusConfig[status?.toLowerCase()] || {
        variant: 'outline',
        label: status,
        colorClass: 'text-gray-600',
        bgClass: 'bg-gray-50',
      }
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
          action: DocumentRequestLogActionEnum.cancelled,
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
      case DocumentRequestLogActionEnum.completed:
        return 'bg-green-500';
      case DocumentRequestLogActionEnum.paid:
        return 'bg-emerald-500';
      case DocumentRequestLogActionEnum.rejected:
        return 'bg-red-500';
      case DocumentRequestLogActionEnum.cancelled:
        return 'bg-gray-500';
      case DocumentRequestLogActionEnum.submitted:
        return 'bg-blue-500';
      case DocumentRequestLogActionEnum.processing:
        return 'bg-yellow-500';
      case DocumentRequestLogActionEnum.pickup:
        return 'bg-purple-500';
      default:
        return 'bg-gray-400';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-8 w-32" />
        </div>
        <div className="border rounded-md">
          <div className="p-4 border-b">
            <div className="grid grid-cols-4 gap-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="p-4 border-b last:border-0">
              <div className="grid grid-cols-4 gap-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">My Requests</h2>
          <p className="text-sm text-muted-foreground">Manage and track your document requests</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 mr-2">
            <span className="text-xs text-muted-foreground hidden sm:inline">Rows:</span>
            <Select value={rowsPerPage.toString()} onValueChange={handleRowsPerPageChange}>
              <SelectTrigger className="w-[70px] h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={() => documentRequestModal.openFn()} size="sm" className="h-9">
            <Plus className="mr-1.5 h-4 w-4" />
            New Request
          </Button>
        </div>
      </div>

      {allDocumentRequests.length === 0 ? (
        <Alert className="border-dashed py-12 flex flex-col items-center justify-center text-center">
          <div className="bg-muted/50 p-4 rounded-full mb-4">
            <FileText className="h-8 w-8 text-muted-foreground" />
          </div>
          <AlertTitle className="mb-2 text-xl font-medium">No requests found</AlertTitle>
          <AlertDescription className="max-w-sm mx-auto text-muted-foreground mb-6">
            You haven't submitted any document requests yet. Create a new request to get started
            tracking your documents.
          </AlertDescription>
          <Button variant="outline" onClick={() => documentRequestModal.openFn()}>
            Create First Request
          </Button>
        </Alert>
      ) : (
        <div className="border rounded-md bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Document Type</TableHead>
                <TableHead className="hidden md:table-cell">Campus</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allDocumentRequests.map((request: DocumentRequest) => {
                const statusConfig = getStatusConfig(request.latest_status_label || 'pending');

                return (
                  <TableRow
                    key={request.id}
                    className="group hover:bg-muted/50 cursor-pointer"
                    onClick={() => handleViewStatus(request)}
                  >
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      #{request.id}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">
                          {request.document_type?.document_type_name ?? 'Document Request'}
                        </span>
                        {request.purpose && (
                          <span className="text-[10px] text-muted-foreground line-clamp-1 md:hidden">
                            {request.purpose}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Building2 className="h-3.5 w-3.5" />
                        <span className="line-clamp-1">{request.campus?.name ?? 'N/A'}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex flex-col text-xs text-muted-foreground">
                        <span>{formatDate(request.created_at)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`text-[10px] h-5 px-2 font-medium ${statusConfig.bgClass} ${statusConfig.colorClass} border-transparent whitespace-nowrap`}
                      >
                        {statusConfig.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div
                        className="flex justify-end items-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-foreground"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewStatus(request)}>
                              <Clock className="mr-2 h-4 w-4" /> View Status
                            </DropdownMenuItem>
                            {request.is_cancellable && (
                              <DropdownMenuItem
                                onClick={() => documentRequestModal.openFn(request)}
                              >
                                <FileText className="mr-2 h-4 w-4" /> Edit Details
                              </DropdownMenuItem>
                            )}
                            {request.is_cancellable && (
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() => handleCancelRequest(request)}
                                disabled={isCancellingRequest}
                              >
                                <AlertCircle className="mr-2 h-4 w-4" /> Cancel Request
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {totalPages > 1 && (
            <div className="py-4 border-t">
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
            </div>
          )}
        </div>
      )}

      <DocumentRequestUserModal controller={documentRequestModal} onSubmit={handleModalSubmit} />

      <Sheet open={viewingStatus != null} onOpenChange={() => setViewingStatus(null)}>
        <SheetContent className="w-full sm:max-w-lg flex flex-col p-0">
          <SheetHeader className="space-y-3 pb-6 border-b px-6 pt-6 bg-muted/10">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-xl font-bold">Request Status</SheetTitle>
              {viewingStatus && (
                <Badge
                  variant="outline"
                  className={`${getStatusConfig(viewingStatus.latest_status_label || '').colorClass} bg-background`}
                >
                  {viewingStatus.latest_status_label}
                </Badge>
              )}
            </div>
            <SheetDescription>
              Tracking ID:{' '}
              <span className="font-mono text-foreground font-medium">#{viewingStatus?.id}</span>
            </SheetDescription>
          </SheetHeader>

          {viewingStatus && (
            <div className="flex-1 min-h-0 overflow-y-auto">
              <div className="p-6 space-y-8">
                {/* Request Details Section */}
                <div className="grid gap-5">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">
                        Document Type
                      </h3>
                      <p className="font-semibold text-foreground">
                        {viewingStatus.document_type?.document_type_name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Campus</h3>
                      <p className="font-semibold text-foreground">{viewingStatus.campus?.name}</p>
                    </div>
                  </div>

                  {viewingStatus.purpose && (
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                        <AlertCircle className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Purpose</h3>
                        <p className="text-sm text-foreground leading-relaxed">
                          {viewingStatus.purpose}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Timeline Section */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold flex items-center gap-2">
                    <Clock className="h-4 w-4" /> Timeline History
                  </h3>
                  <div className="relative">
                    <div className="absolute left-[9px] top-2 bottom-2 w-[2px] bg-border" />
                    <div className="space-y-6">
                      {viewingStatus.logs?.map((log, index) => (
                        <div key={index} className="relative pl-8 group">
                          <div
                            className={`absolute left-0 top-1.5 w-5 h-5 rounded-full border-4 border-background ${getStatusColor(log.action)} z-10 shadow-sm`}
                          />
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold capitalize text-foreground">
                                {log.action.replace('_', ' ')}
                              </span>
                              <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                                {new Date(log.created_at ?? '').toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {new Date(log.created_at ?? '').toLocaleDateString(undefined, {
                                weekday: 'short',
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                              {log.user?.name ? ` • by ${log.user.name}` : ''}
                            </span>
                            {log.note && (
                              <p className="text-xs text-muted-foreground mt-1 bg-muted/30 p-2 rounded border border-border/50">
                                {log.note}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
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
