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

      <button
        className={`btn-warning ${style}`}
        onClick={() => ref?.current?.showModal()}
      >
        No signup required
      </button>
      <Dialog dialogRef={ref}>
        <p className="font-sans">
          Your klinky links are saved to a private, unique link that works like
          a hard-to-guess password. Anyone with the link can edit, so keep it
          safe — you’ll need it to get back here.
        </p>
      </Dialog>
    </div>
  );
}
