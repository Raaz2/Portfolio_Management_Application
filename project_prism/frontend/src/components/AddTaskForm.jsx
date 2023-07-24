import React, { useState, useEffect } from 'react';
import axios from 'axios';

const backendBaseUrl = 'http://localhost:5000'; // Set the base URL for the backend API

const AddTaskForm = ({ projectId, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    priority: '',
    assignedTo: '', // Store the selected developer's _id
    dueDate: '',
    projectName: '',
    status: '',
  });

  const [developers, setDevelopers] = useState([]); // Store the list of developers

  useEffect(() => {
    // Fetch the list of developers from the resources collection
    const fetchDevelopers = async () => {
      try {
        const response = await axios.get(`${backendBaseUrl}/api/resources`);
        const data = response.data.data;
        setDevelopers(data);
      } catch (error) {
        console.error('Error fetching Developers:', error);
      }
    };

    fetchDevelopers();

    // Fetch project details and update projectName in formData
    const fetchProject = async () => {
      try {
        const response = await axios.get(`${backendBaseUrl}/api/projects/${projectId}`);
        const data = response.data.data;
        setFormData((prevData) => ({ ...prevData, projectName: data.name }));
      } catch (error) {
        console.error(`Error fetching project with ID ${projectId}:`, error);
      }
    };

    fetchProject();
  }, [projectId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${backendBaseUrl}/api/tasks`, formData);
      setFormData({
        name: '',
        description: '',
        priority: '',
        assignedTo: '',
        dueDate: '',
        projectName: '',
        status: '',
      });
      onSuccess();
    } catch (error) {
      console.error('Error adding Task:', error);
    }
  };

  return (
    <div>
      <h2>Add New Task</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Name:
            <input type="text" name="name" value={formData.name} onChange={handleChange} />
          </label>
        </div>
        <div>
          <label>
            Description:
            <textarea name="description" value={formData.description} onChange={handleChange} />
          </label>
        </div>
        <div>
          <label>
            Priority:
            <select name="priority" value={formData.priority} onChange={handleChange}>
              <option value="">Select Priority</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </label>
        </div>
        <div>
          <label>
            Assigned To:
            <select name="assignedTo" value={formData.assignedTo} onChange={handleChange}>
              <option value="">Select Developer</option>
              {developers.map((developer) => (
                <option key={developer._id} value={developer._id}>
                  {developer.rname}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div>
          <label>
            Project Name:
            <input
              type="text"
              name="projectName"
              value={formData.projectName}
              onChange={handleChange}
              disabled
            />
          </label>
        </div>
        <div>
          <label>
            Status:
            <select name="status" value={formData.status} onChange={handleChange}>
              <option value="">Select Status</option>
              <option value="Not Started">Not Started</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </label>
        </div>
        <button type="submit">Add Task</button>
      </form>
    </div>
  );
};

export default AddTaskForm;
