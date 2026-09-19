const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const proxyTarget = import.meta.env.VITE_PROXY_TARGET;

export const env = {
  apiBaseUrl,
  proxyTarget,
};

const baseUrl = import.meta.env.DEV && proxyTarget ? '' : apiBaseUrl;

export const apiClientBaseUrl = baseUrl;

if (!apiBaseUrl && !proxyTarget) {
  throw new Error('Variable manquante : VITE_API_BASE_URL dans .env');
}