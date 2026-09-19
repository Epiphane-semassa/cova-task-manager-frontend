import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { client } from './api/client.gen';
import { setupApiInterceptors } from './api/interceptors';
import { apiClientBaseUrl } from './config/env';
import { App } from './App';
import { ToastProvider } from './components/ToastProvider';
import './index.css';
import './styles/index.scss';

client.setConfig({
  baseURL: apiClientBaseUrl,
});

setupApiInterceptors();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      retry: 1,
      refetchOnMount: 'always',
      refetchOnWindowFocus: false,
    },
  },
});

const rootElement = document.getElementById('root');

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <App />
        </ToastProvider>
      </QueryClientProvider>
    </StrictMode>,
  );
}