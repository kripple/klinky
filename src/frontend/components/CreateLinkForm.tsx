import { FaCheck as CheckmarkIcon } from 'react-icons/fa6';

import { Input } from '@/frontend/components/Input';
import { aliasPrefix, validateOptionalAlias } from '@/validators/alias';
import { linkPrefix, validateLink } from '@/validators/link';

export function CreateLinkForm({
  loading,
  success,
  error,
  user_uuid,
  linkErrors,
  aliasErrors,
  setLinkErrors,
  setAliasErrors,
  createLink,
}: {
  loading: boolean;
  success: boolean;
  error?: string;
  user_uuid?: string;
  linkErrors: string[];
  aliasErrors: string[];
  setLinkErrors: SetState<string[]>;
  setAliasErrors: SetState<string[]>;
  createLink: (params: CreateLinkParams) => void;
}) {
  const disabled = Boolean(error);

  function addUrlPrefix(url: string): string {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `https://${url}`;
  }

  const parseForm = ({
    alias,
    link,
  }: {
    [key in 'alias' | 'link']: FormDataEntryValue | null;
  }) => {
    const aliasString = typeof alias === 'string' ? alias : '';
    const aliasResult = validateOptionalAlias(aliasString);
    if (!aliasResult.success) {
      setAliasErrors(aliasResult.errors);
    }
    const linkString = typeof link === 'string' ? link : '';
    const linkResult = validateLink(addUrlPrefix(linkString));
    if (!linkResult.success) {
      setLinkErrors(linkResult.errors);
    }
    if (!(aliasResult.success && linkResult.success)) {
      return false;
    }
    return { alias: aliasResult.data, value: linkResult.data };
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!user_uuid || disabled || loading) return;

    const data = new FormData(event.currentTarget);
    const params = parseForm({
      alias: data.get('alias'),
      link: data.get('link'),
    });
    if (!params) return;
    createLink({ ...params, user_uuid });
  };

  return (
    <form
      autoComplete="off"
      className="card bg-base-100 shadow-md p-6 border border-primary-content"
      onSubmit={submit}
    >
      <fieldset className="fieldset">
        {/* TODO: show explanation instead of disabled inputs when max limit is reached */}
        <Input
          disabled={disabled}
          errors={linkErrors}
          label="Enter link here"
          name="link"
          onChange={() =>
            setLinkErrors((current) => (current.length === 0 ? current : []))
          }
          prefix={linkPrefix}
        />
        <Input
          disabled={disabled}
          errors={aliasErrors}
          label="Customize your link (optional)"
          name="alias"
          onChange={() =>
            setAliasErrors((current) => (current.length === 0 ? current : []))
          }
          prefix={aliasPrefix}
        />

        {disabled && !loading ? (
          <a
            className="btn btn-accent w-full"
            href={import.meta.env.VITE_FRONTEND_URL}
            rel="noreferrer"
            target="_blank"
          >
            Create New Page?
          </a>
        ) : (
          <button
            className={`btn ${success ? 'btn-success' : 'btn-primary'} w-full`}
            disabled={!user_uuid}
            type="submit"
          >
            {success ? (
              <CheckmarkIcon />
            ) : loading ? (
              <span>Linking ...</span>
            ) : (
              <span>Create Short Link</span>
            )}
          </button>
        )}
      </fieldset>
    </form>
  );
}
