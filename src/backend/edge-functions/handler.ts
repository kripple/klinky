import { handleRoutes } from '@/backend/routes';
import { getDb, getHeaders, getOptionsHeaders } from '@/backend/utils';

export default async function handler(request: Request) {
  try {
    const allowedOrigins = Netlify.env.get('VITE_APP_URL');
    const connectionString = Netlify.env.get('DATABASE_URL');

    if (!allowedOrigins) throw Error('missing VITE_APP_URL');
    if (!connectionString) throw Error('missing DATABASE_URL');

    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: getOptionsHeaders(allowedOrigins),
      });
    }

    const db = getDb(connectionString);
    const data = handleRoutes(db);

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: getHeaders(allowedOrigins),
    });
  } catch (error) {
    console.error('Unexpected handler error', error);

    const allowedOrigins = Netlify.env.get('VITE_APP_URL');
    if (!allowedOrigins) console.warn('missing VITE_APP_URL');

    return new Response('Internal Server Error', {
      status: 500,
      headers: getHeaders(allowedOrigins || ''),
    });
  }
}
