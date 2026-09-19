import { useCallback, useRef, useState, type ReactNode } from 'react';
import { Icon, type IconName } from './Icon';
import { IconButton } from './IconButton';
import { ToastContext, type ToastContextValue, type ToastItem, type ToastType } from './toast-context';

const TOAST_TYPE_ICON: Record<ToastType, IconName> = {
  success: 'success',
  error: 'alert',
  info: 'info',
};

const TOAST_DURATION = 4000;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const nextId = useRef(0);

  const push = useCallback((type: ToastType, message: string) => {
    const id = nextId.current;
    nextId.current += 1;
    setItems((current) => [...current, { id, type, message }]);
    window.setTimeout(() => {
      setItems((current) => current.filter((item) => item.id !== id));
    }, TOAST_DURATION);
  }, []);

  const remove = useCallback((id: number) => {
    setItems((current) => current.filter((item) => item.id !== id));
  }, []);

  const value: ToastContextValue = {
    toast: {
      success: (message) => push('success', message),
      error: (message) => push('error', message),
      info: (message) => push('info', message),
    },
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-viewport" aria-live="polite">
        {items.map((item) => (
          <div key={item.id} className={`toast toast--${item.type}`} role="alert">
            <span className="toast__icon">
              <Icon name={TOAST_TYPE_ICON[item.type]} />
            </span>
            <p className="toast__message">{item.message}</p>
            <IconButton
              className="toast__close"
              icon="x"
              label="Fermer la notification"
              variant="ghost"
              size="sm"
              onClick={() => remove(item.id)}
            />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}