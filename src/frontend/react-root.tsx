function renderApp() {
  const rootElement = document.getElementById('root') as HTMLElement;

  Promise.all([
    import('react'),
    import('react-dom/client'),
    import('@/frontend/components/ApiProvider'),
    import('@/frontend/components/App'),
    import('@/frontend/react-root.css'),
  ]).then(([React, ReactDOMClient, ApiProviderModule, AppModule]) => {
    const { StrictMode } = React;
    const { createRoot } = ReactDOMClient;
    const ApiProvider = ApiProviderModule.ApiProvider;
    const App = AppModule.App;

    createRoot(rootElement).render(
      <StrictMode>
        <ApiProvider>
          <App />
        </ApiProvider>
      </StrictMode>,
    );
  });
}

(async function () {
  const alias = window.location.pathname;

  if (alias === '/' || alias.startsWith('/links')) {
    renderApp();
  } else {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}${alias}`,
        {
          redirect: 'manual',
        },
      );

      if (response.status === 302) {
        const location = response.headers.get('Location');
        if (location) {
          window.location.href = location;
        } else {
          renderApp();
        }
      } else {
        renderApp();
      }
    } catch {
      renderApp();
    }
  }
})();
