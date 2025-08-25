import { UserLinksController } from '@/backend/controllers/UserLinksController';
import { createUser, deleteUserByUuid } from '@/backend/models/user.model';

class UsersController extends UserLinksController {
  create = async ({ db }: { db: AppDatabase }) => {
    const user = await createUser({ db });
    return user;
  };

  show = async ({
    db,
    user_uuid,
  }: UserParams & {
    db: AppDatabase;
  }) => {
    this.validate_uuid('user', user_uuid);
    const user = await this.get_user_or_404({ db, user_uuid });
    return user;
  };

  destroy = async ({
    db,
    user_uuid,
  }: UserParams & {
    db: AppDatabase;
  }) => {
    this.validate_uuid('user', user_uuid);
    await deleteUserByUuid({ db, uuid: user_uuid });
  };
}

export const usersController = new UsersController();
