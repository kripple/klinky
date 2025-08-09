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
        {/* <h3 className="font-bold text-lg">Hello!</h3> */}
        <p className="py-4">An error has occurred, please try again.</p>
        <div className="modal-action">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn">Close</button>
          </form>
        </div>
      </div>
    </dialog>
  );
}
