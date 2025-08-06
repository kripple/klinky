import * as z from "zod";

const User = z.object({
  user_uuid: z.string(),
  created_at: z.date()
});
