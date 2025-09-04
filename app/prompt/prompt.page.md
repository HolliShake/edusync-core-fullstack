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
import TitledPage from '@/components/pages/titled.page';
import type React from 'react';

export default function AdminCampus(): React.ReactNode {
  return (
    <TitledPage title="Campuses" description="Manage your campuses">
      <div>sadas</div>
    </TitledPage>
  );
}
```
