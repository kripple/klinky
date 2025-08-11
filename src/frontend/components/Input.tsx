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
    spellCheck: 'false',
    type: 'text',
  } as const;

  return (
    <>
      {/* <span className="sm:hidden">
        <label className="text-left font-bold p-1">{placeholder}:</label>
        <ErrorIndicator show={invalid}>
          {disabled ? (
            <input
              {...inputProps}
              className={`input w-full gap-0 tracking-0 box-content ${invalid ? 'input-error' : 'input-primary'}`}
              disabled={true}
              key={`disabled-${name}`}
              name={`disabled-${name}`}
              placeholder={label}
            />
          ) : (
            <input
              {...inputProps}
              className={`input w-full gap-0 tracking-0 box-content ${invalid ? 'input-error' : 'input-primary'}`}
              key={name}
              name={name}
              onChange={onChange}
              placeholder={label}
            />
          )}
        </ErrorIndicator>
      </span> */}

      <ErrorIndicator show={invalid}>
        <label
          className={`input w-full gap-0 tracking-0 box-content min-w-[${contentLength}ch] ${invalid ? 'input-error' : 'input-primary'}`}
        >
          {label}
          {disabled ? (
            <input
              {...inputProps}
              disabled={true}
              key={`disabled-${name}`}
              name={`disabled-${name}`}
              placeholder={placeholder}
            />
          ) : (
            <input
              key={name}
              {...inputProps}
              name={name}
              onChange={onChange}
              placeholder={placeholder}
            />
          )}
        </label>
      </ErrorIndicator>

      <p className="h-6 leading-6 text-error">{errors.join(', ')}</p>
    </>
  );
}
