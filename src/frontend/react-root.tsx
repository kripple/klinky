import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from '@/frontend/components/App';

import 'daisyui/daisyui.css';
import '@/frontend/react-root.css';

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
