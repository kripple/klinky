import { ErrorIndicator } from '@/frontend/components/ErrorIndicator';
import { Input } from '@/frontend/components/Input';
import { aliasPrefix, validateOptionalAlias } from '@/validators/alias';
import { linkPrefix, validateLink } from '@/validators/link';

const checkmark = (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5 13l4 4L19 7"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={3}
    />
  </svg>
);

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
      className="card bg-base-100 shadow-md px-6 pt-6 border border-primary-content"
      onSubmit={submit}
    >
      <fieldset className="fieldset">
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
          <ErrorIndicator show={true}>
            <a
              className="btn btn-primary w-full"
              href={import.meta.env.VITE_FRONTEND_URL}
              rel="noreferrer"
              target="_blank"
            >
              Create New Page?
            </a>
          </ErrorIndicator>
        ) : (
          <button
            className={`btn ${success ? 'btn-success' : 'btn-primary'} w-full`}
            disabled={!user_uuid}
            type="submit"
          >
            {success ? (
              checkmark
            ) : loading ? (
              <span>Linking ...</span>
            ) : (
              <span>Create Short Link</span>
            )}
          </button>
        )}
      </fieldset>

      <p className="h-6 leading-6 text-error">{disabled ? error : null}</p>
    </form>
  );
}
