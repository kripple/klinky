export function Input({
  label,
  name,
  placeholder,
  errors,
  onChange,
}: {
  label: string;
  name: string;
  placeholder: string;
  errors: string[];
  onChange?: () => void;
}) {
  const invalid = errors.length > 0;
  return (
    <>
      <div className="indicator w-full">
        <label
          className={`input ${invalid ? 'input-error' : 'input-primary'} w-full`}
        >
          {label}
          {invalid ? (
            <span className="indicator-item badge badge-error badge-xs aspect-square h-auto font-bold rounded-full">
              !
            </span>
          ) : null}
          <input
            aria-errormessage={errors.join(', ')}
            aria-invalid={invalid}
            autoComplete="off"
            autoCorrect="off"
            className="grow"
            name={name}
            onChange={onChange}
            placeholder={placeholder}
            spellCheck="false"
            type="text"
          />
        </label>
      </div>
      <p className="h-6 leading-6 text-error">{errors.join(', ')}</p>
    </>
  );
}
