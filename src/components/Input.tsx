import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = '', id, name, ...rest }: InputProps) {
  const fieldId = id ?? name;
  const classes = ['input', error ? 'has-error' : '', className].filter(Boolean).join(' ');

  return (
    <div className="field">
      {label && <label className="field__label" htmlFor={fieldId}>{label}</label>}
      <input id={fieldId} name={name} className={classes} aria-invalid={!!error} {...rest} />
      {error && <span className="field__error">{error}</span>}
    </div>
  );
}