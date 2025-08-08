export function Links({ links }: { links?: LinkDto[] }) {
  // deck of many links

  return (
    <ul className="list">
      {links?.map((link) => (
        <li className="list-item" key={link.uuid}>
          {JSON.stringify(link)}
          <a>Item 1</a>
        </li>
      ))}
    </ul>
  );
}
