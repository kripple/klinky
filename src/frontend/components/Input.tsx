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
    className: 'grow',
    spellCheck: 'false',
    type: 'text',
  } as const;
  const inputStyle = 'w-full gap-0 tracking-0 box-content';

  return (
    <>
      <label className="label">{label}</label>
      <ErrorIndicator show={invalid}>
        <label
          className={`input ${inputStyle} ${invalid ? 'input-error' : 'input-primary'}`}
        >
          {prefix}
          {disabled ? (
            <input
              {...inputProps}
              className={inputStyle}
              disabled={true}
              key={`disabled-${name}`}
              name={`disabled-${name}`}
            />
          ) : (
            <input
              {...inputProps}
              className={inputStyle}
              key={name}
              name={name}
              onChange={onChange}
            />
          )}
        </label>
      </ErrorIndicator>

      <p className="h-4 text-error font-bold text-left">{errors.join(', ')}</p>
    </>
  );
}
