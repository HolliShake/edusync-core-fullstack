/* eslint-disable @typescript-eslint/no-explicit-any */
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { toast } from 'sonner';
import AuthProvider from './auth.provider';
import { ConfirmProvider } from './confirm.provider';
import { ThemeProvider } from './theme.provider';
import { Toaster } from './ui/sonner';

const captureErrorMessage = (error: any): string => {
  // Check for Laravel validation errors (422 Unprocessable Entity)
  if (error?.response?.status === 422 && error?.response?.data?.errors) {
    const errors = error.response.data.errors;
    // Get first error message from validation errors object
    const firstErrorKey = Object.keys(errors)[0];
    if (firstErrorKey && Array.isArray(errors[firstErrorKey])) {
      return errors[firstErrorKey][0];
    }
    return 'Validation error occurred';
  }

  // Check for Laravel error response with status and message
  if (error?.response?.data?.status === 'error' && error?.response?.data?.message) {
    const message = error.response.data.message;
    // Extract user-friendly message from SQL errors
    if (typeof message === 'string' && message.includes('Duplicate entry')) {
      const match = message.match(/Duplicate entry '([^']+)'/);
      if (match) {
        return 'This record already exists. Please check for duplicates.';
      }
      return 'Duplicate entry detected. This record already exists.';
    }
    // Handle foreign key constraint errors
    if (typeof message === 'string' && message.includes('foreign key constraint')) {
      return 'Cannot delete this record because it is being used by other records.';
    }
    // Handle unique constraint violations
    if (typeof message === 'string' && message.includes('Integrity constraint violation')) {
      return 'This operation violates data integrity rules.';
    }
    return message;
  }

  // Check for Laravel exception messages
  if (error?.response?.data?.exception) {
    const exceptionMessage = error.response.data.message || 'Server error occurred';
    return exceptionMessage;
  }

  // Check for standard message property
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  // Check for error property
  if (error?.response?.data?.error) {
    return error.response.data.error;
  }

  // Check for HTTP status codes with default messages
  if (error?.response?.status) {
    switch (error.response.status) {
      case 400:
        return 'Bad request - please check your input';
      case 401:
        return 'Unauthorized - please log in again';
      case 403:
        return 'Forbidden - you do not have permission to perform this action';
      case 404:
        return 'Resource not found';
      case 405:
        return 'Method not allowed';
      case 409:
        return 'Conflict - this resource already exists or is in use';
      case 429:
        return 'Too many requests - please try again later';
      case 500:
        return 'Internal server error - please try again later';
      case 502:
        return 'Bad gateway - server is temporarily unavailable';
      case 503:
        return 'Service unavailable - please try again later';
      case 504:
        return 'Gateway timeout - request took too long';
      default:
        break;
    }
  }

  // Check for generic response data
  if (error?.response?.data) {
    return typeof error.response.data === 'string'
      ? error.response.data
      : JSON.stringify(error.response.data);
  }

  // Check for network/request errors
  if (error?.request && !error?.response) {
    return 'Network error - please check your connection';
  }

  // Check for standard Error objects
  if (error?.message) {
    return error.message;
  }

  // Check for string errors
  if (typeof error === 'string') {
    return error;
  }

  // Check for objects with error property
  if (error?.error) {
    return typeof error.error === 'string' ? error.error : JSON.stringify(error.error);
  }

  // Try to stringify if it's an object
  if (typeof error === 'object' && error !== null) {
    try {
      return JSON.stringify(error);
    } catch {
      return error.toString();
    }
  }

  // Fallback for any other cases
  return 'An unexpected error occurred';
};

export default function Providers({ children }: { children: React.ReactNode }): React.ReactNode {
  const query = new QueryClient({
    defaultOptions: {
      queries: {
        throwOnError(error) {
          toast.error(captureErrorMessage(error));
          return false;
        },
      },
      mutations: {
        throwOnError(error) {
          toast.error(captureErrorMessage(error));
          return false;
        },
      },
    },
  });
  return (
    <ThemeProvider>
      <QueryClientProvider client={query}>
        <AuthProvider>
          <ConfirmProvider>{children}</ConfirmProvider>
        </AuthProvider>
      </QueryClientProvider>
      <Toaster position="top-right" richColors />
    </ThemeProvider>
  );
}
