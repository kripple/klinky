export function Headings() {
  return (
    <>
      <h1
        aria-label="The anti-lytics Link Shortener"
        className="flex flex-col gap-1 sm:gap-4 px-6"
      >
        <span className="text-2xl sm:text-5xl text-neutral">
          The anti-lytics
        </span>
        <span className="text-3xl sm:text-6xl text-primary">
          Link Shortener
        </span>
      </h1>

      <p className="text-sm sm:text-lg text-base-content px-6">
        <span className="whitespace-nowrap">No tracking.</span>{' '}
        <span className="whitespace-nowrap">No accounts.</span>{' '}
        <span className="whitespace-nowrap">Just links.</span>
      </p>
    </>
  );
}
