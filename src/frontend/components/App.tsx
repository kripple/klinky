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
  const hasLinks = links && links.length > 0;

  return (
    <>
      <Background />
      <div className="flex flex-col min-h-screen">
        <Header />

        <main className="flex-grow flex items-center justify-center px-4 main-content">
          <section className="flex flex-col w-xl text-center gap-6">
            <Headings />
            <LinkForm user_uuid={uuid} />
            <Features />
          </section>
        </main>

        {/* <Footer /> */}
      </div>
    </>
  );
}
