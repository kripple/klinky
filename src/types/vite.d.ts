interface ImportMetaEnv {
  // built-in env variables
  readonly MODE: string;
  readonly BASE_URL: string;
  readonly PROD: string;
  readonly DEV: string;
  readonly SSR: string;

  // everything else requires VITE_ prefix to prevent exposure of server vars in the browser
  readonly VITE_BACKEND_URL: string;
  readonly VITE_FRONTEND_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
