import { useEffect, useRef, useState } from 'react';

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

  const minDelayMs = 800 as const;
  const maxDelayMs = 1000 as const;
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const successHandler = useRef<NodeJS.Timeout | null>(null);
  const loadingHandler = useRef<NodeJS.Timeout | null>(null);
  const delayedSuccessHandler = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const animateSuccess = () => {
      if (response.isSuccess) {
        setSuccess(true);

        successHandler.current = setTimeout(() => {
          setSuccess(false);
        }, maxDelayMs);
      }
    };

    if (response.isLoading) {
      // Start a timer to delay showing loading state
      loadingHandler.current = setTimeout(() => {
        setLoading(true);

        // Once loading shows, ensure it stays visible for min delay
        delayedSuccessHandler.current = setTimeout(() => {
          // After min loading time, if request already succeeded, show success
          animateSuccess();
        }, minDelayMs);
      }, minDelayMs);
    } else {
      // Request not loading anymore, cancel timer in case it has not yet run
      if (loadingHandler.current) {
        clearTimeout(loadingHandler.current);
        loadingHandler.current = null;
      }
      if (delayedSuccessHandler.current) {
        clearTimeout(delayedSuccessHandler.current);
        delayedSuccessHandler.current = null;
      }

      animateSuccess();
    }

    return () => {
      [loadingHandler, successHandler, delayedSuccessHandler].forEach(
        (handler) => handler.current && clearTimeout(handler.current),
      );
    };
  }, [response.isLoading, response.isSuccess]);

  useEffect(() => {
    if (!response.isSuccess) return;

    setSuccess(true);

    const handler = setTimeout(() => {
      setSuccess(false);
    }, maxDelayMs);

    return () => clearTimeout(handler);
  }, [response.isSuccess]);

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
    if (response.isLoading) return;

    const data = new FormData(event.currentTarget);
    const params = parseForm({
      alias: data.get('alias'),
      link: data.get('link'),
    });
    if (!params) return;
    createLink(params);
  };

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

  return (
    <form
      autoComplete="off"
      className="card bg-base-100 shadow-md m-6 p-6 border border-primary-content"
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
        className={`btn ${success ? 'btn-success' : 'btn-primary'}`}
        disabled={!user_uuid || maxLinks}
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
      {/* <p className="validator-hint">
        {maxLinks
          ? `There is a maximum of ${maxLinksPerUser} links per user, please delete a link before creating a new one.`
          : null}
      </p> */}
    </form>
  );
}
