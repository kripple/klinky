import { ApplicationController } from '@/backend/controllers/ApplicationController';
import { getUserByUuid } from '@/backend/models/user.model';
import { HttpStatus } from '@/utils/errors';

export abstract class UserLinksController extends ApplicationController {
  get_user_or_404 = async (user_uuid: string) => {
    const user = await getUserByUuid(user_uuid);
    if (!user)
      throw Error(HttpStatus['404 Not Found'], { cause: 'missing user' });
    return user;
  };
}
