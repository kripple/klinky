export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer sm:footer-horizontal bg-base-100 items-center justify-start px-3 py-1 text-sm text-base-content/60 gap-2">
      <span className="text-lg">©</span>
      {currentYear}
      <a
        className="link link-hover"
        href="https://kellyripple.com"
        rel="noreferrer"
        target="_blank"
      >
        Kelly Ripple
      </a>
      •<a className="link link-hover">Report Abuse</a>
    </footer>
  );
}
