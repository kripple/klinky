import { api } from '@/frontend/api';

export function Links({ user_uuid }: { user_uuid: string }) {
  const response = api.useGetLinksQuery({ user_uuid });
  const links = response.currentData || [];

  return (
    <ul className="list card bg-base-100 rounded-box shadow-md">
      {links.map((link) => (
        <li className="list-row" key={link.uuid}>
          {JSON.stringify(link)}
        </li>
      ))}
    </ul>
  );
}
