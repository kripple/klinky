import type { Ref } from 'react';

// for generic errors / for when the app is not usable

export function Dialog({ dialogRef }: { dialogRef: Ref<HTMLDialogElement> }) {
  // <button
  //         className="btn btn-primary"
  //         disabled={!hasLinks}
  //         onClick={() => ref.current?.showModal()}
  //       >
  //         open modal
  //       </button>
  return (
    <dialog className="modal" ref={dialogRef}>
      <div className="modal-box">
        <h3 className="font-bold text-lg">Hello!</h3>
        <p className="py-4">Press ESC key or click the button below to close</p>
        <div className="modal-action">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-secondary aspect-square h-auto p-2 fixed top-6 right-6 rounded-full">
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 18L18 6M6 6l12 12"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
}
