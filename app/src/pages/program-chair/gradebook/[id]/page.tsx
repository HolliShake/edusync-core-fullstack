import TitledPage from '@/components/pages/titled.page';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { decryptIdFromUrl } from '@/lib/hash';
import { useGetGradeBookById } from '@rest/api';
import { ChevronLeft } from 'lucide-react';
import type React from 'react';
import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import GradeBookView from '@/views/shared/gradebook.view';
import type { GradeBook } from '@rest/models/gradeBook';

export default function GradebookDetailPage(): React.ReactNode {
  const { gradebookId } = useParams<{ gradebookId: string }>();
  const navigate = useNavigate();
  const parsedGradebookId = useMemo(() => {
    if (!gradebookId) return null;
    return decryptIdFromUrl(gradebookId);
  }, [gradebookId]);

  const { data: gradebookResponse, isLoading } = useGetGradeBookById(parsedGradebookId ?? 0, {
    query: {
      enabled: !!parsedGradebookId,
    },
  });

  const gradebook: GradeBook | undefined = useMemo(
    () => gradebookResponse?.data as GradeBook,
    [gradebookResponse]
  );

  if (isLoading) {
    return (
      <TitledPage
        title={
          <div className="flex gap-2 items-center">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-48" />
          </div>
        }
        description="Loading gradebook details"
      >
        <div className="space-y-6">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </TitledPage>
    );
  }

  if (!gradebook) {
    return (
      <TitledPage title="Not Found" description="Gradebook not found">
        <div className="text-center py-8">
          <p className="text-muted-foreground">Gradebook not found</p>
          <Button className="mt-4" onClick={() => navigate('/program-chair/gradebook')}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Gradebooks
          </Button>
        </div>
      </TitledPage>
    );
  }

  return (
    <TitledPage
      title={gradebook.title}
      description={`Comprehensive grading management for ${gradebook.title}`}
    >
      <GradeBookView gradebook={gradebook} />
    </TitledPage>
  );
}
