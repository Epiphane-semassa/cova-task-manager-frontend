import { AxiosError } from 'axios';

export function extractApiErrorMessage(error: unknown, fallback?: string): string {
  if (error instanceof AxiosError) {
    const body = error.response?.data as { message?: unknown } | undefined;
    if (body && typeof body.message === 'string' && body.message.trim()) {
      return body.message;
    }
    if (error.message) {
      return error.message;
    }
  }
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return fallback ?? 'Une erreur est survenue';
}

export function getApiStatus(error: unknown): number | undefined {
  if (error instanceof AxiosError) {
    return error.response?.status;
  }
  return undefined;
}