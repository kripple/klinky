# klinky.link

**klinky.link** is a link shortener that does not require a sign-up and specifically does not perform analytics of any kind.

Built as a [Tier 3 Chingu Solo Project](https://github.com/chingu-voyages/Handbook/blob/main/docs/guides/soloproject/soloproject.md).

**Live app:** [https://kripple.github.io/klinky/](https://kripple.github.io/klinky/)

## Features

- Simple URL shortener with create, read, update, and delete functionality
- No account required — links are saved to private, unique URLs
- React frontend deployed with GitHub Pages
- Backend API built with Hono, deployed as a Netlify Edge Function
- PostgreSQL database hosted with Neon

## Development

- Assumes familiarity with development using node & npm.
- Requires a `.env.development` file with the following:

```
DATABASE_URL=<neon-postgres-connection-string>
VITE_BACKEND_URL=http://localhost:8888
VITE_FRONTEND_URL=http://localhost:5173
```

Install dependencies with `npm install`. Use npm scripts for building, running, testing, etc.

#### Developer Notes

When testing 404 cases locally, Netlify may fallback to static files.
To disable this, edit `node_modules/netlify-cli/dist/utils/proxy.js` around line 167 and return an empty array from `alternativePathsFor`.
(Note: this change will be overwritten when dependencies update.)

## Future Plans

- Use custom domain `klinky.link`.
- Detect & rate-limit brute-force attempts.
- Add CSP to prevent third-party script execution.
