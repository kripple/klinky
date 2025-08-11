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
        <span className="px-4 py-2 font-bold text-xl text-primary">klinky.link</span>
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
