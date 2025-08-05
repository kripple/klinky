import { nanoid } from 'nanoid';

import {
  type LinkParams,
  UserLinksController,
  type UserParams,
} from '@/backend/controllers/UserLinksController';
import {
  createLink,
  deleteLink,
  getLinkByAlias,
  getLinkById,
  getLinks,
  maxLinksPerUser,
  updateLink,
} from '@/backend/models/link.model';
import { HttpStatus } from '@/utils/errors';
import {
  aliasMinLength,
  isSafePublicUrl,
  isValidUrlAlias,
} from '@/validators/url';

type UpdateLinkParams = UserParams & {
  link_uuid: string;
  alias: string;
};

type CreateLinkParams = UserParams & {
  alias?: string;
  value: string;
};

class LinksController extends UserLinksController {
  validate_alias(alias?: unknown): alias is string {
    const valid = isValidUrlAlias(alias);

    if (!valid) {
      this.throw_validation_error(`invalid alias '${alias}'`);
      return false;
    }

    return true;
  }

  validate_url(url?: unknown): url is string {
    const valid = isSafePublicUrl(url);

    if (!valid) {
      this.throw_validation_error(`invalid url '${url}'`);
      return false;
    }

    return true;
  }

  index = async ({ user_uuid }: UserParams) => {
    this.validate_uuid('user', user_uuid);
    const user = await this.get_user_or_404(user_uuid);
    return getLinks(user.id);
  };

  show = async ({ user_uuid, link_uuid }: UserParams & LinkParams) => {
    this.validate_uuid('user', user_uuid);
    this.validate_uuid('link', link_uuid);
    const user = await this.get_user_or_404(user_uuid);
    const link = await getLinkById({ userId: user.id, link_uuid });
    if (!link) {
      throw Error(HttpStatus['404 Not Found'], { cause: 'missing link' });
    }
    return link;
  };

  create = async ({
    user_uuid,
    value,
    ...optionalParams
  }: CreateLinkParams) => {
    this.validate_uuid('user', user_uuid);
    this.validate_url(value);
    const alias =
      'alias' in optionalParams && this.validate_alias(optionalParams.alias)
        ? optionalParams.alias
        : nanoid(aliasMinLength);

    const user = await this.get_user_or_404(user_uuid);

    const links = await getLinks(user.id);

    if (links.length === maxLinksPerUser)
      throw Error(HttpStatus['403 Forbidden'], {
        cause: 'exceeds max links per user',
      });

    return createLink({ user_id: user.id, value, alias });
  };

  update = async ({
    user_uuid,
    link_uuid,
    alias,
  }: UserParams & UpdateLinkParams) => {
    this.validate_uuid('user', user_uuid);
    this.validate_uuid('link', link_uuid);
    this.validate_alias(alias);
    const user = await this.get_user_or_404(user_uuid);
    const link = await updateLink({ userId: user.id, link_uuid, alias });
    if (!link)
      throw Error(HttpStatus['500 Internal Server Error'], {
        cause: 'missing link',
      });
    return link;
  };

  destroy = async ({ user_uuid, link_uuid }: UserParams & LinkParams) => {
    this.validate_uuid('user', user_uuid);
    this.validate_uuid('link', link_uuid);
    const user = await this.get_user_or_404(user_uuid);
    await deleteLink({ userId: user.id, link_uuid });
  };

  unshorten = async ({ alias }: { alias: string }) => {
    this.validate_alias(alias);
    const link = await getLinkByAlias(alias);
    return link?.value;
  };
}

export const linksController = new LinksController();
