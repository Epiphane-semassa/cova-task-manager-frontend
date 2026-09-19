import { Link } from 'react-router-dom';
import { Button } from '../components/Button';

export function NotFoundPage() {
  return (
    <div className="not-found">
      <div className="not-found__code">404</div>
      <p className="not-found__title">Page introuvable</p>
      <p className="not-found__description">La page que vous cherchez n’existe pas ou a été déplacée.</p>
      <Link to="/tasks">
        <Button>Retour à mes tâches</Button>
      </Link>
    </div>
  );
}