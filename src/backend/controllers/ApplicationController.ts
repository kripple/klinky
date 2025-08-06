import { HTTPException } from 'hono/http-exception';
import * as validator from 'uuid';

export abstract class ApplicationController {
  throw_validation_error(cause: string) {
    throw new HTTPException(400, { cause });
  }

  validate_uuid(type: 'link' | 'user' | string, uuid?: unknown) {
    const valid = validator.validate(uuid);
    if (!valid) {
      this.throw_validation_error(`invalid ${type} uuid '${uuid}'`);
    }
  }
}
