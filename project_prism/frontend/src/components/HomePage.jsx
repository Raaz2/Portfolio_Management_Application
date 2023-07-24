import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css'; // Import the CSS file for styling

const HomePage = () => {
  return (
    <div className="homepage">
      <header>
        <h1>Portfolio Management App</h1>
      </header>
      <main>
        <section className="welcome-section">
          <h2>Welcome to Portfolio Management App</h2>
          <p>
            This app allows you to manage portfolios, projects, tasks, and resources efficiently.
          </p>
        </section>
        <section className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="actions-container">
            <Link to="/portfolio-managers" className="action-btn">
              View Portfolio Managers
            </Link>
            <Link to="/projects" className="action-btn">
              View Projects
            </Link>
            <Link to="/tasks" className="action-btn">
              View Tasks
            </Link>
            <Link to="/resources" className="action-btn">
              View Resources
            </Link>
          </div>
        </section>
      </main>
      <footer>
        <p>&copy; {new Date().getFullYear()} Portfolio Management App</p>
      </footer>
    </div>
  );
};

export default HomePage;
