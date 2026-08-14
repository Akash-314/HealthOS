import React from 'react';
import './Footer.css';

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p>© {new Date().getFullYear()} HealthOS. Enterprise Health Operating System Architecture.</p>
        <div className="footer-links">
          <a href="http://localhost:8000/docs" target="_blank" rel="noreferrer">
            Backend API Specs
          </a>
          <a href="https://github.com/Akash1072004/Health_Operating_System" target="_blank" rel="noreferrer">
            GitHub Repository
          </a>
        </div>
      </div>
    </footer>
  );
}
