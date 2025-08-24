import { useState } from 'react';
import { FiEdit2 as EditIcon } from 'react-icons/fi';
import { LuCopy as CopyIcon } from 'react-icons/lu';
import { MdOutlineDeleteOutline as DeleteIcon } from 'react-icons/md';

import { api } from '@/frontend/api';
import { CopyButton } from '@/frontend/components/CopyButton';
import { EditLinkForm } from '@/frontend/components/EditLinkForm';
import { relativeTime } from '@/frontend/utils/time';
import { aliasDisplayPrefix, aliasPrefix } from '@/validators/alias';

export function Link(link: LinkDto) {
  const [deleteLink] = api.useDeleteLinkMutation();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const href = aliasDisplayPrefix + link.alias;
  const buttonStyle = 'btn btn-soft btn-xs' as const;
  // const [errors, setErrors] = useState<string[]>([]);
  // const invalid = errors.length > 0;

  return (
    <li
      className={`list-row px-3 py-2 ${isEditing ? 'outline outline-primary-content shadow-md' : ''}`}
      key={link.uuid}
    >
      <div className={`list-col-grow grid-switch`}>
        {isEditing ? (
          <EditLinkForm {...link} setIsEditing={setIsEditing} />
        ) : null}

        <span className={`grid-top ${isEditing ? 'grid-switch-off' : ''}`}>
          <a
            className={`klinky-link link link-hover text-lg font-bold`}
            href={href}
            rel="noreferrer"
            target="_blank"
          >
            {href}
          </a>

          <p className={`text-xs text-accent`}>{link.value}</p>

          <time className={`text-xs`} dateTime={link.updated_at}>
            {relativeTime(link.updated_at)}
          </time>
        </span>

        <div className="flex gap-1 mt-1 grid-bottom">
          <CopyButton
            buttonStyle={buttonStyle}
            disabled={isEditing}
            label={
              <>
                <CopyIcon /> Copy
              </>
            }
            text={aliasPrefix + link.alias}
          />

          <button
            className={`btn-warning ${buttonStyle}`}
            disabled={isEditing}
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
