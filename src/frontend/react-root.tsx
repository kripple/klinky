import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { ApiProvider } from '@/frontend/components/ApiProvider';
import { App } from '@/frontend/components/App';

import '@/frontend/react-root.css';

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <ApiProvider>
      <App />
    </ApiProvider>
  </StrictMode>,
);
