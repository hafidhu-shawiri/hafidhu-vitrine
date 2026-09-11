'use client';

/**
 * Champs de formulaire.
 *
 * Chaque champ relie explicitement son message d'erreur au contrôle via
 * aria-describedby — ce que le prototype ne faisait pas. Les labels sont
 * toujours visibles : jamais de placeholder en guise d'étiquette.
 */

import { useId } from 'react';
import { Icon } from '@/components/ui/Icon';
import { cx } from '@/components/ui/primitives';

const controlBase =
  'w-full rounded-[12px] border bg-surface px-3.5 py-3 text-[0.9375rem] text-ink ' +
  'transition-colors placeholder:text-muted ' +
  'focus:border-teal focus:outline-none focus:ring-3 focus:ring-teal/12 ' +
  'disabled:cursor-not-allowed disabled:bg-surface-subtle disabled:text-muted';

type BaseProps = {
  label: string;
  name: string;
  value: string;
  error?: string;
  hint?: string;
  required?: boolean;
  disabled?: boolean;
  wide?: boolean;
  onChange: (value: string) => void;
};

function Wrapper({
  label,
  hint,
  required,
  error,
  wide,
  controlId,
  errorId,
  hintId,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  error?: string;
  wide?: boolean;
  controlId: string;
  errorId: string;
  hintId: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cx(wide && 'sm:col-span-2')}>
      <label htmlFor={controlId} className="mb-2 block text-[0.875rem] font-semibold text-ink">
        {label}
        {required ? (
          <span className="text-error" aria-hidden="true">
            {' '}
            *
          </span>
        ) : null}
        {hint ? (
          <span id={hintId} className="ml-1 font-normal text-muted">
            {hint}
          </span>
        ) : null}
      </label>

      {children}

      {error ? (
        <p
          id={errorId}
          role="alert"
          className="mt-2 flex items-start gap-1.5 text-[0.8125rem] leading-[1.5] text-error"
        >
          <Icon name="alert" size={14} className="mt-0.5 shrink-0" />
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function TextField({
  type = 'text',
  placeholder,
  autoComplete,
  ...props
}: BaseProps & { type?: 'text' | 'email' | 'tel'; placeholder?: string; autoComplete?: string }) {
  const id = useId();
  const controlId = `${id}-control`;
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  return (
    <Wrapper {...props} controlId={controlId} errorId={errorId} hintId={hintId}>
      <input
        id={controlId}
        name={props.name}
        type={type}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        disabled={props.disabled}
        required={props.required}
        aria-invalid={props.error ? true : undefined}
        aria-describedby={
          [props.error ? errorId : null, props.hint ? hintId : null].filter(Boolean).join(' ') ||
          undefined
        }
        className={cx(controlBase, props.error ? 'border-error' : 'border-border-strong')}
      />
    </Wrapper>
  );
}

export function SelectField({
  options,
  ...props
}: BaseProps & { options: readonly string[] }) {
  const id = useId();
  const controlId = `${id}-control`;
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  return (
    <Wrapper {...props} controlId={controlId} errorId={errorId} hintId={hintId}>
      <select
        id={controlId}
        name={props.name}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        disabled={props.disabled}
        required={props.required}
        aria-invalid={props.error ? true : undefined}
        aria-describedby={props.error ? errorId : undefined}
        className={cx(controlBase, props.error ? 'border-error' : 'border-border-strong')}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </Wrapper>
  );
}

export function TextAreaField({
  rows = 5,
  placeholder,
  ...props
}: BaseProps & { rows?: number; placeholder?: string }) {
  const id = useId();
  const controlId = `${id}-control`;
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  return (
    <Wrapper {...props} controlId={controlId} errorId={errorId} hintId={hintId}>
      <textarea
        id={controlId}
        name={props.name}
        rows={rows}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        placeholder={placeholder}
        disabled={props.disabled}
        required={props.required}
        aria-invalid={props.error ? true : undefined}
        aria-describedby={
          [props.error ? errorId : null, props.hint ? hintId : null].filter(Boolean).join(' ') ||
          undefined
        }
        className={cx(
          controlBase,
          'resize-y',
          props.error ? 'border-error' : 'border-border-strong'
        )}
      />
    </Wrapper>
  );
}

/**
 * Champ leurre anti-robots : hors flux, masqué aux lecteurs d'écran et
 * exclu de la navigation clavier. Un visiteur ne peut pas le remplir.
 */
export function HoneypotField({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div aria-hidden="true" className="absolute h-px w-px overflow-hidden opacity-0">
      <label htmlFor="website-hp">Ne pas remplir ce champ</label>
      <input
        id="website-hp"
        name="website"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
