import '@/frontend/components/App.css';

export function App() {
  return (
    <>
      <div className="fixed-background"></div>
      <div className="app-container">
        <div className="scroll-container">
          <header className="header">
            <div className="app-title">klinky.link</div>
            <button>TBD</button>
          </header>
          <main className="main">
            <h1 className="heading">
              The anti-lytics
              <span className="heading-highlight">URL Shortener</span>
            </h1>
            <h2 className="subheading">
              Privacy isn’t just a feature — it’s the point.
              <br />
              No tracking. No accounts. Just links.
            </h2>
            <div className="card">
              <form>
                <div className="input-pair">
                  <input
                    className="readonly-prefix"
                    readOnly
                    tabIndex={-1}
                    value="https://"
                  ></input>
                  <input
                    className="input-value"
                    placeholder="Enter link here"
                    required
                  ></input>
                </div>
                <div className="input-pair">
                  <input
                    className="readonly-prefix"
                    readOnly
                    tabIndex={-1}
                    value="https://klinky.link/"
                  ></input>
                  <input
                    className="input-value"
                    placeholder="Customize your link (optional)"
                  ></input>
                </div>
                <button type="submit">Shorten URL</button>
              </form>
            </div>
            <div className="key-features-list">
              <span>Free to use</span>
              <span>Open source</span>
              <span>No signup required</span>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
