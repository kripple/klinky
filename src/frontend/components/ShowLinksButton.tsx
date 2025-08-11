import { FaArrowDown as ArrowDown } from 'react-icons/fa6';

export function ShowLinksButton({
  open,
  count,
  setShowLinks,
  scrollRef,
}: {
  open: boolean;
  count?: number;
  setShowLinks: SetState<boolean>;
  scrollRef: RefObject;
}) {
  const closeSvg = 'M6 18L18 6M6 6l12 12' as const;
  const openSvg = 'M12 4v16M4 12h16' as const;

  const contents = (
    <>
      Links
      <span
        className={`badge badge-accent aspect-square rounded-full font-bold p-1 m-0 h-auto flex lg:hidden`}
      >
        <ArrowDown />
      </span>
      <span
        className={`badge aspect-square rounded-full font-bold p-1 m-0 h-auto ${open ? 'badge-accent' : 'badge-secondary'} hidden lg:flex`}
      >
        {open && count && count > 0 ? (
          <span className="h-4 w-4 text-xs p-0">{count}</span>
        ) : (
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d={open ? openSvg : closeSvg}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
            />
          </svg>
        )}
      </span>
    </>
  );

  return (
    <>
      <button
        className="btn btn-primary pl-3 pr-2 flex lg:hidden"
        onClick={() =>
          scrollRef?.current?.scrollIntoView({ behavior: 'smooth' })
        }
      >
        {contents}
      </button>
      <button
        className="btn btn-primary pl-3 pr-2 hidden lg:flex"
        onClick={open ? () => setShowLinks(true) : () => setShowLinks(false)}
      >
        {contents}
      </button>
    </>
  );
}
