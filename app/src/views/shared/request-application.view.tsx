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

import Menu from '@/components/custom/menu.component';
import { useModal } from '@/components/custom/modal.component';
import Select from '@/components/custom/select.component';
import Table, { type PaginationMeta, type TableColumn } from '@/components/custom/table.component';
import { Timeline, type TimelineLog } from '@/components/custom/timeline.component';
import DocumentRequestUserModal from '@/components/document/document-request-user.modal';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useAuth } from '@/context/auth.context';
import { useCreateDocumentRequestLog, useGetDocumentRequestPaginated } from '@rest/api';
import { DocumentRequestLogActionEnum, type DocumentRequest } from '@rest/models';
import { AlertCircle, Building2, Clock, EllipsisIcon, FileText, Plus } from 'lucide-react';
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

  const paginationMeta: PaginationMeta = useMemo(
    () => ({
      current_page: page,
      last_page: Math.ceil((documentRequestResponse?.data?.total ?? 0) / rowsPerPage),
      per_page: rowsPerPage,
      total: documentRequestResponse?.data?.total ?? 0,
      from: allDocumentRequests.length > 0 ? (page - 1) * rowsPerPage + 1 : null,
      to:
        allDocumentRequests.length > 0
          ? Math.min(page * rowsPerPage, documentRequestResponse?.data?.total ?? 0)
          : null,
    }),
    [page, rowsPerPage, documentRequestResponse, allDocumentRequests.length]
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
        colorClass: 'text-blue-700',
        bgClass: 'bg-blue-200',
      },
      [DocumentRequestLogActionEnum.paid]: {
        variant: 'default',
        label: 'Paid',
        colorClass: 'text-green-700',
        bgClass: 'bg-green-200',
      },
      [DocumentRequestLogActionEnum.processing]: {
        variant: 'secondary',
        label: 'Processing',
        colorClass: 'text-yellow-700',
        bgClass: 'bg-yellow-200',
      },
      [DocumentRequestLogActionEnum.completed]: {
        variant: 'default',
        label: 'Completed',
        colorClass: 'text-purple-700',
        bgClass: 'bg-purple-200',
      },
      [DocumentRequestLogActionEnum.rejected]: {
        variant: 'destructive',
        label: 'Rejected',
        colorClass: 'text-red-700',
        bgClass: 'bg-red-200',
      },
      [DocumentRequestLogActionEnum.cancelled]: {
        variant: 'destructive',
        label: 'Cancelled',
        colorClass: 'text-gray-700',
        bgClass: 'bg-gray-300',
      },
      [DocumentRequestLogActionEnum.pickup]: {
        variant: 'secondary',
        label: 'Ready for Pickup',
        colorClass: 'text-violet-700',
        bgClass: 'bg-violet-200',
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

  const rowsPerPageOptions = [
    { value: '5', label: '5' },
    { value: '10', label: '10' },
    { value: '20', label: '20' },
    { value: '50', label: '50' },
  ];

  const columns: Array<TableColumn<DocumentRequest>> = useMemo(
    () => [
      {
        key: 'id',
        title: 'ID',
        width: 100,
        render: (_value, row) => (
          <span className="font-mono text-xs text-muted-foreground">#{row.id}</span>
        ),
      },
      {
        key: 'document_type.document_type_name',
        title: 'Document Type',
        render: (_, row) => (
          <div className="flex flex-col">
            <span className="font-medium text-sm">
              {row.document_type?.document_type_name ?? 'Document Request'}
            </span>
            {row.purpose && (
              <span className="text-[10px] text-muted-foreground line-clamp-1 md:hidden">
                {row.purpose}
              </span>
            )}
          </div>
        ),
      },
      {
        key: 'campus.name',
        title: 'Campus',
        className: 'hidden md:table-cell',
        headerClassName: 'hidden md:table-cell',
        render: (_, row) => (
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Building2 className="h-3.5 w-3.5" />
            <span className="line-clamp-1">{row.campus?.name ?? 'N/A'}</span>
          </div>
        ),
      },
      {
        key: 'created_at',
        title: 'Date',
        className: 'hidden md:table-cell',
        headerClassName: 'hidden md:table-cell',
        render: (_value, row) => (
          <div className="flex flex-col text-xs text-muted-foreground">
            <span>{formatDate(row.created_at)}</span>
          </div>
        ),
      },
      {
        key: 'latest_status_label',
        title: 'Status',
        render: (_, row) => {
          const statusConfig = getStatusConfig(row.latest_status || 'pending');
          return (
            <Badge
              variant="outline"
              className={`text-[10px] h-5 px-2 font-medium ${statusConfig.bgClass} ${statusConfig.colorClass} border-transparent whitespace-nowrap`}
            >
              {row.latest_status_label}
            </Badge>
          );
        },
      },
      {
        key: 'actions',
        title: 'Actions',
        render: (_, row) => (
          <Menu
            trigger={
              <Button variant="outline" size="icon">
                <EllipsisIcon />
              </Button>
            }
            items={[
              {
                label: 'View Status',
                icon: <Clock />,
                onClick: () => handleViewStatus(row),
              },
              ...(row.is_cancellable
                ? [
                    {
                      label: 'Edit Details',
                      icon: <FileText />,
                      onClick: () => documentRequestModal.openFn(row),
                    },
                    {
                      label: 'Cancel Request',
                      icon: <AlertCircle />,
                      onClick: () => handleCancelRequest(row),
                      disabled: isCancellingRequest,
                    },
                  ]
                : []),
            ]}
          />
        ),
      },
    ],
    [isCancellingRequest, documentRequestModal, handleViewStatus, handleCancelRequest]
  );

  const timelineItems: TimelineLog[] = useMemo(() => {
    if (!viewingStatus?.logs) return [];
    return viewingStatus.logs.map((log) => {
      const cfg = getStatusConfig(log.action);
      return {
        key: String(log.id),
        dateTime: log.created_at ?? '',
        label: cfg.label,
        description: log.note,
        user: log.user?.name,
        color: cfg.colorClass,
        background: cfg.bgClass,
      };
    });
  }, [viewingStatus]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 mr-2">
              <span className="text-xs text-muted-foreground hidden sm:inline">Rows:</span>
              <Select
                value={rowsPerPage.toString()}
                onValueChange={handleRowsPerPageChange}
                options={rowsPerPageOptions}
                className="w-[70px] h-8 text-xs"
              />
            </div>
            <Button onClick={() => documentRequestModal.openFn()} size="sm" className="h-9">
              <Plus className="mr-1.5 h-4 w-4" />
              New Request
            </Button>
          </div>
        </div>
        <Table
          columns={columns}
          rows={[]}
          loading={true}
          showPagination={true}
          pagination={paginationMeta}
          onPageChange={handlePageChange}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Button onClick={() => documentRequestModal.openFn()}>
        <Plus />
        New Request
      </Button>

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
        <Table
          columns={columns}
          rows={allDocumentRequests}
          rowKey={(row) => row.id!}
          onClickRow={handleViewStatus}
          showPagination={true}
          pagination={paginationMeta}
          onPageChange={handlePageChange}
          hoverable={true}
          trClassName="cursor-pointer"
        />
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
                  className={`${getStatusConfig(viewingStatus.latest_status || '').colorClass} bg-background`}
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
            <ScrollArea className="flex-1 h-full">
              <div className="p-6 space-y-6">
                {/* Request Details Section */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Request Details</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-5 pt-0">
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
                        <p className="font-semibold text-foreground">
                          {viewingStatus.campus?.name}
                        </p>
                      </div>
                    </div>

                    {viewingStatus.purpose && (
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                          <AlertCircle className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-1">
                            Purpose
                          </h3>
                          <p className="text-sm text-foreground leading-relaxed">
                            {viewingStatus.purpose}
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Timeline Section */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Clock className="h-4 w-4" /> Timeline History
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Timeline logs={timelineItems} />
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
