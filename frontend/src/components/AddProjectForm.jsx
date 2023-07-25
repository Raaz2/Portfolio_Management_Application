import React, { useState } from 'react';
import axios from 'axios';

const backendBaseUrl = 'http://localhost:5000';

const AddProjectForm = ({ assignedManagerId, onSuccess }) => {
  const [project, setProject] = useState({
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    manager_id: assignedManagerId, // Set the initial value for manager_id from the prop
    status: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${backendBaseUrl}/api/projects`, project);
      onSuccess();
    } catch (error) {
      console.error('Error adding Project:', error);
    }
  };

  return (
    <div>
      <h2>Add Project</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Name:
            <input type="text" value={project.name} onChange={(e) => setProject({ ...project, name: e.target.value })} />
          </label>
        </div>
        <div>
          <label>
            Description:
            <textarea
              value={project.description}
              onChange={(e) => setProject({ ...project, description: e.target.value })}
            />
          </label>
        </div>
        <div>
          <label>
            Start Date:
            <input
              type="date"
              value={project.start_date}
              onChange={(e) => setProject({ ...project, start_date: e.target.value })}
            />
          </label>
        </div>
        <div>
          <label>
            End Date:
            <input
              type="date"
              value={project.end_date}
              onChange={(e) => setProject({ ...project, end_date: e.target.value })}
            />
          </label>
        </div>
        <div>
          <label>
            Assigned Manager ID:
            <input
              type="text"
              value={project.manager_id}
              onChange={(e) => setProject({ ...project, manager_id: e.target.value })}
            />
          </label>
        </div>
        <div>
          <label>
            Status:
            <input type="text" value={project.status} onChange={(e) => setProject({ ...project, status: e.target.value })} />
          </label>
        </div>
        <button type="submit">Add Project</button>
      </form>
    </div>
  );
};

export default AddProjectForm;
