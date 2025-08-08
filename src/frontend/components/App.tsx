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

export function App() {
  const currentUserResponse = useCurrentUser();
  const uuid = currentUserResponse.currentData?.uuid;

  const linksResponse = api.useGetLinksQuery(
    { user_uuid: uuid as string },
    { skip: !uuid },
  );
  const links = linksResponse.currentData;

  const [showLinks, setShowLinks] = useState<boolean>(false);

  return (
    <>
      <Background />
      <div className="flex flex-col min-h-screen h-full">
        <Header
          links={links}
          setShowLinks={setShowLinks}
          showLinks={showLinks}
        />

        <main className="flex-grow flex items-center justify-center px-2 main-content relative w-screen h-full">
          <section className="flex flex-col w-xl text-center gap-6">
            <Headings />
            <LinkForm user_uuid={uuid} />
            <Features />
          </section>

          {showLinks ? (
            <aside className="card bg-base-100 shadow-md p-6 w-1/2 h-full flex">
              <Links links={links} />
            </aside>
          ) : null}
        </main>

        {/* <Footer /> */}
      </div>
    </>
  );
}
