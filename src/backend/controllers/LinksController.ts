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

  index = async ({
    db,
    user_uuid,
  }: UserParams & {
    db: AppDatabase;
  }) => {
    this.validate_uuid('user', user_uuid);
    const user = await this.get_user_or_404({ db, user_uuid });
    return getLinks({ db, userId: user.id });
  };

  show = async ({
    db,
    user_uuid,
    link_uuid,
  }: UserParams &
    LinkParams & {
      db: AppDatabase;
    }) => {
    this.validate_uuid('user', user_uuid);
    this.validate_uuid('link', link_uuid);
    const user = await this.get_user_or_404({ db, user_uuid });
    const link = await getLinkById({ db, userId: user.id, link_uuid });
    if (!link) {
      throw new HTTPException(404, { cause: 'missing link' });
    }
    return link;
  };

  create = async ({
    db,
    user_uuid,
    value,
    ...optionalParams
  }: CreateLinkParams & {
    db: AppDatabase;
  }) => {
    this.validate_uuid('user', user_uuid);
    this.validate_url(value);

    const optionalAlias = validateOptionalAlias(optionalParams.alias);
    const alias = optionalAlias.success ? optionalAlias.data : generate();
    const user = await this.get_user_or_404({ db, user_uuid });
    const links = await getLinks({ db, userId: user.id });

    if (links.length === maxLinksPerUser) {
      throw new HTTPException(403, {
        cause: `exceeds maximum of ${maxLinksPerUser} links per user`,
      });
    }

    return createLink({ db, user_id: user.id, value, alias });
  };

  update = async ({
    db,
    user_uuid,
    link_uuid,
    alias,
  }: UserParams &
    UpdateLinkParams & {
      db: AppDatabase;
    }) => {
    this.validate_uuid('user', user_uuid);
    this.validate_uuid('link', link_uuid);
    this.validate_alias(alias);
    const user = await this.get_user_or_404({ db, user_uuid });
    const link = await updateLink({ db, userId: user.id, link_uuid, alias });
    if (!link) {
      throw new HTTPException(404, { cause: 'missing link' });
    }
    return link;
  };

  destroy = async ({
    db,
    user_uuid,
    link_uuid,
  }: UserParams &
    LinkParams & {
      db: AppDatabase;
    }) => {
    this.validate_uuid('user', user_uuid);
    this.validate_uuid('link', link_uuid);
    const user = await this.get_user_or_404({ db, user_uuid });
    await deleteLink({ db, userId: user.id, link_uuid });
  };

  destroy_all = async ({
    db,
    user_uuid,
  }: UserParams & {
    db: AppDatabase;
  }) => {
    this.validate_uuid('user', user_uuid);
    const user = await this.get_user_or_404({ db, user_uuid });
    await deleteLinks({ db, userId: user.id });
  };

  unshorten = async ({ db, alias }: { alias: string; db: AppDatabase }) => {
    this.validate_alias(alias);
    const link = await getLinkByAlias({ db, alias });
    return link?.value;
  };
}

export const linksController = new LinksController();
