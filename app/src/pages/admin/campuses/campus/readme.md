# Campus Management

This folder contains components and pages for managing individual campus information within the campus administration system.

## Overview

The campus management section provides comprehensive functionality for viewing and managing a specific campus, including its associated colleges and buildings. This serves as the central hub for campus-level administration.

## Features

- **Campus Details**: View detailed information about a specific campus including name, short name, and administrative metadata
- **College Management**: Browse and manage colleges within the campus through a dedicated tab interface
- **Building Management**: View and manage all buildings associated with the campus
- **Statistics Dashboard**: Display key metrics and statistics for the campus
- **Tabbed Navigation**: Organized interface for switching between different campus aspects

## Components Structure

This folder contains:

- `content.tsx` - Main content component displaying campus information, statistics cards, and tabbed interface
- `college.tab.tsx` - Tab component for managing colleges within the campus
- `building.tab.tsx` - Tab component for managing buildings within the campus
- Additional components for campus-specific functionality

## Data Management

The campus pages utilize:

- Campus context for accessing current campus data
- Paginated API calls for colleges and buildings listings
- CRUD operations for campus, college, and building management
- Real-time data updates and refetching
- Local storage for tab state persistence

## User Interface

The interface includes:

- **Header Section**: Campus name, short name badge, and administrative indicators
- **Statistics Cards**: Visual cards showing campus metrics with gradient backgrounds and icons
- **Tabbed Interface**: Organized tabs for colleges and buildings management
- **Loading States**: Comprehensive skeleton loading for all sections
- **Responsive Design**: Adaptive layout for different screen sizes

## Navigation

Users can navigate between different aspects of campus management through:

- Tabbed interface for colleges and buildings
- Persistent tab state using localStorage
- Breadcrumb navigation showing campus hierarchy
- Action menus for editing and managing campus data

## Integration

This module integrates with:

- College management system for academic structure
- Building management system for physical infrastructure
- User permission system for administrative actions
- Campus context provider for data sharing
- REST API endpoints for data operations

## Tab Management

The system includes:

- **Colleges Tab**: Manage academic colleges within the campus
- **Buildings Tab**: Manage physical buildings and their locations
- State persistence across browser sessions
- Dynamic tab switching with proper data loading
