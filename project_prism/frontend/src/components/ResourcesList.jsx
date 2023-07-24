import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ResourcesList.css'
import AddResourcesForm from './AddResourcesForm';
import UpdateResourcesForm from './UpdateResourcesForm';

const backendBaseUrl = 'http://localhost:5000';

const ResourcesList = () => {
  const [resources, setResources] = useState([]);
  const [selectedResourceId, setSelectedResourceId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [updateStatus, setUpdateStatus] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState(false);
  const [addStatus, setAddStatus] = useState(false);

  const fetchResources = async () => {
    try {
      const response = await axios.get(`${backendBaseUrl}/api/resources`);
      const data = response.data.data;
      setResources(data);
    } catch (error) {
      console.error('Error fetching Resources:', error);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [updateStatus, deleteStatus, addStatus]);

  const handleUpdate = (id) => {
    setSelectedResourceId(id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${backendBaseUrl}/api/resources/${id}`);
      setDeleteStatus(true);
    } catch (error) {
      console.error('Error deleting Resource:', error);
    }
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
    <div className="resources-list">
      <h2>Resources List</h2>
      <button onClick={() => setShowAddForm(true)}>Add New Resource</button>
      {showAddForm ? (
        <AddResourcesForm
          onSuccess={() => {
            setShowAddForm(false);
            setAddStatus(true);
          }}
        />
      ) : (
        <>
          <ul className="resource-list-items">
            {resources.map((resource) => (
              <li key={resource._id} className="resource-item">
                <p className="resource-name">Name: {resource.rname}</p>
                <p className="resource-description">Description: {resource.description}</p>
                <p className="resource-type">Type: {resource.type}</p>
                <p className="resource-availability">Availability: {resource.availability}</p>
                {/* You can display additional resource details here */}
                <button onClick={() => handleUpdate(resource._id)}>Update</button>
                <button onClick={() => handleDelete(resource._id)}>Delete</button>
              </li>
            ))}
          </ul>

          {updateStatus && <div className="success-message">Resource updated successfully!</div>}
          {deleteStatus && <div className="success-message">Resource deleted successfully!</div>}
        </>
      )}

      {selectedResourceId && (
        <div className="update-form">
          <UpdateResourcesForm
            resourceId={selectedResourceId}
            onSuccess={() => {
              setSelectedResourceId(null);
              setUpdateStatus(true);
            }}
          />
        </div>
      )}

      {addStatus && (
        <div className="success-message">Resource added successfully! Reloading list...</div>
      )}
    </div>
  );
};

export default ResourcesList;
