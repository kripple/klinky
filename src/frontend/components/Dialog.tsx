export function Dialog({
  children,
  closable,
  dialogRef,
}: {
  children: ReactNode;
  closable?: boolean;
  dialogRef: Ref<HTMLDialogElement>;
}) {
  return (
    <dialog className="modal" ref={dialogRef}>
      <div className="modal-box">
        {children}
        {closable ? (
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn btn-secondary">Close</button>
            </form>
          </div>
        ) : null}
      </div>
    </dialog>
  );
}
