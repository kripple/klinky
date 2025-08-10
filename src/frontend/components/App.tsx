import { useRef, useState } from 'react';

import { api } from '@/frontend/api';
import { Background } from '@/frontend/components/Background';
import { Dialog } from '@/frontend/components/Dialog';
import { Features } from '@/frontend/components/Features';
import { Header } from '@/frontend/components/Header';
import { Headings } from '@/frontend/components/Headings';
import { LinkForm } from '@/frontend/components/LinkForm';
import { Links } from '@/frontend/components/Links';
import { useCurrentUser } from '@/frontend/hooks/useCurrentUser';
import { useSortedLinks } from '@/frontend/hooks/useSortedLinks';

import '@/frontend/components/App.css';

export function App() {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const currentUserResponse = useCurrentUser();
  const uuid = currentUserResponse.currentData?.uuid;

  const linksResponse = useSortedLinks({ user_uuid: uuid });
  const links = linksResponse.currentData;

  // const [showLinks, setShowLinks] = useState<boolean>(false);
  const [showLinks, setShowLinks] = useState<boolean>(true);

  const [deleteLinks] = api.useDeleteLinksMutation();

  return (
    <>
      <Background />

      <Dialog dialogRef={dialogRef}>
        <h3 className="font-bold text-lg">Error</h3>
        <p className="py-4">An error has occurred, please try again.</p>
      </Dialog>

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

          {showLinks ? (
            <aside className="card bg-base-100 shadow-md w-1/2 max-w-xl p-1 aside border border-primary-content">
              <Links links={links} />
              <div className="flex flex-grow items-end mx-2 mb-2 mt-1">
                {uuid ? (
                  <button
                    className="btn btn-secondary w-full"
                    onClick={() =>
                      deleteLinks({
                        user_uuid: uuid,
                      })
                    }
                  >
                    Delete All Links
                  </button>
                ) : null}
              </div>
            </aside>
          ) : null}
        </main>

        {/* <Footer /> */}
      </div>
    </>
  );
}
