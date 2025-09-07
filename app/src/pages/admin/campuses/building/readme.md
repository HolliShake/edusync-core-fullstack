# Building Management

This folder contains components and pages for managing building information within the campus administration system.

## Overview

The building management section provides comprehensive functionality for viewing and managing individual buildings, including their associated classrooms and facilities.

## Features

- **Building Details**: View detailed information about a specific building including name, short name, location coordinates, and creation date
- **Classroom Management**: Browse and manage classrooms within the building
- **Location Tracking**: Display building coordinates and location information
- **Administrative Actions**: Edit building details and manage building-related data

## Components Structure

This folder typically contains:

- `content.tsx` - Main content component displaying building information and tabs
- `classroom.tab.tsx` - Tab component for managing classrooms within the building
- Additional components for building-specific functionality

## Data Management

The building pages utilize:

- Building context for accessing current building data
- Paginated API calls for classroom listings
- CRUD operations for building and classroom management
- Real-time data updates and refetching

## Navigation

Users can navigate between different aspects of building management through:

- Tabbed interface for different building sections (details, classrooms, etc.)
- Breadcrumb navigation showing campus > building hierarchy
- Action menus for editing and managing building data

## Integration

This module integrates with:

- Campus management system
- Classroom scheduling system
- Location services for coordinate display
- User permission system for administrative actions
