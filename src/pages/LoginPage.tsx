import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { Button } from '../components/Button';
import { Icon } from '../components/Icon';
import { Input } from '../components/Input';
import { useToast } from '../components/toast-context';
import { useAuth } from '../features/auth/hooks/useAuth';
import { extractApiErrorMessage } from '../lib/api-error';

const loginSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, 'Le nom d’utilisateur est obligatoire')
    .min(6, 'Le nom d’utilisateur doit contenir au moins 6 caractères'),
  password: z.string().min(1, 'Le mot de passe est obligatoire').min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginPage() {
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: '', password: '' },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setSubmitting(true);
    try {
      await login(values);
      toast.success('Connexion réussie. Bienvenue !');
      navigate('/tasks', { replace: true });
    } catch (error) {
      toast.error(extractApiErrorMessage(error, 'Connexion impossible. Vérifiez vos identifiants.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card__header">
          <span className="auth-card__brand">
            <Icon name="logo" />
          </span>
          <h1 className="auth-card__title">Connexion</h1>
          <p className="auth-card__subtitle">Accédez à votre tableau de tâches</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Input
            label="Nom d’utilisateur"
            type="text"
            autoComplete="username"
            placeholder="ex : johndoe"
            error={errors.username?.message}
            {...register('username')}
          />
          <Input
            label="Mot de passe"
            type="password"
            autoComplete="current-password"
            placeholder="Votre mot de passe"
            error={errors.password?.message}
            {...register('password')}
          />
          <div className="auth-form__actions">
            <Button type="submit" loading={submitting} style={{ width: '100%' }}>
              Se connecter
            </Button>
          </div>
        </form>

        <p className="auth-switch">
          Pas encore de compte ? <Link to="/register">Créer un compte</Link>
        </p>
      </div>
    </div>
  );
}