export function Headings() {
  return (
    <>
      <h1
        aria-label="The anti-lytics Link Shortener"
        className="flex flex-col gap-4"
      >
        <span className="text-5xl text-neutral">The anti-lytics</span>
        <span className="text-6xl text-primary">Link Shortener</span>
      </h1>

      <p className="text-base-content text-lg">
        No tracking. No accounts. Just links.
      </p>
    </>
  );
}
