import { api } from '@/frontend/api';

export function LinkForm({ user_uuid }: { user_uuid?: string }) {
  const [createLink, response] = api.useCreateLinkMutation();

  const submit = (event: FormEvent) => {
    event.preventDefault();
  };

  return (
    <form className="card">
      <div className="join">
        <input
          className="input join-item prefix"
          name="link-prefix"
          readOnly
          tabIndex={-1}
          value="https://"
        ></input>
        <input
          className="input join-item validator"
          name="link"
          placeholder="Enter link here"
          required
        ></input>
      </div>
      <div className="join">
        <input
          className="input join-item prefix"
          name="alias-prefix"
          readOnly
          tabIndex={-1}
          value="https://klinky.link/"
        ></input>
        <input
          className="input join-item validator"
          name="alias"
          placeholder="Customize your link (optional)"
        ></input>
      </div>
      <button
        className="btn btn-primary"
        disabled={!user_uuid}
        onClick={submit}
        type="submit"
      >
        Create Short Link
      </button>
    </form>
  );
}
