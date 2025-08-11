import { useRef, useState } from 'react';
import { FaArrowUp as ArrowUp } from 'react-icons/fa6';

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

  const [showLinks, setShowLinks] = useState<boolean>(false);

  const [deleteLinks] = api.useDeleteLinksMutation();

  const linksComponent = (
    <>
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
    </>
  );

  const appRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLElement>(null);

  return (
    <>
      <Background />

      <Dialog dialogRef={dialogRef}>
        <h3 className="font-bold text-lg">Error</h3>
        <p className="py-4">An error has occurred, please try again.</p>
      </Dialog>

      <div
        className="flex flex-col min-h-[200vh] lg:min-h-screen app"
        ref={appRef}
      >
        <Header
          links={links}
          scrollRef={scrollRef}
          setShowLinks={setShowLinks}
          showLinks={showLinks}
        />

        <main className="flex shrink-0 items-center justify-center px-2 main relative w-screen">
          <section className="flex flex-col w-xl text-center gap-6">
            <Headings />
            <LinkForm user_uuid={uuid} />
            <Features />
          </section>

          {showLinks ? (
            <aside className="hidden lg:flex card bg-base-100 shadow-md w-1/2 max-w-xl p-1 links-card border border-primary-content">
              {linksComponent}
            </aside>
          ) : null}
        </main>

        <aside
          className="flex lg:hidden shrink-0 items-center justify-center h-screen max-h-screen w-full p-4 sm:p-6 relative"
          ref={scrollRef}
        >
          <button
            className="btn badge badge-primary aspect-square rounded-full font-bold p-3 m-0 h-auto absolute top-1 right-1 sm:top-3 sm:right-3 z-10"
            onClick={() =>
              appRef?.current?.scrollIntoView({ behavior: 'smooth' })
            }
          >
            <ArrowUp />
          </button>
          <section className="card links-card bg-base-100 shadow-md border border-primary-content w-full max-w-3xl">
            {linksComponent}
          </section>
        </aside>

        {/* <Footer /> */}
      </div>
    </>
  );
}
