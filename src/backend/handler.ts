import type { Context } from '@netlify/edge-functions';

import { createApi } from './api';
import { getContext } from './context';
import { connectToDatabase } from './database/db';

export default async (
  request: Request,
  context: Context,
): Promise<Response> => {
  const ctx = getContext();
  const db = connectToDatabase(ctx);
  const api = await createApi({ ctx, db });

  return api.fetch(request, context);
};
