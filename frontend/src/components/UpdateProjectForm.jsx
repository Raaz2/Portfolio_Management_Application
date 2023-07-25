import React, { useState, useEffect } from 'react';
import axios from 'axios';

const backendBaseUrl = 'http://localhost:5000'; // Set the base URL for the backend API

const UpdateProjectForm = ({ projectId, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    manager_id: '',
  });

  useEffect(() => {
    // Fetch project details and update the form fields with the retrieved data
    const fetchProject = async () => {
      try {
        const response = await axios.get(`${backendBaseUrl}/api/projects/${projectId}`);
        const data = response.data.data;
        setFormData({
          name: data.name,
          description: data.description,
          start_date: data.start_date,
          end_date: data.end_date,
          manager_id: data.manager_id,
        });
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
      await axios.put(`${backendBaseUrl}/api/projects/${projectId}`, formData);
      onSuccess();
    } catch (error) {
      console.error('Error updating Project:', error);
    }
  };

  return (
    <div>
      <h2>Update Project</h2>
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
            Start Date:
            <input type="date" name="start_date" value={formData.start_date} onChange={handleChange} />
          </label>
        </div>
        <div>
          <label>
            End Date:
            <input type="date" name="end_date" value={formData.end_date} onChange={handleChange} />
          </label>
        </div>
        <div>
          <label>
            Manager ID:
            <input type="text" name="manager_id" value={formData.manager_id} onChange={handleChange} />
          </label>
        </div>
        <button type="submit">Update Project</button>
      </form>
    </div>
  );
};

export default UpdateProjectForm;
