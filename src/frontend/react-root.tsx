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

(function () {
  const pathname = window.location.pathname;

  if (pathname === '/' || pathname.startsWith('/links')) {
    renderApp();
  } else {
    try {
      fetch(`${import.meta.env.VITE_BACKEND_URL}${window.location.pathname}`);
    } catch {
      renderApp();
    }
  }
})();
