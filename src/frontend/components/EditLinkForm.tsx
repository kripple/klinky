import { useState } from 'react';
import {
  FaCheck as CheckmarkIcon,
  FaRegCircleCheck as SubmitIcon,
} from 'react-icons/fa6';
import { FiEdit2 as EditIcon } from 'react-icons/fi';
import { LuPenOff as ResetIcon } from 'react-icons/lu';

// import { LuUndo as ResetIcon } from 'react-icons/lu';
// import { IoArrowUndoOutline as ResetIcon } from 'react-icons/io5';
import { MdOutlineDeleteOutline as DeleteIcon } from 'react-icons/md';
// import { RxReset as ResetIcon } from 'react-icons/rx';

import { api } from '@/frontend/api';
import { CopyButton } from '@/frontend/components/CopyButton';
import { ErrorIndicator } from '@/frontend/components/ErrorIndicator';
import { Input } from '@/frontend/components/Input';
import { relativeTime } from '@/frontend/utils/time';
import {
  aliasDisplayPrefix,
  aliasPrefix,
  validateOptionalAlias,
} from '@/validators/alias';
import { linkPrefix, validateLink } from '@/validators/link';

export function EditLinkForm({
  setIsEditing,
  ...link
}: LinkDto & { setIsEditing: SetState<boolean> }) {
  const [errors, setErrors] = useState<string[]>([]);
  const errorMessage = errors.join(', ');
  const buttonStyle = 'btn btn-outline btn-sm aspect-square text-lg p-0';

  const submit = (event: FormEvent) => {
    event.preventDefault();

    console.log(link);
  };

  return (
    <div className="flex items-center absolute bg-base-100 pb-2 w-full">
      <form autoComplete="off" className="w-full" onSubmit={submit}>
        <div className="flex flex-nowrap items-center gap-2">
          <fieldset className="fieldset grow">
            <Input
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
          <button
            className={`btn-success ${buttonStyle}`}
            onClick={submit}
            type="submit"
          >
            <SubmitIcon />
          </button>
        </div>

        <p
          className="h-4 text-error font-bold text-left truncate"
          title={errorMessage}
        >
          {errorMessage}
        </p>
      </form>
    </div>
  );

  // return (
  //   <>
  //     <label className="text-lg font-bold">
  //       {aliasDisplayPrefix}
  //       <input
  //         autoComplete="off"
  //         autoCorrect="off"
  //         className="text-lg font-bold input input-xs p-0"
  //         name="alias"
  //         placeholder={link.alias}
  //         spellCheck="false"
  //         type="text"
  //       />
  //     </label>
  //     <p className="h-6 leading-6 text-error">{errors.join(', ')}</p>
  //   </>
  // );
}
