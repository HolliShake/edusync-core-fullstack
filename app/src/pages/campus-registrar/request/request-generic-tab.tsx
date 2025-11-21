import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/context/auth.context';
import { useCreateDocumentRequestLog, useGetDocumentRequestPaginated } from '@rest/api';
import { DocumentRequestLogActionEnum } from '@rest/models';
import type { DocumentRequest } from '@rest/models/documentRequest';
import type { DocumentType } from '@rest/models/documentType';
import { CalendarIcon, FileTextIcon, InfoIcon, UserIcon } from 'lucide-react';
import type React from 'react';
import { useMemo } from 'react';

// For demonstration, use Button from shadcn or your own button component
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

// Compact status indicator, tighter layout
function StatusIndicator({ status }: { status?: string }) {
  let color = 'bg-muted';
  let label = status ?? 'Unknown';
  switch (status?.toLowerCase()) {
    case 'paid':
      color = 'bg-green-500';
      break;
    case 'processing':
      color = 'bg-yellow-400';
      break;
    case 'completed':
      color = 'bg-blue-600';
      break;
    case 'rejected':
      color = 'bg-red-500';
      break;
    case 'cancelled':
      color = 'bg-gray-400';
      break;
    case 'pickup':
      color = 'bg-purple-500';
      break;
    default:
      break;
  }
  return (
    <span className="inline-flex items-center gap-1">
      <span className={`inline-block w-2 h-2 rounded-full ${color}`} />
      <span className="text-xs">{label}</span>
    </span>
  );
}

// More compact InfoRow
function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <span className="flex items-center gap-1 text-xs">
      <Icon className="w-3.5 h-3.5 text-muted-foreground" />
      <span className="font-medium text-foreground">{label}:</span>
      <span className="ml-1 text-foreground">{value}</span>
    </span>
  );
}

export default function RequestGenericTab({
  filter,
}: {
  filter: DocumentRequestLogActionEnum;
}): React.ReactNode {
  const { session } = useAuth();
  const { data, isLoading, isError, refetch } = useGetDocumentRequestPaginated(
    {
      'filter[campus_id]': session?.active_campus ?? 0,
      'filter[latest_status]': filter,
      page: 1,
      rows: 10,
    },
    {
      query: {
        enabled: !!session?.active_campus,
      },
    }
  );

  const { mutateAsync: createDocumentRequest, isPending: isCreatingLogs } =
    useCreateDocumentRequestLog();

  const requests = useMemo<DocumentRequest[]>(() => data?.data?.data ?? [], [data]);

  const positiveActionLabel = useMemo(() => {
    switch (filter) {
      case DocumentRequestLogActionEnum.submitted:
      case DocumentRequestLogActionEnum.paid:
        return 'Approve';
      case DocumentRequestLogActionEnum.processing:
        return 'Ready';
      case DocumentRequestLogActionEnum.pickup:
        return 'Complete';
      case DocumentRequestLogActionEnum.completed:
      default:
        return 'Done';
    }
  }, [filter]);

  const positiveActionNextValue = useMemo(() => {
    switch (filter) {
      case DocumentRequestLogActionEnum.submitted:
      case DocumentRequestLogActionEnum.paid:
        return DocumentRequestLogActionEnum.processing;
      case DocumentRequestLogActionEnum.processing:
        return DocumentRequestLogActionEnum.pickup;
      case DocumentRequestLogActionEnum.pickup:
        return DocumentRequestLogActionEnum.completed;
      case DocumentRequestLogActionEnum.completed:
      default:
        return null;
    }
  }, [filter]);

  // Approve & Reject event handlers (replace with proper logic)
  const handleApprove = async (reqId: number) => {
    const nextValue = positiveActionNextValue;
    if (!nextValue) return toast.error('No next value found');
    try {
      await createDocumentRequest({
        data: {
          document_request_id: reqId,
          action: nextValue,
          user_id: session?.id ?? 0,
          note: `Document request ${nextValue.toLowerCase()}`,
        },
      });
      refetch();
      toast.success('Document request approved successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to approve document request');
    }
  };
  const handleReject = async (reqId: number) => {
    try {
      await createDocumentRequest({
        data: {
          document_request_id: reqId,
          action: DocumentRequestLogActionEnum.rejected,
          user_id: session?.id ?? 0,
          note: 'Document request rejected',
        },
      });
      refetch();
      toast.success('Document request rejected successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to reject document request');
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-1">
        {isLoading ? (
          <div className="flex flex-col gap-1">
            {Array.from({ length: 3 }).map((_, idx) => (
              <Skeleton key={idx} className="h-16 w-full rounded-lg" />
            ))}
          </div>
        ) : isError ? (
          <div className="text-destructive text-center text-sm py-4 rounded-lg border">
            <span className="block mb-1 font-semibold">Failed to load document requests.</span>
            <span className="text-xs text-muted-foreground">Please try again later.</span>
          </div>
        ) : requests.length === 0 ? (
          <div className="bg-muted rounded-lg text-center font-medium px-2 py-6 text-muted-foreground text-sm border">
            <span>No paid document requests found for this campus.</span>
          </div>
        ) : (
          <Accordion type="multiple" className="flex flex-col gap-1">
            {requests.map((req) => {
              const documentType: DocumentType | undefined = req.document_type;
              return (
                <AccordionItem
                  key={req.id}
                  value={String(req.id)}
                  className="rounded-lg border bg-white dark:bg-card transition-all"
                >
                  <AccordionTrigger className="p-2 flex items-center gap-2 rounded-lg w-full hover:bg-muted/50 transition min-h-0">
                    <div className="bg-primary/10 rounded-full p-1 flex items-center justify-center">
                      <FileTextIcon className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium text-primary">
                      {documentType?.document_type_name ?? (
                        <span className="italic text-muted-foreground">No name</span>
                      )}
                    </span>
                    <Badge variant="secondary" className="ml-auto px-1.5 py-0.5 text-[10px]">
                      <StatusIndicator status={req.latest_status_label ?? 'Paid'} />
                    </Badge>
                  </AccordionTrigger>
                  <AccordionContent className="px-2 pb-2 pt-0 text-xs space-y-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground truncate mb-0.5">
                      <span>
                        {documentType?.description ? (
                          documentType.description
                        ) : (
                          <span className="italic">No description</span>
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 text-xs">
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <CalendarIcon className="w-3 h-3" />
                        <span>
                          {req.created_at ? new Date(req.created_at).toLocaleString() : '-'}
                        </span>
                      </span>
                      {typeof documentType?.price === 'number' && (
                        <span className="ml-1 font-medium bg-accent text-accent-foreground px-1.5 py-0.5 rounded text-[10px]">
                          {documentType.price === 0 ? (
                            <>FREE</>
                          ) : (
                            <>₱{documentType.price.toLocaleString()}</>
                          )}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col gap-0.5 mt-0.5 text-xs bg-muted/50 rounded px-1.5 py-1.5">
                      <InfoRow
                        icon={UserIcon}
                        label="Requested by"
                        value={
                          req.user?.name || (
                            <span className="italic text-muted-foreground">Unknown</span>
                          )
                        }
                      />
                      <InfoRow
                        icon={InfoIcon}
                        label="Purpose"
                        value={
                          req.purpose || (
                            <span className="italic text-muted-foreground">None specified</span>
                          )
                        }
                      />
                    </div>
                    {req.is_actionable && (
                      <div className="flex gap-1 mt-2">
                        <Button
                          disabled={isCreatingLogs || !req.is_actionable}
                          variant="default"
                          className="text-[11px] px-2 py-0.5 h-6 min-h-0 rounded"
                          onClick={() => handleApprove(req.id!)}
                          data-testid={`approve-btn-${req.id}`}
                        >
                          {positiveActionLabel}
                        </Button>
                        <Button
                          disabled={isCreatingLogs || !req.is_actionable}
                          variant="destructive"
                          className="text-[11px] px-2 py-0.5 h-6 min-h-0 rounded"
                          onClick={() => handleReject(req.id!)}
                          data-testid={`reject-btn-${req.id}`}
                        >
                          Reject
                        </Button>
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        )}
      </div>
    </div>
  );
}
