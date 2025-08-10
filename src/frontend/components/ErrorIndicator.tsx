export function ErrorIndicator({
  children,
  show,
}: {
  children: ReactNode;
  show: boolean;
}) {
  return (
    <div className="indicator w-full">
      {show ? (
        <span className="indicator-item badge badge-error badge-xs aspect-square h-auto font-bold rounded-full">
          !
        </span>
      ) : null}
      {children}
    </div>
  );
}
