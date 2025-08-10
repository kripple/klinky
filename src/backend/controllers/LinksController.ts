import { HTTPException } from 'hono/http-exception';

import { UserLinksController } from '@/backend/controllers/UserLinksController';
import {
  createLink,
  deleteLink,
  deleteLinks,
  getLinkByAlias,
  getLinkById,
  getLinks,
  updateLink,
} from '@/backend/models/link.model';
import {
  generate,
  validateAlias,
  validateOptionalAlias,
} from '@/validators/alias';
import { maxLinksPerUser, validateLink } from '@/validators/link';
import { aliasMinLength } from '@/validators/string';

class LinksController extends UserLinksController {
  validate_alias(alias?: unknown): alias is string {
    const valid = validateAlias(alias).success;

    if (!valid) {
      this.throw_validation_error(`invalid alias '${alias}'`);
      return false;
    }

    return true;
  }

  validate_url(url?: unknown): url is string {
    const valid = validateLink(url).success;

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
      throw new HTTPException(404, { cause: 'missing link' });
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

    // FIXME: don't allow underscores or dashes in the default aliases
    const optionalAlias = validateOptionalAlias(optionalParams.alias);
    const alias = optionalAlias.success ? optionalAlias.data : generate();
    const user = await this.get_user_or_404(user_uuid);
    const links = await getLinks(user.id);

    if (links.length === maxLinksPerUser) {
      throw new HTTPException(403, {
        cause: `exceeds maximum of ${maxLinksPerUser} links per user`,
      });
    }

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
    if (!link) {
      throw new HTTPException(404, { cause: 'missing link' });
    }
    return link;
  };

  destroy = async ({ user_uuid, link_uuid }: UserParams & LinkParams) => {
    this.validate_uuid('user', user_uuid);
    this.validate_uuid('link', link_uuid);
    const user = await this.get_user_or_404(user_uuid);
    await deleteLink({ userId: user.id, link_uuid });
  };

  destroy_all = async ({ user_uuid }: UserParams) => {
    this.validate_uuid('user', user_uuid);
    const user = await this.get_user_or_404(user_uuid);
    await deleteLinks({ userId: user.id });
  };

  unshorten = async ({ alias }: { alias: string }) => {
    this.validate_alias(alias);
    const link = await getLinkByAlias(alias);
    return link?.value;
  };
}

export const linksController = new LinksController();
