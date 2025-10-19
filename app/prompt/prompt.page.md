**You are an AI agent specialized in ReactJS and TypeScript development**

# React Component Development Guidelines

When creating React components, please follow these comprehensive guidelines to ensure consistency, maintainability, and best practices:

## Page Component Structure

### Core Requirements

- **Always** use the `TitledPage` component from `@/components/pages/titled.page` as the wrapper for all page-level components
- Import React types properly using type-only imports: `import type React from 'react';`
- Use explicit return type annotations: `(): React.ReactNode`
- Follow PascalCase naming convention: `export default function ComponentName()`
- Ensure component names are descriptive and match their functionality

### TitledPage Props

The `TitledPage` component accepts the following props:

- `title` (required): Main page heading
- `description` (optional): Subtitle or page description
- `breadcrumb` (optional): Custom breadcrumb navigation array
- `children` (required): Page content

## Code Style & Standards

### Import Organization

1. React and React-related imports first
2. Third-party library imports
3. Internal component imports (using `@/` alias)
4. Type-only imports should use `import type`

```tsx
import ItemModal from '@/components/item/item.modal';
import Menu from '@/components/custom/menu.component';
import { useModal } from '@/components/custom/modal.component';
import Table, { type TableColumn } from '@/components/custom/table.component';
import TitledPage from '@/components/pages/titled.page';
import { Button } from '@/components/ui/button';
import { useGetItemsPaginated } from '@rest/api';
import { DeleteIcon, EditIcon, EllipsisIcon } from 'lucide-react';
import type React from 'react';
import { useMemo, useState } from 'react';

export default function AdminItems(): React.ReactNode {
  const [page, setPage] = useState(1);
  const [rows] = useState(10);

  const { data: items } = useGetItemsPaginated({
    page,
    rows,
  });

  const controller = useModal<any>();

  const columns = useMemo<TableColumn<any>[]>(
    () => [
      {
        key: 'name',
        title: 'Name',
        dataIndex: 'name',
      },
      {
        key: 'description',
        title: 'Description',
        dataIndex: 'description',
      },
      {
        key: 'category',
        title: 'Category',
        dataIndex: 'category',
      },
      {
        key: 'actions',
        title: 'Actions',
        dataIndex: 'actions',
        render: (_, row) => (
          <Menu
            items={[
              {
                label: 'Edit',
                icon: <EditIcon />,
                variant: 'default',
                onClick: () => {
                  controller.openFn(row);
                },
              },
              {
                label: 'Delete',
                icon: <DeleteIcon />,
                variant: 'destructive',
                onClick: () => {
                  console.log('Delete', row);
                },
              },
            ]}
            trigger={
              <Button variant="outline" size="icon">
                <EllipsisIcon />
              </Button>
            }
          />
        ),
      },
    ],
    []
  );
  const tableItems = useMemo(() => items?.data?.data ?? [], [items]);
  const paginationMeta = useMemo(() => {
    return items?.data;
  }, [items]);

  return (
    <TitledPage title="Items" description="Manage your items">
      <Button onClick={() => controller.openFn()}>Add Item</Button>
      <Table
        columns={columns}
        rows={tableItems}
        itemsPerPage={rows}
        pagination={paginationMeta}
        onPageChange={setPage}
        showPagination={true}
      />
      <ItemModal
        controller={controller}
        onSubmit={(data) => {
          console.log(data);
        }}
      />
    </TitledPage>
  );
}
```
