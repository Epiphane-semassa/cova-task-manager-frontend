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

const registerSchema = z
  .object({
    fullName: z.string().trim().min(1, 'Le nom complet est obligatoire'),
    username: z
      .string()
      .trim()
      .min(1, 'Le nom d’utilisateur est obligatoire')
      .min(6, 'Le nom d’utilisateur doit contenir au moins 6 caractères'),
    password: z.string().min(1, 'Le mot de passe est obligatoire').min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
    confirmPassword: z.string().min(1, 'La confirmation est obligatoire'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Les mots de passe ne correspondent pas',
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterPage() {
  const { register: registerAccount } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: '', username: '', password: '', confirmPassword: '' },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setSubmitting(true);
    try {
      await registerAccount({
        fullName: values.fullName,
        username: values.username,
        password: values.password,
      });
      toast.success('Compte créé avec succès. Vous pouvez maintenant vous connecter.');
      navigate('/login', { replace: true });
    } catch (error) {
      toast.error(extractApiErrorMessage(error, 'Inscription impossible. Veuillez réessayer.'));
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
          <h1 className="auth-card__title">Créer un compte</h1>
          <p className="auth-card__subtitle">Rejoignez Task Manager en quelques secondes</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Input
            label="Nom complet"
            type="text"
            autoComplete="name"
            placeholder="ex : John Doe"
            error={errors.fullName?.message}
            {...register('fullName')}
          />
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
            autoComplete="new-password"
            placeholder="8 caractères minimum"
            error={errors.password?.message}
            {...register('password')}
          />
          <Input
            label="Confirmer le mot de passe"
            type="password"
            autoComplete="new-password"
            placeholder="Répétez le mot de passe"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />
          <div className="auth-form__actions">
            <Button type="submit" loading={submitting} style={{ width: '100%' }}>
              Créer le compte
            </Button>
          </div>
        </form>

        <p className="auth-switch">
          Déjà un compte ? <Link to="/login">Se connecter</Link>
        </p>
      </div>
    </div>
  );
}