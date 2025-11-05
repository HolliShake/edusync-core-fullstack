import Modal, { type ModalState } from '@/components/custom/modal.component';
import Select from '@/components/custom/select.component';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/context/auth.context';
import { renderError } from '@/lib/error';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useCreateDocumentRequest,
  useGetCampusPaginated,
  useGetDocumentTypePaginated,
  useUpdateDocumentRequest,
} from '@rest/api';
import type { DocumentRequest } from '@rest/models';
import { Building2, Check } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const documentRequestSchema = z.object({
  campus_id: z.number().min(1, 'Campus is required'),
  document_type_id: z.number().min(1, 'Document type is required'),
  purpose: z.string().min(1, 'Purpose is required'),
  user_id: z.number().min(1, 'User is required'),
});

type DocumentRequestFormData = z.infer<typeof documentRequestSchema>;

interface DocumentRequestUserModalProps {
  controller: ModalState<DocumentRequest>;
  onSubmit: (data: DocumentRequestFormData) => void;
}

export default function DocumentRequestUserModal({
  controller,
  onSubmit,
}: DocumentRequestUserModalProps) {
  const { session } = useAuth();
  const {
    register,
    handleSubmit,
    reset,
    setError,
    control,
    formState: { errors },
  } = useForm<DocumentRequestFormData>({
    resolver: zodResolver(documentRequestSchema),
    defaultValues: {
      campus_id: 0,
      document_type_id: 0,
      purpose: '',
      user_id: session?.id ?? 0,
    },
  });

  const { mutateAsync: createDocumentRequest, isPending } = useCreateDocumentRequest();
  const { mutateAsync: updateDocumentRequest, isPending: isUpdating } = useUpdateDocumentRequest();
  const { data: documentTypesResponse, isLoading: isLoadingDocumentTypes } =
    useGetDocumentTypePaginated();
  const { data: campusesResponse, isLoading: isLoadingCampuses } = useGetCampusPaginated();

  const isSaving = useMemo(() => isPending || isUpdating, [isPending, isUpdating]);
  const isEdit = useMemo(() => !!controller.data?.id, [controller.data]);

  const documentTypes = useMemo(
    () => documentTypesResponse?.data?.data || [],
    [documentTypesResponse]
  );
  const campuses = useMemo(() => campusesResponse?.data?.data || [], [campusesResponse]);

  const documentTypeOptions = useMemo(
    () =>
      documentTypes.map((docType) => ({
        label: `${docType.document_type_name} - ₱${docType.price}`,
        value: docType.id?.toString() || '',
      })),
    [documentTypes]
  );

  const onFormSubmit = async (data: DocumentRequestFormData) => {
    try {
      if (isEdit) {
        await updateDocumentRequest({
          id: controller.data?.id ?? 0,
          data: {
            ...data,
            user_id: session?.id ?? 0,
          } as unknown as DocumentRequest,
        });
      } else {
        await createDocumentRequest({
          data: {
            ...data,
            user_id: session?.id as number,
          } as unknown as DocumentRequest,
        });
      }
      toast.success(`Document request ${isEdit ? 'updated' : 'created'} successfully`);
      controller.closeFn();
      onSubmit(data);
    } catch (error) {
      renderError(error, setError);
      toast.error(`Failed to ${isEdit ? 'update' : 'create'} document request`);
    }
  };

  useEffect(() => {
    if (!controller.data) {
      return reset({
        campus_id: 0,
        document_type_id: 0,
        purpose: '',
        user_id: session?.id ?? 0,
      });
    }
    reset({
      campus_id: controller.data.campus_id,
      document_type_id: controller.data.document_type_id,
      purpose: controller.data.purpose,
      user_id: session?.id ?? 0,
    });
  }, [controller.isOpen, controller.data, reset]);

  return (
    <Modal
      controller={controller}
      title={`${isEdit ? 'Edit' : 'Request'} Document`}
      size="md"
      closable
    >
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="campus_id" className="text-sm">
            Select Campus
          </Label>
          <Controller
            name="campus_id"
            control={control}
            render={({ field }) => (
              <div className="grid grid-cols-2 gap-2">
                {isLoadingCampuses ? (
                  <div className="col-span-2 text-center py-4 text-sm text-muted-foreground">
                    Loading campuses...
                  </div>
                ) : (
                  campuses.map((campus) => (
                    <button
                      key={campus.id}
                      type="button"
                      onClick={() => field.onChange(campus.id)}
                      className={cn(
                        'relative flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all hover:shadow-md',
                        field.value === campus.id
                          ? 'border-primary bg-primary/5 shadow-sm'
                          : 'border-border hover:border-primary/50'
                      )}
                    >
                      <Building2
                        className={cn(
                          'h-6 w-6 mb-1.5',
                          field.value === campus.id ? 'text-primary' : 'text-muted-foreground'
                        )}
                      />
                      <span
                        className={cn(
                          'text-xs font-medium text-center',
                          field.value === campus.id ? 'text-primary' : 'text-foreground'
                        )}
                      >
                        {campus.name}
                      </span>
                      {field.value === campus.id && (
                        <div className="absolute top-1.5 right-1.5 bg-primary text-primary-foreground rounded-full p-0.5">
                          <Check className="h-2.5 w-2.5" />
                        </div>
                      )}
                    </button>
                  ))
                )}
              </div>
            )}
          />
          {errors.campus_id && (
            <p className="text-xs text-destructive">{errors.campus_id.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="document_type_id" className="text-sm">
            Document Type
          </Label>
          <Controller
            name="document_type_id"
            control={control}
            render={({ field }) => (
              <Select
                options={documentTypeOptions}
                placeholder="Select a document type"
                value={field.value?.toString()}
                onValueChange={(value) => field.onChange(Number(value))}
                disabled={isLoadingDocumentTypes}
              />
            )}
          />
          {errors.document_type_id && (
            <p className="text-xs text-destructive">{errors.document_type_id.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="purpose" className="text-sm">
            Purpose
          </Label>
          <Textarea
            id="purpose"
            placeholder="Enter the purpose of your document request"
            rows={3}
            className="text-sm"
            {...register('purpose')}
          />
          {errors.purpose && <p className="text-xs text-destructive">{errors.purpose.message}</p>}
        </div>

        <div className="flex justify-end space-x-2 pt-2">
          <Button type="button" variant="outline" onClick={controller.closeFn} size="sm">
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving} size="sm">
            {isSaving ? 'Saving...' : isEdit ? 'Update Request' : 'Submit Request'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
