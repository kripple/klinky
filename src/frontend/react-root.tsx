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
      );
      const data = await response.json();
      if (data?.url) {
        window.location.href = data.url;
      } else {
        renderApp();
      }
    } catch {
      renderApp();
    }
  }
})();
