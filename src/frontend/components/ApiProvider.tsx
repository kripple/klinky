import { ApiProvider as Provider } from '@reduxjs/toolkit/query/react';

import { api } from '@/frontend/api';

export function ApiProvider({ children }: { children: ReactNode }) {
  return <Provider api={api}>{children}</Provider>;
}
