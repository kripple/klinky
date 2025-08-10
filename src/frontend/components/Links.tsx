import { Link } from '@/frontend/components/Link';

export function Links({ links }: { links?: LinkDto[] }) {
  // deck of many links

  return (
    <ul className="list">
      {links?.map((link) => (
        <Link key={link.uuid} {...link} />
      ))}
    </ul>
  );
}
