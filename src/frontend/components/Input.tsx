import { ErrorIndicator } from '@/frontend/components/ErrorIndicator';

export function Input({
  label,
  name,
  placeholder,
  errors,
  disabled,
  onChange,
}: {
  label: string;
  name: string;
  placeholder: string;
  errors: string[];
  disabled?: boolean;
  onChange?: () => void;
}) {
  const invalid = errors.length > 0;
  const contentLength = label.length + placeholder.length;
  const inputProps = {
    'aria-errormessage': errors.join(', '),
    'aria-invalid': invalid,
    autoComplete: 'off',
    autoCorrect: 'off',
    className: 'grow',
    placeholder,
    spellCheck: 'false',
    type: 'text',
  } as const;

  return (
    <>
      <ErrorIndicator show={invalid}>
        <label
          className={`input w-full gap-0 tracking-0 box-content min-w-[${contentLength}ch] ${invalid ? 'input-error' : 'input-primary'}`.trimEnd()}
        >
          {label}
          {disabled ? (
            <input
              {...inputProps}
              disabled={true}
              key={`disabled-${name}`}
              name={`disabled-${name}`}
            />
          ) : (
            <input key={name} {...inputProps} name={name} onChange={onChange} />
          )}
        </label>
      </ErrorIndicator>

      <p className="h-6 leading-6 text-error">{errors.join(', ')}</p>
    </>
  );
}
