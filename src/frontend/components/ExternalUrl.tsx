export function ExternalUrl({
  children,
  linkStyle,
  url,
}: {
  children: ReactNode;
  linkStyle: string;
  url: string;
}) {
  return url !== undefined ? (
    <a className={linkStyle} href={url} rel="noreferrer" target="_blank">
      {children}
    </a>
  ) : (
    <span className={`${linkStyle} pointer-events-none`}>{children}</span>
  );
}
