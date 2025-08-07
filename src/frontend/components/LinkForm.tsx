import { useState } from 'react';
import * as z from 'zod';

import { api } from '@/frontend/api';
import { maxLinksPerUser } from '@/validators/link';

// const pretty = z.prettifyError(result.error);

export function LinkForm({ user_uuid }: { user_uuid?: string }) {
  const linksResponse = api.useGetLinksQuery(
    { user_uuid: user_uuid as string },
    { skip: !user_uuid },
  );
  const maxLinks =
    !linksResponse.currentData ||
    linksResponse.currentData.length >= maxLinksPerUser;

  const [createLink, response] = api.useCreateLinkMutation();
  const [errors, setErrors] = useState<
    { [key in 'alias' | 'link']: string[] }[]
  >([]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const alias = data.get('alias');
    const link = data.get('link');
    console.log({ alias, link });
  };

  return (
    <form
      autoComplete="off"
      className="card bg-base-100 rounded-box shadow-md"
      onSubmit={submit}
    >
      <div>
        <label className="input input-primary">
          {/* https:// */}
          <span className="label">https://</span>
          <input
            autoComplete="off"
            autoCorrect="off"
            className="grow"
            name="link"
            placeholder="Enter link here"
            spellCheck="false"
            type="text"
          />
        </label>
        <p className="validator-hint">TBD</p>
      </div>
      <div>
        <label className="input input-primary">
          https://klinky.link/
          <input
            autoComplete="off"
            autoCorrect="off"
            className="grow"
            name="alias"
            placeholder="Customize your link (optional)"
            spellCheck="false"
            type="text"
          />
        </label>
        <p className="validator-hint">TBD</p>
      </div>
      <button
        className="btn btn-primary"
        disabled={!user_uuid || response.isLoading || maxLinks}
        type="submit"
      >
        Create Short Link
      </button>
      <p className="validator-hint">
        {maxLinks
          ? `There is a maximum of ${maxLinksPerUser} links per user, please delete a link before creating a new one.`
          : null}
      </p>
    </form>
  );
}
