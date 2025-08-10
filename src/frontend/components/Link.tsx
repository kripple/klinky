import { useState } from 'react';
import { FiEdit2 as EditIcon } from 'react-icons/fi';
import { LuCopy as CopyIcon } from 'react-icons/lu';
import { MdOutlineDeleteOutline as DeleteIcon } from 'react-icons/md';

import { api } from '@/frontend/api';
import { relativeTime } from '@/frontend/utils/time';
import { aliasDisplayPrefix } from '@/validators/alias';

export function Link(link: LinkDto) {
  const [deleteLink, response] = api.useDeleteLinkMutation();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const href = aliasDisplayPrefix + link.alias;
  const buttonStyle = 'btn btn-soft btn-xs' as const;
  const [errors, setErrors] = useState<string[]>([]);
  const invalid = errors.length > 0;

  return (
    <li className="list-row border-primary-content px-3 py-2" key={link.uuid}>
      <div className="list-col-grow">
        {isEditing ? (
          <>
            <label className="text-lg font-bold ">
              {aliasDisplayPrefix}
              <input
                autoComplete="off"
                autoCorrect="off"
                className="text-lg font-bold input input-xs p-0"
                name="alias"
                placeholder={link.alias}
                spellCheck="false"
                type="text"
              />
            </label>
            <p className="h-6 leading-6 text-error">{errors.join(', ')}</p>
          </>
        ) : (
          <>
            <a
              className="klinky-link link link-hover text-lg font-bold"
              href={href}
              rel="noreferrer"
              target="_blank"
            >
              {href}
            </a>
          </>
        )}
        <p className="text-xs text-accent">{link.value}</p>

        <time className="text-xs" dateTime={link.updated_at}>
          {relativeTime(link.updated_at)}
        </time>

        <div className="flex gap-1 mt-1">
          <button className={`btn-info ${buttonStyle}`}>
            <CopyIcon />
            Copy
          </button>

          {/* change link into textbox */}
          <button
            className={`btn-warning ${buttonStyle}`}
            onClick={() => setIsEditing(true)}
          >
            <EditIcon />
            Edit
          </button>

          <button
            className={`btn-error ${buttonStyle}`}
            onClick={() =>
              deleteLink({
                user_uuid: link.user_uuid,
                link_uuid: link.uuid,
              })
            }
          >
            <DeleteIcon />
            Delete
          </button>
        </div>
      </div>
    </li>
  );
}
