import React from 'react';
import './Home.css';

export function Home({ backendStatus }) {
  return (
    <main className="home-container">
      <section className="hero-section">
        <div className="badge">HEALTH OPERATING SYSTEM</div>
        <h1 className="hero-title">Unified Healthcare Architecture</h1>
        <p className="hero-subtitle">
          Modular, enterprise-grade digital health ecosystem bridging frontend client applications with FastAPI microservices.
        </p>

        <div className="cards-grid">
          <div className="card">
            <div className="card-icon">⚡</div>
            <h3>FastAPI Backend</h3>
            <p>Domain-driven Python microservices with automatic OpenAPI/Swagger documentation generation.</p>
            <div className="card-tag">Python 3.10+</div>
          </div>

          <div className="card">
            <div className="card-icon">⚛️</div>
            <h3>React + Vite Client</h3>
            <p>Lightning fast SPA modular architecture using lightweight styling & reusable component design.</p>
            <div className="card-tag">React 19</div>
          </div>

          <div className="card">
            <div className="card-icon">🛡️</div>
            <h3>Enterprise Ready</h3>
            <p>Built with modular folder structure, clean architecture boundaries, and CORS security handlers.</p>
            <div className="card-tag">Clean Architecture</div>
          </div>
        </div>
      </section>

      <section className="status-section">
        <h2>Backend Status Monitor</h2>
        <div className="status-card">
          <pre>{JSON.stringify(backendStatus || { status: 'connecting', message: 'Checking backend live status...' }, null, 2)}</pre>
        </div>
      </section>
    </main>
  );
}
