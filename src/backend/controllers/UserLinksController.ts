import { HTTPException } from 'hono/http-exception';

import { ApplicationController } from '@/backend/controllers/ApplicationController';
import { getUserByUuid } from '@/backend/models/user.model';

export abstract class UserLinksController extends ApplicationController {
  get_user_or_404 = async (user_uuid: string) => {
    const user = await getUserByUuid(user_uuid);
    if (!user) throw new HTTPException(404, { cause: 'User Not Found' });
    return user;
  };
}
