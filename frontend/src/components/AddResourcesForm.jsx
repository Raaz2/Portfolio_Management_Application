import React, { useState } from 'react';
import axios from 'axios';

const backendBaseUrl = 'http://localhost:5000';

const AddResourcesForm = ({ onSuccess }) => {
  const [resource, setResource] = useState({
    rname: '',
    assignedTaskId: '',
    description: '',
    type: '',
    availability: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${backendBaseUrl}/api/resources`, resource);
      onSuccess();
    } catch (error) {
      console.error('Error adding Resource:', error);
    }
  };

  return (
    <div>
      <h2>Add Resource</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Name:
            <input
              type="text"
              value={resource.rname}
              onChange={(e) => setResource({ ...resource, rname: e.target.value })}
            />
          </label>
        </div>
        <div>
          <label>
            Assigned Task ID:
            <input
              type="text"
              value={resource.assignedTaskId}
              onChange={(e) => setResource({ ...resource, assignedTaskId: e.target.value })}
            />
          </label>
        </div>
        <div>
          <label>
            Description:
            <textarea
              value={resource.description}
              onChange={(e) => setResource({ ...resource, description: e.target.value })}
            />
          </label>
        </div>
        <div>
          <label>
            Type:
            <input
              type="text"
              value={resource.type}
              onChange={(e) => setResource({ ...resource, type: e.target.value })}
            />
          </label>
        </div>
        <div>
          <label>
            Availability:
            <input
              type="text"
              value={resource.availability}
              onChange={(e) => setResource({ ...resource, availability: e.target.value })}
            />
          </label>
        </div>
        <button type="submit">Add Resource</button>
      </form>
    </div>
  );
};

export default AddResourcesForm;
