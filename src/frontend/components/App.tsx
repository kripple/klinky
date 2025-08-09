import { useRef, useState } from 'react';

import { api } from '@/frontend/api';
import { Background } from '@/frontend/components/Background';
import { Features } from '@/frontend/components/Features';
import { Header } from '@/frontend/components/Header';
import { Headings } from '@/frontend/components/Headings';
import { LinkForm } from '@/frontend/components/LinkForm';
import { Links } from '@/frontend/components/Links';
import { useCurrentUser } from '@/frontend/hooks/useCurrentUser';

import '@/frontend/components/App.css';

// TODO: explanation that the links are related to the user_uuid (url), that there's no sign-in or sign-up, but anyone with that link will be able to edit or modify the links. It's security by obscurity, but it's not infallible, and sharing the link renders it meaningless. Provide a save-as-bookmark and/or copy-to-clipboard becuase after leaving the page, there's no way to return to it without knowing the URL. The app saves nothing by design. The ability to delete a user can live here.

export function App() {
  const currentUserResponse = useCurrentUser();
  const uuid = currentUserResponse.currentData?.uuid;

  const linksResponse = api.useGetLinksQuery(
    { user_uuid: uuid as string },
    { skip: !uuid },
  );
  const links = linksResponse.currentData;

  // const [showLinks, setShowLinks] = useState<boolean>(false);
  const [showLinks, setShowLinks] = useState<boolean>(true);

  return (
    <>
      <Background />
      <div className="flex flex-col min-h-screen app">
        <Header
          links={links}
          setShowLinks={setShowLinks}
          showLinks={showLinks}
        />

        <main className="flex items-center justify-center px-2 main relative w-screen">
          <section className="flex flex-col w-xl text-center gap-6">
            <Headings />
            <LinkForm user_uuid={uuid} />
            <Features />
          </section>

          {showLinks && (links || [])?.length > 0 ? (
            <aside className="card bg-base-100 shadow-md w-1/2 p-1 aside border border-primary-content">
              <Links links={links} />
              <button className="btn btn-secondary mx-2 mb-2 mt-1">
                Delete All Links
              </button>
            </aside>
          ) : null}
        </main>

        {/* <Footer /> */}
      </div>
    </>
  );
}
