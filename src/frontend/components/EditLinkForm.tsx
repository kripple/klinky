import { useEffect, useState } from 'react';
import { FaRegCircleCheck as SubmitIcon } from 'react-icons/fa6';
import { LuPenOff as ResetIcon } from 'react-icons/lu';

import { api } from '@/frontend/api';
import { Input } from '@/frontend/components/Input';
import { aliasPrefix, validateAlias } from '@/validators/alias';

export function EditLinkForm({
  setIsEditing,
  alias,
  user_uuid,
  uuid: link_uuid,
}: LinkDto & { setIsEditing: SetState<boolean> }) {
  const [errors, setErrors] = useState<string[]>([]);
  const errorMessage = errors.join(', ');
  const buttonStyle = 'btn btn-outline btn-sm aspect-square text-lg p-0';

  const [updateLink, response] = api.useUpdateLinkMutation();

  const disabled = errors.length > 0;
  const loading = response.isLoading;
  const success = response.isSuccess;

  useEffect(() => {
    if (!success) return;
    setIsEditing(false);
  }, [success, setIsEditing]);

  const parseForm = ({
    alias,
  }: {
    [key in 'alias']: FormDataEntryValue | null;
  }) => {
    const aliasString = typeof alias === 'string' ? alias : '';
    const aliasResult = validateAlias(aliasString);
    if (!aliasResult.success) {
      setErrors(aliasResult.errors);
    }
    if (!aliasResult.success) {
      return false;
    }
    return { alias: aliasResult.data };
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();

    if (!user_uuid || !link_uuid || disabled || loading) return;

    const data = new FormData(event.currentTarget);
    const alias = data.get('alias');

    // escape hatch for empty inputs
    if (alias === '') {
      setIsEditing(false);
      return;
    }

    const params = parseForm({
      alias,
    });
    if (!params) return;
    updateLink({ ...params, user_uuid, link_uuid });
  };

  return (
    // FIXME: don't use absolute or invisible, just replace and set a min-height on the error message
    <div className="grid-top relative z-10">
      <form autoComplete="off" className="w-full" onSubmit={submit}>
        <div className="flex flex-nowrap items-center gap-2">
          <fieldset className="fieldset grow">
            <Input
              defaultValue={alias}
              errors={errors}
              name="alias"
              onChange={() =>
                setErrors((current) => (current.length === 0 ? current : []))
              }
              prefix={aliasPrefix}
              removeHelperText
            />
          </fieldset>

          <button
            className={`btn-warning ${buttonStyle}`}
            onClick={() => setIsEditing(false)}
            type="reset"
          >
            <ResetIcon />
          </button>
          <button className={`btn-success ${buttonStyle}`} type="submit">
            <SubmitIcon />
          </button>
        </div>

        <p className="min-h-6 text-error text-xs text-left font-bold">
          {errorMessage}
        </p>
      </form>
    </div>
  );
}
