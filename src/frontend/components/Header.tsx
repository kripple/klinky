export function Header({
  links,
  showLinks,
  setShowLinks,
}: {
  links?: LinkDto[];
  showLinks: boolean;
  setShowLinks: SetState<boolean>;
}) {
  const svgIcon = (type: 'close' | 'open') => (
    <svg
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d={type === 'close' ? 'M6 18L18 6M6 6l12 12' : 'M12 4v16M4 12h16'}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={3}
      />
    </svg>
  );

  const badgeCount = links?.length ? (
    <span className="h-4 w-4 text-xs p-0">{links.length}</span>
  ) : (
    svgIcon('open')
  );

  return (
    <header className="navbar">
      <div className="navbar-start">
        <a className="btn btn-ghost text-xl text-primary">klinky.link</a>
      </div>
      <div className="navbar-end dropdown">
        <button
          className="btn btn-primary pl-3 pr-2"
          onClick={
            showLinks ? () => setShowLinks(false) : () => setShowLinks(true)
          }
        >
          Links
          <span
            className={`badge aspect-square rounded-full font-bold p-1 m-0 h-auto ${showLinks ? 'badge-secondary' : 'badge-accent'}`}
          >
            {showLinks ? svgIcon('close') : badgeCount}
          </span>
        </button>
      </div>
    </header>
  );
}
