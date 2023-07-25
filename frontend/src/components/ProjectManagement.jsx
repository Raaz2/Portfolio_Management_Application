import React, { useState, useEffect } from 'react';
import { Switch, Route, Link, useRouteMatch } from 'react-router-dom';
import axios from 'axios';
import './ProjectManagement.css'; // Import the CSS file
import ProjectList from './ProjectList';
import AddProjectForm from './AddProjectForm';
import UpdateProjectForm from './UpdateProjectForm';

const backendBaseUrl = 'http://localhost:5000'; // Set the base URL for the backend API

const ProjectManagement = () => {
  const [projects, setProjects] = useState([]);
  const [assignedManagers, setAssignedManagers] = useState({});

  // Function to fetch all projects and update the state
  // Function to fetch the name of the assigned manager based on manager_id
  const fetchAssignedManagerName = async (managerId) => {
    try {
      const response = await axios.get(`${backendBaseUrl}/api/portfolioManagers/${managerId}`);
      const data = response.data;
      setAssignedManagers((prevData) => ({ ...prevData, [managerId]: data.data.name }));
    } catch (error) {
      console.error(`Error fetching manager with ID ${managerId}:`, error);
      return null;
    }
  };

  // Function to fetch all projects and update the state
  const fetchProjects = async () => {
    try {
      const projectsResponse = await axios.get(`${backendBaseUrl}/api/projects`);
      const projectsData = projectsResponse.data.data;

      // Fetch assigned manager names for each project
      await Promise.all(projectsData.map((project) => fetchAssignedManagerName(project.manager_id)));

      // Update the state with projects data and assigned managers names
      setProjects(projectsData);
    } catch (error) {
      console.error('Error fetching projects and assigned managers:', error);
    }
  };

  // Fetch projects on component mount
  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="project-management">
      <h1>Project Management</h1>
      <nav>
        <Link to="/projects">Project List</Link>
        <Link to="/add-project">Add New Project</Link>
      </nav>
      <Switch>
        <Route exact path="/projects">
          <ProjectList projects={projects} assignedManagers={assignedManagers} />
        </Route>
        <Route path="/add-project">
          <AddProjectForm />
        </Route>
        <Route path="/update-project/:projectId">
          <UpdateProjectForm />
        </Route>
      </Switch>
    </div>
  );
};

export default ProjectManagement;
