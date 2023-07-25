import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PortfolioManagerList.css'; // Import the CSS file
import AddPortfolioManagerForm from './AddPortfolioManagerForm'; // Import the AddPortfolioManagerForm component
import UpdatePortfolioManagerForm from './UpdatePortfolioManagerForm'; // Import the UpdatePortfolioManagerForm component
import AddProjectForm from './AddProjectForm'; // Import the AddProjectForm component

const backendBaseUrl = 'http://localhost:5000'; // Set the base URL for the backend

const PortfolioManagerList = () => {
  const [portfolioManagers, setPortfolioManagers] = useState([]);
  const [selectedManagerId, setSelectedManagerId] = useState(null); // State variable to keep track of selected Portfolio Manager ID for updating
  const [showAddForm, setShowAddForm] = useState(false); // State variable to control the visibility of the Add Portfolio Manager form
  const [updateStatus, setUpdateStatus] = useState(false); // State variable to show the update success message
  const [deleteStatus, setDeleteStatus] = useState(false); // State variable to show the delete success message
  const [addStatus, setAddStatus] = useState(false); // State variable to show the add success message

  // Function to fetch all Portfolio Managers and update the state
  const fetchPortfolioManagers = async () => {
    try {
      const response = await axios.get(`${backendBaseUrl}/api/portfolioManagers`);
      const data = response.data;
      setPortfolioManagers(data.data);
    } catch (error) {
      console.error('Error fetching Portfolio Managers:', error);
    }
  };

  // Fetch Portfolio Managers on component mount and when updateStatus, deleteStatus, or addStatus changes
  useEffect(() => {
    fetchPortfolioManagers();
  }, [updateStatus, deleteStatus, addStatus]);

  // Function to handle the update operation
  const handleUpdate = (id) => {
    setSelectedManagerId(id);
    setShowAddForm(false); // Hide the AddPortfolioManagerForm when showing the UpdatePortfolioManagerForm
  };

  // Function to handle the delete operation
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${backendBaseUrl}/api/portfolioManagers/${id}`);
      setDeleteStatus(true);
    } catch (error) {
      console.error('Error deleting Portfolio Manager:', error);
    }
  };

  // Function to handle the success message auto-hide after 2 seconds
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
    <div className="portfolio-managers-list">
      <h2>Portfolio Managers List</h2>
      <button onClick={() => setShowAddForm(true)}>Add New Portfolio Manager</button>
      {showAddForm ? (
        <AddPortfolioManagerForm
          onSuccess={() => {
            setShowAddForm(false);
            setAddStatus(true);
          }}
        />
      ) : selectedManagerId ? (
        <UpdatePortfolioManagerForm
          managerId={selectedManagerId} // Pass the selectedManagerId as a prop to UpdatePortfolioManagerForm
        />
      ) : (
        <>
          <ul className="manager-list">
            {portfolioManagers.map((manager) => (
              <li key={manager._id} className="manager-item">
                <p className="manager-id">Id: {manager._id}</p>
                <p className="manager-name">Name: {manager.name}</p>
                <p className="manager-status">Status: {manager.status}</p>
                <p className="manager-role">Role: {manager.role}</p>
                <p className="manager-bio">Bio: {manager.bio}</p>
                <p className="manager-start-date">Start Date: {manager.start_date}</p>
                <button onClick={() => handleUpdate(manager._id)}>Update</button>
                <button onClick={() => handleDelete(manager._id)}>Delete</button>
                <button onClick={() => setSelectedManagerId(manager._id)}>Assign Project</button>
              </li>
            ))}
          </ul>

          {updateStatus && <div className="success-message">Portfolio Manager updated successfully!</div>}
          {deleteStatus && <div className="success-message">Portfolio Manager deleted successfully!</div>}
        </>
      )}

      {selectedManagerId && (
        <div className="assign-project-form">
          <AddProjectForm
            assignedManagerId={selectedManagerId} // Pass the selectedManagerId as a prop
            onSuccess={() => {
              setSelectedManagerId(null);
              setAddStatus(true);
            }}
          />
        </div>
      )}

      {addStatus && (
        <div className="success-message">Portfolio Manager added successfully! Reloading list...</div>
      )}
    </div>
  );
};

export default PortfolioManagerList;
