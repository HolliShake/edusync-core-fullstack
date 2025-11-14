# Gradebook Management System

## Overview
This is a complete gradebook management system for program chairs to create and manage gradebook templates for their academic programs.

## Features

### 1. Main Gradebook Page (`page.tsx`)
**Location**: `/program-chair/gradebook`

**Features**:
- View all gradebooks in a paginated table
- Create new gradebook templates
- Edit existing gradebooks
- Delete gradebooks (with confirmation)
- Navigate to detail view to manage items
- Display gradebook information including:
  - Title
  - Associated academic program
  - Number of items
  - Template type

**Actions**:
- **Create**: Opens modal to create new gradebook
- **View Details**: Navigate to detail page to manage items
- **Edit**: Opens modal to edit gradebook
- **Delete**: Deletes gradebook after confirmation

### 2. Gradebook Detail Page (`[id]/page.tsx`)
**Location**: `/program-chair/gradebook/:id`

**Features**:
- View and manage gradebook items and their details
- Summary dashboard showing:
  - Total number of items
  - Total weight (should equal 100%)
  - Status indicator (Complete/Incomplete)
- Create, edit, and delete gradebook items
- Create, edit, and delete item details within each item
- Visual weight validation with warnings

**Hierarchy**:
```
Gradebook (e.g., "Final Assessment")
├── GradeBookItem (e.g., "Midterm Exam" - 30%)
│   ├── GradeBookItemDetail (e.g., "Written Test" - 70%)
│   └── GradeBookItemDetail (e.g., "Practical Test" - 30%)
├── GradeBookItem (e.g., "Quizzes" - 20%)
│   ├── GradeBookItemDetail (e.g., "Quiz 1" - 33.33%)
│   ├── GradeBookItemDetail (e.g., "Quiz 2" - 33.33%)
│   └── GradeBookItemDetail (e.g., "Quiz 3" - 33.34%)
└── GradeBookItem (e.g., "Final Exam" - 50%)
    └── GradeBookItemDetail (e.g., "Comprehensive Test" - 100%)
```

### 3. Modal Components

#### Gradebook Modal (`gradebook.modal.tsx`)
- Create/Edit gradebook
- Fields:
  - Title (required)
- Auto-fills:
  - Academic program from session
  - is_template: true (for program chairs)
  - section_id: null (templates don't have sections)

#### Gradebook Item Modal (`[id]/gradebook-item.modal.tsx`)
- Create/Edit gradebook items
- Fields:
  - Title (required)
  - Weight (0-100%, required)
- Validation:
  - Weight must be between 0 and 100
  - Helper text: Total weight should equal 100%

#### Gradebook Item Detail Modal (`[id]/gradebook-item-detail.modal.tsx`)
- Create/Edit item details
- Fields:
  - Title (required)
  - Minimum Score (required, ≥ 0)
  - Maximum Score (required, ≥ min_score)
  - Weight (0-100%, required)
- Validation:
  - Max score must be ≥ min score
  - Weight must be between 0 and 100

## Data Models

### GradeBook
```typescript
{
  id?: number;
  section_id?: number | null;
  academic_program_id: number | null;
  is_template: boolean;
  title: string;
  gradebook_items?: GradeBookItem[];
}
```

### GradeBookItem
```typescript
{
  id?: number;
  gradebook_id: number;
  title: string;
  weight: number;
  gradebook_item_details?: GradeBookItemDetail[];
}
```

### GradeBookItemDetail
```typescript
{
  id?: number;
  gradebook_item_id: number;
  title: string;
  min_score: number;
  max_score: number;
  weight: number;
}
```

## API Endpoints Used

- `useGetGradeBookPaginated` - List all gradebooks
- `useGetGradeBookById` - Get single gradebook with items
- `useCreateGradeBook` - Create new gradebook
- `useUpdateGradeBook` - Update gradebook
- `useDeleteGradeBook` - Delete gradebook
- `useCreateGradeBookItem` - Create item
- `useUpdateGradeBookItem` - Update item
- `useDeleteGradeBookItem` - Delete item
- `useCreateGradeBookItemDetail` - Create item detail
- `useUpdateGradeBookItemDetail` - Update item detail
- `useDeleteGradeBookItemDetail` - Delete item detail

## Navigation

The gradebook routes are configured in `/src/routes/program-chair.tsx`:
- Main page: `/program-chair/gradebook`
- Detail page: `/program-chair/gradebook/:id` (hidden from sidebar)

## User Experience

1. **Creating a Gradebook Template**:
   - Click "Create Gradebook"
   - Enter a title (e.g., "Standard Assessment Template")
   - Click "Create"

2. **Adding Items**:
   - Click "View Details" on a gradebook
   - Click "Add Item"
   - Enter title and weight (e.g., "Midterm Exam", 30%)
   - Click "Add"

3. **Adding Item Details**:
   - In the detail view, click the menu (⋯) on an item
   - Select "Add Detail"
   - Enter title, score range, and weight
   - Click "Add"

4. **Weight Validation**:
   - The system shows a warning if total weights don't equal 100%
   - This helps ensure proper grading distribution

## Benefits

- **Reusable Templates**: Create templates once, use across sections
- **Structured Grading**: Clear hierarchy of assessment components
- **Weight Management**: Visual feedback on weight distribution
- **Full CRUD**: Complete create, read, update, delete operations
- **Nested Management**: Manage items and sub-items efficiently

