import { FiEdit2 as EditIcon } from 'react-icons/fi';
import { LuCopy as CopyIcon } from 'react-icons/lu';
import { MdOutlineDeleteOutline as DeleteIcon } from 'react-icons/md';

import { relativeTime } from '@/frontend/utils/time';
import { aliasDisplayPrefix } from '@/validators/alias';

export function Links({ links }: { links?: LinkDto[] }) {
  // deck of many links

  // TODO: add editing
  // TODO: add delete buttons
  // TODO: also add delete user button / delete all links
  // TODO: data manipulation on the js dates for human-readable and correct time zone

  return (
    <ul className="list">
      {links?.map((link) => {
        const href = aliasDisplayPrefix + link.alias;

        return (
          <li
            className="list-row border-primary-content px-3 py-2"
            key={link.uuid}
          >
            <div className="list-col-grow">
              <a
                className="klinky-link link link-hover text-lg font-bold"
                href={href}
                rel="noreferrer"
                target="_blank"
              >
                {href}
              </a>
              <p className="text-xs text-accent">{link.value}</p>

              <time className="text-xs" dateTime={link.updated_at}>
                {relativeTime(link.updated_at)}
              </time>

              <div className="flex gap-1 mt-1">
                <button className="btn btn-soft btn-xs btn-info">
                  <CopyIcon />
                  Copy
                </button>

                {/* change link into textbox */}
                <button className="btn btn-soft btn-xs btn-warning">
                  <EditIcon />
                  Edit
                </button>

                <button className="btn btn-soft btn-xs btn-error">
                  <DeleteIcon />
                  Delete
                </button>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
