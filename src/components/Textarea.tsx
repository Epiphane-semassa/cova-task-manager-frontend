import type { TextareaHTMLAttributes } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({ label, error, className = '', id, name, rows = 4, ...rest }: TextareaProps) {
  const fieldId = id ?? name;
  const classes = ['textarea', error ? 'has-error' : '', className].filter(Boolean).join(' ');

  return (
    <div className="field">
      {label && <label className="field__label" htmlFor={fieldId}>{label}</label>}
      <textarea id={fieldId} name={name} rows={rows} className={classes} aria-invalid={!!error} {...rest} />
      {error && <span className="field__error">{error}</span>}
    </div>
  );
}