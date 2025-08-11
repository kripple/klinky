import { ShowLinksButton } from '@/frontend/components/ShowLinksButton';

export function Header({
  links,
  showLinks,
  setShowLinks,
  scrollRef,
}: {
  links?: LinkDto[];
  showLinks: boolean;
  setShowLinks: SetState<boolean>;
  scrollRef: RefObject;
}) {
  return (
    <header className="navbar">
      <div className="navbar-start">
        <a className="btn btn-ghost text-xl text-primary">klinky.link</a>
      </div>
      <div className="navbar-end dropdown">
        <ShowLinksButton
          count={links?.length}
          open={!showLinks}
          scrollRef={scrollRef}
          setShowLinks={setShowLinks}
        />
      </div>
    </header>
  );
}
