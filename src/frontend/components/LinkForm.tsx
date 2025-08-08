import { useEffect, useState } from 'react';

import { api } from '@/frontend/api';
import { Input } from '@/frontend/components/Input';
import { aliasPrefix, validateOptionalAlias } from '@/validators/alias';
import { linkPrefix, maxLinksPerUser, validateLink } from '@/validators/link';

export function LinkForm({ user_uuid }: { user_uuid?: string }) {
  const linksResponse = api.useGetLinksQuery(
    { user_uuid: user_uuid as string },
    { skip: !user_uuid },
  );
  const maxLinks =
    !linksResponse.currentData ||
    linksResponse.currentData.length >= maxLinksPerUser;

  const [createLink, response] = api.useCreateLinkMutation();
  const [aliasErrors, setAliasErrors] = useState<string[]>([]);
  const [linkErrors, setLinkErrors] = useState<string[]>([]);

  useEffect(() => {
    console.log(response);
  }, [response]);

  const parseForm = ({
    alias,
    link,
  }: {
    [key in 'alias' | 'link']: FormDataEntryValue | null;
  }): CreateLinkParams | false => {
    const aliasString = typeof alias === 'string' ? alias : '';
    const aliasResult = validateOptionalAlias(aliasString);
    if (!aliasResult.success) {
      setAliasErrors(aliasResult.errors);
    }
    const linkString = typeof link === 'string' ? link : '';
    const linkResult = validateLink(linkPrefix + linkString);
    if (!linkResult.success) {
      setLinkErrors(linkResult.errors);
    }
    if (!user_uuid || !(aliasResult.success && linkResult.success)) {
      return false;
    }
    return { alias: aliasResult.data, value: linkResult.data, user_uuid };
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const params = parseForm({
      alias: data.get('alias'),
      link: data.get('link'),
    });
    if (!params) return;
    createLink(params);
  };

  return (
    <form
      autoComplete="off"
      className="card bg-base-100 shadow-md m-6 p-6"
      onSubmit={submit}
    >
      <Input
        errors={linkErrors}
        label={linkPrefix}
        name="link"
        onChange={() =>
          setLinkErrors((current) => (current.length === 0 ? current : []))
        }
        placeholder="Enter link here"
      />
      <Input
        errors={aliasErrors}
        label={aliasPrefix}
        name="alias"
        onChange={() =>
          setAliasErrors((current) => (current.length === 0 ? current : []))
        }
        placeholder="Customize your link (optional)"
      />

      <button
        className="btn btn-primary"
        disabled={!user_uuid || response.isLoading || maxLinks}
        type="submit"
      >
        Create Short Link
      </button>
      {/* <p className="validator-hint">
        {maxLinks
          ? `There is a maximum of ${maxLinksPerUser} links per user, please delete a link before creating a new one.`
          : null}
      </p> */}
    </form>
  );
}
