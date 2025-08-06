import * as z from 'zod';

const Link = z.object({
  link_uuid: z.string(),
  user_uuid: z.string(),
  created_at: z.date(),
  updated_at: z.date(),
  value: z.string(),
  alias: z.string(),
});
