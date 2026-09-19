interface BadgeProps {
  tone?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  dot?: boolean;
  children: string;
}

export function Badge({ tone = 'default', dot = false, children }: BadgeProps) {
  const classes = ['badge', `badge--${tone}`, dot ? 'badge--dot' : ''].filter(Boolean).join(' ');
  return <span className={classes}>{children}</span>;
}