import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from './components/HomePage';
import PortfolioManagerList from './components/PortfolioManagerList';
import ProjectList from './components/ProjectList';
import TaskList from './components/TaskList';
import ResourcesList from './components/ResourcesList';

const App = () => {
  return (
    <div className='app'>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/portfolio-managers" element={<PortfolioManagerList />} />
          <Route path="/projects" element={<ProjectList />} />
          <Route path="/tasks" element={<TaskList />} />
          <Route path="/resources" element={<ResourcesList />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
