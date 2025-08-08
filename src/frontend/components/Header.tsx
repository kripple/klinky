export function Header({ showLinks }: { showLinks?: () => void }) {
  return (
    <header className="navbar">
      <div className="navbar-start">
        <a className="btn btn-ghost text-xl text-primary">
          klinky.link
        </a>
      </div>
      <div className="navbar-end">
        <button
          className="btn btn-primary"
          disabled={!showLinks}
          onClick={showLinks}
        >
          Links
        </button>
      </div>
    </header>
  );
}
