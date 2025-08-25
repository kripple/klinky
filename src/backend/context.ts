export type Context = { allowedOrigins: string; connectionString: string };

export function getContext(): Context {
  const allowedOrigins = Netlify.env.get('VITE_FRONTEND_URL');
  const connectionString = Netlify.env.get('DATABASE_URL');

  if (!allowedOrigins) throw Error('[getContext] missing VITE_FRONTEND_URL');
  if (!connectionString) throw Error('[getContext] missing DATABASE_URL');
  return { allowedOrigins, connectionString } as const;
}
