import { ApiProvider } from '@/frontend/components/ApiProvider';
import { Home } from '@/frontend/components/Home';

import '@/frontend/components/App.css';

export function App() {
  return (
    <ApiProvider>
      <div className="fixed-background"></div>
      <div className="app-container">
        <div className="scroll-container">
          <Home />
        </div>
      </div>
    </ApiProvider>
  );
}
