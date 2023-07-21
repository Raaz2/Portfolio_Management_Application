import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PortfolioManagerList.css'; // Import the CSS file
import UpdatePortfolioManagerForm from './UpdatePortfolioManagerForm'; // Import the UpdatePortfolioManagerForm component


const backendBaseUrl = 'http://localhost:5000'; // Set the base URL for the backend

const PortfolioManagerList = () => {
  const [portfolioManagers, setPortfolioManagers] = useState([]);
  const [selectedManagerId, setSelectedManagerId] = useState(null); // State variable to keep track of selected Portfolio Manager ID for updating


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

  // Fetch Portfolio Managers on component mount
  useEffect(() => {
    fetchPortfolioManagers();
  }, []);

  // Function to handle the update operation
  const handleUpdate = (id) => {
    // Implement the update logic here.
    // For example, you can navigate to an update page or display a modal with a form for updating the details.
    console.log('Update Portfolio Manager with ID:', id);
    setSelectedManagerId(id); // Set the selected Portfolio Manager ID to trigger the rendering of UpdatePortfolioManagerForm
  };

  // Function to handle the delete operation
  const handleDelete = async (id) => {
    // Implement the delete logic here.
    // For example, you can make a DELETE request to the backend API to delete the Portfolio Manager with the given ID.
    try {
      await axios.delete(`${backendBaseUrl}/api/portfolioManagers/${id}`);
      // After successful deletion, you may want to refresh the list of Portfolio Managers:
      fetchPortfolioManagers();
    } catch (error) {
      console.error('Error deleting Portfolio Manager:', error);
    }
  };

  return (
    <div className="portfolio-managers-list">
      <h2>Portfolio Managers List</h2>
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
          </li>
        ))}
      </ul>

      {selectedManagerId && (
        <div>
          <UpdatePortfolioManagerForm managerId={selectedManagerId} />
        </div>
      )}
    </div>
  );
};

export default PortfolioManagerList;
