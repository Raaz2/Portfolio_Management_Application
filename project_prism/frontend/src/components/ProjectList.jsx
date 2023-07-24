import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddProjectForm from './AddProjectForm'; // Import the AddProjectForm component
import UpdateProjectForm from './UpdateProjectForm'; // Import the UpdateProjectForm component
import AddTaskForm from './AddTaskForm'; // Import the AddTaskForm component
import './ProjectList.css'; // Import the CSS file

const backendBaseUrl = 'http://localhost:5000'; // Set the base URL for the backend

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAssignTaskForm, setShowAssignTaskForm] = useState(false); // State variable to control the visibility of the AddTaskForm
  const [updateStatus, setUpdateStatus] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState(false);
  const [addStatus, setAddStatus] = useState(false);
  const [assignedManagers, setAssignedManagers] = useState({}); // State variable to store the manager names

  // Function to fetch the name of the assigned manager based on manager_id
  const fetchAssignedManagerName = async (managerId) => {
    try {
      const response = await axios.get(`${backendBaseUrl}/api/portfolioManagers/${managerId}`);
      const data = response.data.data;
      return data.name; // Return the manager's name
    } catch (error) {
      console.error(`Error fetching manager with ID ${managerId}:`, error);
      return null;
    }
  };

  // Function to fetch all projects and update the state
  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${backendBaseUrl}/api/projects`);
      const data = response.data.data;

      // Fetch assigned manager names for each project
      const projectsWithAssignedManagers = await Promise.all(
        data.map(async (project) => {
          const managerName = await fetchAssignedManagerName(project.manager_id);
          return { ...project, managerName };
        })
      );

      setProjects(projectsWithAssignedManagers);
    } catch (error) {
      console.error('Error fetching Projects:', error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [updateStatus, deleteStatus, addStatus]);

  const handleUpdate = (id) => {
    setSelectedProjectId(id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${backendBaseUrl}/api/projects/${id}`);
      setDeleteStatus(true);
    } catch (error) {
      console.error('Error deleting Project:', error);
    }
  };

  // Function to handle the "Assign Task" button click
  const handleAssignTask = (projectId) => {
    setSelectedProjectId(projectId);
    setShowAssignTaskForm(true);
  };

  useEffect(() => {
    let timer;
    if (updateStatus || deleteStatus || addStatus) {
      timer = setTimeout(() => {
        setUpdateStatus(false);
        setDeleteStatus(false);
        setAddStatus(false);
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [updateStatus, deleteStatus, addStatus]);

  return (
    <div className="project-list">
      <h2>Project List</h2>
      <button onClick={() => setShowAddForm(true)}>Add New Project</button>
      {showAddForm ? (
        <AddProjectForm
          onSuccess={() => {
            setShowAddForm(false);
            setAddStatus(true);
          }}
        />
      ) : (
        <>
          <ul className="project-list-items">
            {projects.map((project) => (
              <li key={project._id} className="project-item">
                <p className="project-name">Name: {project.name}</p>
                <p className="project-description">Description: {project.description}</p>
                <p className="project-start-date">Start Date: {project.start_date}</p>
                <p className="project-end-date">End Date: {project.end_date}</p>
                <p className="project-manager-name">Manager Name: {project.managerName}</p>
                {/* You can display additional project details here */}
                <button onClick={() => handleUpdate(project._id)}>Update</button>
                <button onClick={() => handleDelete(project._id)}>Delete</button>
                <button onClick={() => handleAssignTask(project._id)}>Assign Task</button>
              </li>
            ))}
          </ul>

          {updateStatus && <div className="success-message">Project updated successfully!</div>}
          {deleteStatus && <div className="success-message">Project deleted successfully!</div>}
        </>
      )}

      {selectedProjectId && (
        <div className="update-form">
          <UpdateProjectForm
            projectId={selectedProjectId}
            onSuccess={() => {
              setSelectedProjectId(null);
              setUpdateStatus(true);
            }}
          />
        </div>
      )}

      {showAssignTaskForm && (
        <div className="assign-task-form">
          <AddTaskForm
            projectId={selectedProjectId} // Pass the selected project ID to the AddTaskForm
            onSuccess={() => {
              setShowAssignTaskForm(false);
              setAddStatus(true);
            }}
          />
        </div>
      )}

      {addStatus && (
        <div className="success-message">Project added successfully! Reloading list...</div>
      )}
    </div>
  );
};

export default ProjectList;
