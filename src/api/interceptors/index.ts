import { client } from '../client.gen';
import { authRequestInterceptor } from './auth.interceptor';
import { setupRefreshInterceptor } from './refresh.interceptor';

export function setupApiInterceptors(): void {
  client.instance.interceptors.request.use(authRequestInterceptor);
  setupRefreshInterceptor();
}

export { authRequestInterceptor } from './auth.interceptor';
export { setupRefreshInterceptor } from './refresh.interceptor';