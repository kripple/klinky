export function Dialog({
  children,
  dialogRef,
}: {
  children: ReactNode;
  dialogRef: Ref<HTMLDialogElement>;
}) {
  return (
    <dialog className="modal text-left" ref={dialogRef}>
      <div className="modal-box">
        {children}

        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
      </div>
    </dialog>
  );
}
