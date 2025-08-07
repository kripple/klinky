import { api } from '@/frontend/api';
import { Background } from '@/frontend/components/Background';
import { Features } from '@/frontend/components/Features';
import { Header } from '@/frontend/components/Header';
import { LinkForm } from '@/frontend/components/LinkForm';
import { Links } from '@/frontend/components/Links';
import { useCurrentUser } from '@/frontend/hooks/useCurrentUser';

import '@/frontend/components/App.css';

export function App() {
  const currentUserResponse = useCurrentUser();
  const uuid = currentUserResponse.currentData?.uuid;

  const linksResponse = api.useGetLinksQuery(
    { user_uuid: uuid as string },
    { skip: !uuid },
  );
  const links = linksResponse.currentData;
  const hasLinks = links && links.length > 0;

  return (
    <>
      <Background />

      {/* <main className="main">
        <section>
          <h1 className="heading">
            The anti-lytics
            <span className="heading-highlight">Link Shortener</span>
          </h1>
          <h2 className="subheading">No tracking. No accounts. Just links.</h2>

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

        <section>{hasLinks ? <Links links={links}></Links> : null}</section>
      </main> */}

      <div className="flex flex-col min-h-screen">
        <Header />

        <main className="flex-grow flex items-center justify-center px-4">
          <section className="max-w-xl text-center space-y-6">
            <h1
              aria-label="The anti-lytics Link Shortener"
              className="flex flex-col gap-3"
            >
              <span className="text-4xl text-neutral">The anti-lytics</span>
              <span className="text-5xl text-primary-content">
                Link Shortener
              </span>
            </h1>

            <p className="text-base-content text-lg">
              No tracking. No accounts. Just links.
            </p>

            <LinkForm user_uuid={uuid} />

            <Features />
          </section>
        </main>

        {/* <Footer /> */}
      </div>
    </>
  );
}
