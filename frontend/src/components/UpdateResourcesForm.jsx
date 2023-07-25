import React, { useState, useEffect } from 'react';
import axios from 'axios';

const backendBaseUrl = 'http://localhost:5000'; // Set the base URL for the backend API

const UpdateResourceForm = ({ resourceId, onSuccess }) => {
  const [formData, setFormData] = useState({
    rname: '',
    assignedTaskId: '',
    description: '',
    type: '',
    availability: '',
  });

  useEffect(() => {
    // Fetch resource details and update the form fields with the retrieved data
    const fetchResource = async () => {
      try {
        const response = await axios.get(`${backendBaseUrl}/api/resources/${resourceId}`);
        const data = response.data.data;
        setFormData({
          rname: data.rname,
          assignedTaskId: data.assignedTaskId,
          description: data.description,
          type: data.type,
          availability: data.availability,
        });
      } catch (error) {
        console.error(`Error fetching resource with ID ${resourceId}:`, error);
      }
    };

    fetchResource();
  }, [resourceId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${backendBaseUrl}/api/resources/${resourceId}`, formData);
      onSuccess();
    } catch (error) {
      console.error('Error updating Resource:', error);
    }
  };

  return (
    <div>
      <h2>Update Resource</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Name:
            <input type="text" name="rname" value={formData.rname} onChange={handleChange} />
          </label>
        </div>
        {/* <div>
          <label>
            Assigned Task ID:
            <input
              type="text"
              name="assignedTaskId"
              value={formData.assignedTaskId}
              onChange={handleChange}
            />
          </label>
        </div> */}
        <div>
          <label>
            Description:
            <textarea name="description" value={formData.description} onChange={handleChange} />
          </label>
        </div>
        <div>
          <label>
            Type:
            <input type="text" name="type" value={formData.type} onChange={handleChange} />
          </label>
        </div>
        <div>
          <label>
            Availability:
            <input
              type="text"
              name="availability"
              value={formData.availability}
              onChange={handleChange}
            />
          </label>
        </div>
        <button type="submit">Update Resource</button>
      </form>
    </div>
  );
};

export default UpdateResourceForm;
