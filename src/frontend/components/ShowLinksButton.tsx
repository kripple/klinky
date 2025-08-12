import { FaArrowDown as ArrowDownIcon } from 'react-icons/fa6';

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
  const buttonStyle = 'btn btn-primary pl-3 pr-2 cursor-pointer' as const;
  const desktopOnly = 'hidden lg:flex' as const;
  const mobileOnly = 'flex lg:hidden' as const;

  const contents = (
    <>
      Links
      <ArrowDownIcon
        className={`${mobileOnly} badge badge-accent aspect-square rounded-full p-1 m-0 cursor-pointer`}
      />
      {open && count && count > 0 ? (
        <span
          className={`${desktopOnly} badge badge-accent aspect-square rounded-full text-xs p-0`}
        >
          {count}
        </span>
      ) : (
        <svg
          className={`${desktopOnly} badge ${open ? 'badge-accent' : 'badge-secondary'} aspect-square rounded-full p-[0.2rem] m-0 h-6 w-6 cursor-pointer`}
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
    </>
  );

  return (
    <>
      <button
        className={`${mobileOnly} ${buttonStyle}`}
        onClick={() =>
          scrollRef?.current?.scrollIntoView({ behavior: 'smooth' })
        }
      >
        {contents}
      </button>
      <button
        className={`${desktopOnly} ${buttonStyle}`}
        onClick={open ? () => setShowLinks(true) : () => setShowLinks(false)}
      >
        {contents}
      </button>
    </>
  );
}
