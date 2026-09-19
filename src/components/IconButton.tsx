import type { ButtonHTMLAttributes } from 'react';
import { Icon, type IconName } from './Icon';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: IconName;
  label: string;
  variant?: 'default' | 'danger' | 'ghost';
  size?: 'sm' | 'md';
}

export function IconButton({
  icon,
  label,
  variant = 'default',
  size = 'md',
  className = '',
  ...rest
}: IconButtonProps) {
  const classes = ['icon-btn', `icon-btn--${variant}`, size === 'sm' ? 'icon-btn--sm' : '', className]
    .filter(Boolean)
    .join(' ');

  return (
    <button type="button" className={classes} aria-label={label} title={label} {...rest}>
      <span className="icon-btn__icon">
        <Icon name={icon} />
      </span>
    </button>
  );
}