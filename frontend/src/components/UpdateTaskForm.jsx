import React, { useState, useEffect } from 'react';
import axios from 'axios';

const backendBaseUrl = 'http://localhost:5000'; // Set the base URL for the backend API

const UpdateTaskForm = ({ taskId, onSuccess }) => {
  // State for form data and list of developers
  const [formData, setFormData] = useState({
    name: '', // Change the field name from 'name' to 'tname'
    description: '',
    priority: '',
    assignedTo: '', // Initialize the assignedTo field with an empty string
    dueDate: '',
    projectName: '',
    status: '',
  });

  const [developers, setDevelopers] = useState([]);

  // Fetch task details from the backend on component mount
  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        const response = await axios.get(`${backendBaseUrl}/api/tasks/${taskId}`);
        const taskData = response.data.data;
        setFormData(taskData);
      } catch (error) {
        console.error('Error fetching Task details:', error);
      }
    };

    fetchTaskDetails();
  }, [taskId]);

  // Fetch the list of developers from the backend on component mount
  useEffect(() => {
    const fetchDevelopers = async () => {
      try {
        const response = await axios.get(`${backendBaseUrl}/api/resources`);
        const developerData = response.data.data;
        setDevelopers(developerData);
      } catch (error) {
        console.error('Error fetching developers:', error);
      }
    };

    fetchDevelopers();
  }, []);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle the selection of a resource from the dropdown
  const handleResourceSelection = (resourceId) => {
    setFormData((prevData) => ({ ...prevData, assignedTo: resourceId }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${backendBaseUrl}/api/tasks/${taskId}`, formData);
      onSuccess();
    } catch (error) {
      console.error('Error updating Task:', error);
    }
  };

  return (
    <div>
      <h2>Update Task</h2>
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
            {/* Use the updated dropdown with the list of developers */}
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
        <button type="submit">Update Task</button>
      </form>
    </div>
  );
};

export default UpdateTaskForm;

