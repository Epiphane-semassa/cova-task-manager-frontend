import { Icon, type IconName } from './Icon';

interface ToggleOption {
  value: string;
  label: string;
  icon?: IconName;
}

interface ToggleProps {
  options: ToggleOption[];
  value: string;
  onChange: (value: string) => void;
  ariaLabel?: string;
}

export function Toggle({ options, value, onChange, ariaLabel }: ToggleProps) {
  return (
    <div className="toggle" role="tablist" aria-label={ariaLabel}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="tab"
          aria-selected={option.value === value}
          className={['toggle__option', option.value === value ? 'is-active' : '']
            .filter(Boolean)
            .join(' ')}
          onClick={() => onChange(option.value)}
        >
          {option.icon && (
            <span className="toggle__icon">
              <Icon name={option.icon} />
            </span>
          )}
          {option.label}
        </button>
      ))}
    </div>
  );
}