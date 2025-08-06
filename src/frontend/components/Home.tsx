import { LinkForm } from '@/frontend/components/LinkForm';
import { Links } from '@/frontend/components/Links';
import { useCurrentUser } from '@/frontend/hooks/useCurrentUser';

export function Home() {
  const response = useCurrentUser();
  const uuid = response.currentData?.uuid;

  return (
    <>
      <header className="header">
        <div className="app-title">klinky.link</div>
        <button className="btn btn-primary" disabled={!uuid}>
          Links
        </button>
      </header>

      <main className="main">
        <section>
          <h1 className="heading">
            The anti-lytics
            <span className="heading-highlight">Link Shortener</span>
          </h1>
          <h2 className="subheading">
            {/* Privacy isn’t just a feature — it’s the point. */}
            {/* <br /> */}
            No tracking. No accounts. Just links.
          </h2>

          <LinkForm user_uuid={uuid} />

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
