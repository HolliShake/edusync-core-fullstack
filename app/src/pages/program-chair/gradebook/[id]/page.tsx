import { useConfirm } from '@/components/confirm.provider';
import Menu from '@/components/custom/menu.component';
import { useModal } from '@/components/custom/modal.component';
import TitledPage from '@/components/pages/titled.page';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { decryptIdFromUrl } from '@/lib/hash';
import {
  useDeleteGradeBookItem,
  useDeleteGradeBookItemDetail,
  useGetGradeBookById,
} from '@rest/api';
import type { GradeBookItem, GradeBookItemDetail } from '@rest/models';
import { DeleteIcon, EditIcon, EllipsisIcon, PlusIcon } from 'lucide-react';
import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import GradebookItemDetailModal from './gradebook-item-detail.modal';
import GradebookItemModal from './gradebook-item.modal';

export default function GradebookDetailPage() {
  const { gradebookId } = useParams<{ gradebookId: string }>();
  const navigate = useNavigate();
  const parsedGradebookId = useMemo(() => {
    if (!gradebookId) return null;
    return decryptIdFromUrl(gradebookId);
  }, [gradebookId]);

  const itemController = useModal<GradeBookItem>();
  const itemDetailController = useModal<GradeBookItemDetail & { gradebook_item_id?: number }>();
  const confirm = useConfirm();

  const {
    data: gradebookResponse,
    isLoading,
    refetch,
  } = useGetGradeBookById(parsedGradebookId ?? 0, {
    query: {
      enabled: !!parsedGradebookId,
    },
  });

  const { mutateAsync: deleteGradeBookItem } = useDeleteGradeBookItem();
  const { mutateAsync: deleteGradeBookItemDetail } = useDeleteGradeBookItemDetail();

  const gradebook = useMemo(() => gradebookResponse?.data, [gradebookResponse]);

  const handleDeleteItem = async (item: GradeBookItem) => {
    confirm.confirm(async () => {
      try {
        await deleteGradeBookItem({ id: item.id as number });
        toast.success('Gradebook item deleted successfully');
        refetch();
      } catch (error) {
        toast.error('Failed to delete gradebook item');
        console.error('Delete error:', error);
      }
    });
  };

  const handleDeleteItemDetail = async (detail: GradeBookItemDetail) => {
    confirm.confirm(async () => {
      try {
        await deleteGradeBookItemDetail({ id: detail.id as number });
        toast.success('Item detail deleted successfully');
        refetch();
      } catch (error) {
        toast.error('Failed to delete item detail');
        console.error('Delete error:', error);
      }
    });
  };

  const totalWeight = useMemo(() => {
    const weight =
      gradebook?.gradebook_items?.reduce((sum, item) => sum + (Number(item.weight) || 0), 0) || 0;
    return Number(weight);
  }, [gradebook]);

  const getItemDetailsTotalWeight = (item: GradeBookItem) => {
    const weight =
      item.gradebook_item_details?.reduce((sum, detail) => sum + (Number(detail.weight) || 0), 0) ||
      0;
    return Number(weight);
  };

  if (isLoading) {
    return (
      <TitledPage title="Loading..." description="Loading gradebook details">
        <div className="space-y-4">
          <Skeleton className="h-10 w-48" />
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
            Back to Gradebooks
          </Button>
        </div>
      </TitledPage>
    );
  }

  return (
    <TitledPage title={gradebook.title} description={`Manage items for ${gradebook.title}`}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Button onClick={() => itemController.openFn()} disabled={totalWeight >= 100}>
              <PlusIcon className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </div>
        </div>

        {/* Summary Card */}
        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
            <CardDescription>Overview of gradebook items and weights</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Item(s)</p>
                <p className="text-2xl font-bold">{gradebook.gradebook_items?.length || 0}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Weight</p>
                <p className="text-2xl font-bold">{totalWeight.toFixed(2)}%</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Status</p>
                <p
                  className={`text-2xl font-bold ${totalWeight === 100 ? 'text-green-600' : 'text-orange-600'}`}
                >
                  {totalWeight === 100 ? 'Complete' : 'Incomplete'}
                </p>
              </div>
            </div>
            {totalWeight !== 100 && (
              <div className="mt-4 p-3 bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 rounded-md">
                <p className="text-sm text-orange-800 dark:text-orange-300">
                  ⚠️ Total weight should equal 100%. Current total: {totalWeight.toFixed(2)}%
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Items List */}
        <div className="space-y-4">
          {!gradebook.gradebook_items || gradebook.gradebook_items.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground mb-4">No gradebook items yet</p>
                <Button onClick={() => itemController.openFn()}>
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Add Your First Item
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Tabs
              defaultValue={gradebook.gradebook_items?.[0]?.id?.toString() || ''}
              className="w-full"
            >
              <TabsList className="w-full justify-start overflow-x-auto flex-wrap h-auto">
                {gradebook.gradebook_items?.map((item) => (
                  <TabsTrigger
                    key={item.id}
                    value={item.id?.toString() || ''}
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    {item.title} ({item.weight}%)
                  </TabsTrigger>
                ))}
              </TabsList>
              {gradebook.gradebook_items?.map((item) => {
                const itemDetailsTotalWeight = getItemDetailsTotalWeight(item);
                const isItemDetailsWeightComplete = itemDetailsTotalWeight === 100;

                return (
                  <TabsContent key={item.id} value={item.id?.toString() || ''}>
                    <Card>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="flex items-center gap-2">
                              {item.title}
                              <span className="text-sm font-normal text-muted-foreground">
                                ({item.weight}%)
                              </span>
                            </CardTitle>
                            <CardDescription>
                              {item.gradebook_item_details?.length || 0} detail(s)
                            </CardDescription>
                          </div>
                          <Menu
                            items={[
                              {
                                label: 'Add Detail',
                                icon: <PlusIcon />,
                                variant: 'default',
                                onClick: () => {
                                  itemDetailController.openFn({
                                    gradebook_item_id: item.id,
                                  } as any);
                                },
                                disabled: itemDetailsTotalWeight >= 100,
                              },
                              {
                                label: 'Edit',
                                icon: <EditIcon />,
                                variant: 'default',
                                onClick: () => {
                                  itemController.openFn(item);
                                },
                              },
                              {
                                label: 'Delete',
                                icon: <DeleteIcon />,
                                variant: 'destructive',
                                onClick: () => {
                                  handleDeleteItem(item);
                                },
                              },
                            ]}
                            trigger={
                              <Button variant="outline" size="icon">
                                <EllipsisIcon />
                              </Button>
                            }
                          />
                        </div>
                      </CardHeader>
                      {item.gradebook_item_details && item.gradebook_item_details.length > 0 ? (
                        <CardContent>
                          <div className="space-y-4">
                            {/* Details Weight Summary */}
                            <div className="p-3 border rounded-md bg-muted/50">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm font-medium">Details Total Weight</p>
                                  <p className="text-xs text-muted-foreground">
                                    Sum of all detail weights
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p
                                    className={`text-lg font-bold ${
                                      isItemDetailsWeightComplete
                                        ? 'text-green-600'
                                        : 'text-orange-600'
                                    }`}
                                  >
                                    {itemDetailsTotalWeight.toFixed(2)}%
                                  </p>
                                  <p
                                    className={`text-xs ${
                                      isItemDetailsWeightComplete
                                        ? 'text-green-600'
                                        : 'text-orange-600'
                                    }`}
                                  >
                                    {isItemDetailsWeightComplete ? 'Complete' : 'Incomplete'}
                                  </p>
                                </div>
                              </div>
                              {!isItemDetailsWeightComplete && (
                                <div className="mt-2 p-2 bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 rounded">
                                  <p className="text-xs text-orange-800 dark:text-orange-300">
                                    ⚠️ Details weight should equal 100%
                                  </p>
                                </div>
                              )}
                            </div>

                            {/* Details List */}
                            <div className="space-y-2">
                              {item.gradebook_item_details.map((detail) => (
                                <div
                                  key={detail.id}
                                  className="flex items-center justify-between p-3 border rounded-md bg-muted/30"
                                >
                                  <div className="flex-1">
                                    <p className="font-medium">{detail.title}</p>
                                    <p className="text-sm text-muted-foreground">
                                      Score Range: {detail.min_score} - {detail.max_score} | Weight:{' '}
                                      {detail.weight}%
                                    </p>
                                  </div>
                                  <div className="flex gap-1">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => itemDetailController.openFn(detail)}
                                    >
                                      <EditIcon className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleDeleteItemDetail(detail)}
                                    >
                                      <DeleteIcon className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      ) : (
                        <CardContent>
                          <div className="text-center py-8 text-muted-foreground">
                            <p className="mb-2">No details added yet</p>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                itemDetailController.openFn({ gradebook_item_id: item.id } as any);
                              }}
                            >
                              <PlusIcon className="w-4 h-4 mr-2" />
                              Add Detail
                            </Button>
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  </TabsContent>
                );
              })}
            </Tabs>
          )}
        </div>
      </div>

      <GradebookItemModal
        controller={itemController}
        gradebookId={parsedGradebookId ?? 0}
        onSubmit={() => refetch()}
      />

      <GradebookItemDetailModal controller={itemDetailController} onSubmit={() => refetch()} />
    </TitledPage>
  );
}
