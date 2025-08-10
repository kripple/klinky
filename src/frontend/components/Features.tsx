export function Features() {
  // TODO: handle broken links

  const style =
    'btn btn-outline bg-base-100 rounded-full font-normal text-neutral px-3 h-7' as const;

  return (
    <div className="flex flex-wrap justify-center gap-3">
      <a
        className={`btn-info ${style}`}
        href="https://github.com/kripple/klinky/blob/main/LICENSE"
        rel="noreferrer"
        target="_blank"
      >
        Free to use
      </a>
      <a
        className={`btn-accent ${style}`}
        href="https://github.com/kripple/klinky"
        rel="noreferrer"
        target="_blank"
      >
        Open source
      </a>

      {/* TODO: maybe a modal? */}
      <button className={`btn-warning ${style}`}>No signup required</button>
    </div>
  );
}
