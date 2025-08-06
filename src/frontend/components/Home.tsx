import { Links } from '@/frontend/components/Links';
import { useCurrentUser } from '@/frontend/hooks/useCurrentUser';

export function Home() {
  const response = useCurrentUser();
  const uuid = response.currentData?.uuid;

  return (
    <>
      <header className="header">
        <div className="app-title">klinky.link</div>
        <button disabled={!uuid}>Short Links</button>
      </header>

      <main className="main">
        <section>
          <h1 className="heading">
            The anti-lytics
            <span className="heading-highlight">Link Shortener</span>
          </h1>
          <h2 className="subheading">
            Privacy isn’t just a feature — it’s the point.
            <br />
            No tracking. No accounts. Just links.
          </h2>
          <div className="card">
            <form>
              <div className="input-pair">
                <input
                  className="readonly-prefix"
                  name="link-prefix"
                  readOnly
                  tabIndex={-1}
                  value="https://"
                ></input>
                <input
                  className="input-value"
                  name="link"
                  placeholder="Enter link here"
                  required
                ></input>
              </div>
              <div className="input-pair">
                <input
                  className="readonly-prefix"
                  name="alias-prefix"
                  readOnly
                  tabIndex={-1}
                  value="https://klinky.link/"
                ></input>
                <input
                  className="input-value"
                  name="alias"
                  placeholder="Customize your link (optional)"
                ></input>
              </div>
              <button type="submit">Create Short Link</button>
            </form>
          </div>
          <div className="key-features-list">
            <div className="feature-badge">
              <div className="badge badge-primary badge-xs"></div>
              <span>Free to use</span>
            </div>
            <div className="feature-badge">
              <div className="badge badge-secondary badge-xs"></div>
              <span>Open source</span>
            </div>
            <div className="feature-badge">
              <div className="badge badge-accent badge-xs"></div>
              <span>No signup required</span>
            </div>
          </div>
        </section>

        <section>{uuid ? <Links user_uuid={uuid}></Links> : null}</section>
      </main>
    </>
  );
}
