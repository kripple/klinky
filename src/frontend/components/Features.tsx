import { useRef } from 'react';

import { Dialog } from '@/frontend/components/Dialog';
import { ExternalUrl } from '@/frontend/components/ExternalUrl';

export function Features() {
  const ref = useRef<HTMLDialogElement>(null);
  const style =
    'btn btn-outline bg-base-100 rounded-full font-normal text-neutral px-3 h-7' as const;

  return (
    <div className="flex flex-wrap justify-center gap-3 px-6">
      <ExternalUrl
        linkStyle={`btn-info ${style}`}
        url="https://github.com/kripple/klinky/blob/main/LICENSE"
      >
        Free to use
      </ExternalUrl>

      <ExternalUrl
        linkStyle={`btn-accent ${style}`}
        url="https://github.com/kripple/klinky"
      >
        Open source
      </ExternalUrl>

      {/* TODO */}
      <Dialog closable dialogRef={ref}>
        {`TODO: explanation that the links are related to the user_uuid (url), that there's no sign-in or sign-up, but anyone with that link will be able to edit or modify the links. It's security by obscurity, but it's not infallible, and sharing the link renders it meaningless. Provide a save-as-bookmark and/or copy-to-clipboard becuase after leaving the page, there's no way to return to it without knowing the URL. The app saves nothing by design. The ability to delete a user can live here (maybe?).`}
      </Dialog>
      <button
        className={`btn-warning ${style}`}
        onClick={() => ref?.current?.showModal()}
      >
        No signup required
      </button>
    </div>
  );
}
