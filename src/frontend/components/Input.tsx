export function Input({
  prefix,
  name,
  label,
  errors,
  disabled,
  removeHelperText,
  defaultValue,
  onChange,
}: {
  prefix: string;
  name: string;
  label?: string;
  errors: string[];
  disabled?: boolean;
  removeHelperText?: boolean;
  defaultValue?: string;
  onChange?: () => void;
}) {
  const invalid = errors.length > 0;
  const inputProps = {
    'aria-errormessage': errors.join(', '),
    'aria-invalid': invalid,
    autoComplete: 'off',
    autoCorrect: 'off',
    className: `input ${invalid ? 'input-error' : 'input-primary'} w-full input-sm`,
    placeholder: prefix,
    spellCheck: 'false',
    type: 'text',
  } as const;
  const errorMessage = errors.join(', ');

  return (
    <>
      {label ? <span className="label">{label}:</span> : null}

      <label className="floating-label w-full">
        {disabled ? (
          <input
            {...inputProps}
            disabled={true}
            key={`disabled-${name}`}
            name={`disabled-${name}`}
          />
        ) : (
          <input
            {...inputProps}
            defaultValue={defaultValue}
            key={name}
            name={name}
            onChange={onChange}
          />
        )}
        <span>{prefix}</span>
      </label>

      {removeHelperText ? null : (
        <p
          className="h-4 text-error font-bold text-left truncate"
          title={errorMessage}
        >
          {errorMessage}
        </p>
      )}
    </>
  );
}
