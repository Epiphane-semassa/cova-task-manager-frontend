import { useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { Icon } from '../../components/Icon';
import { useToast } from '../../components/toast-context';
import { useAuth } from '../auth/hooks/useAuth';
import { extractApiErrorMessage } from '../../lib/api-error';
import { getInitials } from '../../lib/format';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleLogout = async () => {
    setSubmitting(true);
    try {
      await logout();
      toast.success('Vous avez été déconnecté.');
      navigate('/login', { replace: true });
    } catch (error) {
      toast.error(extractApiErrorMessage(error, 'Impossible de vous déconnecter.'));
    } finally {
      setSubmitting(false);
      setConfirmOpen(false);
    }
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header__brand">
          <Icon name="logo" />
          <span>Task Manager</span>
        </div>
        <div className="app-header__user">
          {user && (
            <div className="user-chip">
              <span className="avatar" aria-hidden="true">
                {getInitials(user.fullName || user.username)}
              </span>
              <div className="user-chip__info">
                <span className="user-chip__name">{user.fullName || user.username}</span>
                <span className="user-chip__role">{user.username}</span>
              </div>
            </div>
          )}
          <Button variant="secondary" size="sm" onClick={() => setConfirmOpen(true)}>
            <Icon name="logout" size={14} />
            Se déconnecter
          </Button>
        </div>
      </header>
      <main className="layout-main">{children}</main>

      <ConfirmDialog
        open={confirmOpen}
        title="Se déconnecter"
        message="Voulez-vous vraiment vous déconnecter de votre session ?"
        confirmLabel="Se déconnecter"
        danger
        loading={submitting}
        onConfirm={() => void handleLogout()}
        onClose={() => setConfirmOpen(false)}
      />
    </div>
  );
}