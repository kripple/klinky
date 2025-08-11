import { ErrorIndicator } from '@/frontend/components/ErrorIndicator';

export function Input({
  prefix,
  name,
  label,
  errors,
  disabled,
  onChange,
}: {
  prefix: string;
  name: string;
  label: string;
  errors: string[];
  disabled?: boolean;
  onChange?: () => void;
}) {
  const invalid = errors.length > 0;
  const inputProps = {
    'aria-errormessage': errors.join(', '),
    'aria-invalid': invalid,
    autoComplete: 'off',
    autoCorrect: 'off',
    className: `input ${invalid ? 'input-error' : 'input-primary'} w-full`,
    placeholder: prefix,
    spellCheck: 'false',
    type: 'text',
  } as const;
  const errorMessage = errors.join(', ');

  return (
    <>
      <span className="label">{label}:</span>
      <ErrorIndicator show={invalid}>
        <label className="floating-label w-full">
          {disabled ? (
            <input
              {...inputProps}
              disabled={true}
              key={`disabled-${name}`}
              name={`disabled-${name}`}
            />
          ) : (
            <input {...inputProps} key={name} name={name} onChange={onChange} />
          )}
          <span>{prefix}</span>
        </label>
      </ErrorIndicator>
      <p
        className="h-4 text-error font-bold text-left truncate"
        title={errorMessage}
      >
        {errorMessage}
      </p>
    </>
  );
}
