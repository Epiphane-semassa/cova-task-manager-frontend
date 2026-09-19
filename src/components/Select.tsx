import type { SelectHTMLAttributes } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export function Select({ label, error, className = '', id, name, children, ...rest }: SelectProps) {
  const fieldId = id ?? name;
  const classes = ['select', error ? 'has-error' : '', className].filter(Boolean).join(' ');

  return (
    <div className="field">
      {label && <label className="field__label" htmlFor={fieldId}>{label}</label>}
      <select id={fieldId} name={name} className={classes} aria-invalid={!!error} {...rest}>
        {children}
      </select>
      {error && <span className="field__error">{error}</span>}
    </div>
  );
}