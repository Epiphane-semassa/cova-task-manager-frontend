interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  center?: boolean;
  label?: string;
}

export function Spinner({ size = 'md', center = false, label }: SpinnerProps) {
  const classes = ['spinner', `spinner--${size}`, center ? 'spinner--center' : '']
    .filter(Boolean)
    .join(' ');
  return <div className={classes} role="status" aria-label={label ?? 'Chargement'} aria-live="polite" />;
}