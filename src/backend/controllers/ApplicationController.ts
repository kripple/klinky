import * as validator from 'uuid';

import { HttpStatus } from '@/utils/errors';

export abstract class ApplicationController {
  throw_validation_error(cause: string) {
    throw Error(HttpStatus['400 Bad Request'], {
      cause,
    });
  }

  validate_uuid(type: 'link' | 'user' | string, uuid?: unknown) {
    const valid = validator.validate(uuid);
    if (!valid) {
      this.throw_validation_error(`invalid ${type} uuid '${uuid}'`);
    }
  }
}
