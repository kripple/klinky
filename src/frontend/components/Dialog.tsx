export function Dialog({
  children,
  dialogRef,
}: {
  children: ReactNode;
  dialogRef: Ref<HTMLDialogElement>;
}) {
  return (
    <dialog className="modal text-left" ref={dialogRef}>
      <div className="modal-box flex flex-col gap-3">
        {children}
        <div className="modal-action mt-0">
          <form method="dialog">
            <button className="btn">Close</button>
          </form>
        </div>
      </div>
    </dialog>
  );
}
