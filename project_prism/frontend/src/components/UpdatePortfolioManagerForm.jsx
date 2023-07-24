import React, { useState, useEffect } from 'react';
import axios from 'axios';

const backendBaseUrl = 'http://localhost:5000'; // Set the base URL for the backend

const UpdatePortfolioManagerForm = ({ managerId }) => {
  const [portfolioManager, setPortfolioManager] = useState(null);
  const [updateStatus, setUpdateStatus] = useState(false);

  // Function to fetch Portfolio Manager details and update the state
  const fetchPortfolioManagerDetails = async () => {
    try {
      const response = await axios.get(`${backendBaseUrl}/api/portfolioManagers/${managerId}`);
      const data = response.data;
      setPortfolioManager(data.data);
    } catch (error) {
      console.error('Error fetching Portfolio Manager details:', error);
    }
  };

  // Fetch Portfolio Manager details on component mount
  useEffect(() => {
    fetchPortfolioManagerDetails();
  }, [managerId]); // Add managerId as a dependency to refetch the details when the managerId prop changes

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Make a PUT request to update the Portfolio Manager details
      await axios.put(`${backendBaseUrl}/api/portfolioManagers/${managerId}`, portfolioManager);
      // You may want to handle success and show a success message to the user
      setUpdateStatus(true);
    } catch (error) {
      console.error('Error updating Portfolio Manager:', error);
      // You may want to handle the error and show an error message to the user
    }
  };

  if (!portfolioManager) {
    return <div>Loading...</div>; // Add a loading state while fetching the details
  }

  // If the update is successful, show the "Update Successful" message and refresh the page after a short delay
  if (updateStatus) {
    setTimeout(() => window.location.reload(), 1000); // Refresh the page after 2 seconds
    return <div>Update Successful! The page will refresh shortly...</div>;
  }

  return (
    <div>
      <h2>Update Portfolio Manager</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Name:
            <input
              type="text"
              value={portfolioManager.name}
              onChange={(e) => setPortfolioManager({ ...portfolioManager, name: e.target.value })}
            />
          </label>
        </div>
        <div>
          <label>
            Status:
            <input
              type="text"
              value={portfolioManager.status}
              onChange={(e) => setPortfolioManager({ ...portfolioManager, status: e.target.value })}
            />
          </label>
        </div>
        <div>
          <label>
            Role:
            <input
              type="text"
              value={portfolioManager.role}
              onChange={(e) => setPortfolioManager({ ...portfolioManager, role: e.target.value })}
            />
          </label>
        </div>
        <div>
          <label>
            Bio:
            <textarea
              value={portfolioManager.bio}
              onChange={(e) => setPortfolioManager({ ...portfolioManager, bio: e.target.value })}
            />
          </label>
        </div>
        <div>
          <label>
            Start Date:
            <input
              type="date"
              value={portfolioManager.start_date}
              onChange={(e) => setPortfolioManager({ ...portfolioManager, start_date: e.target.value })}
            />
          </label>
        </div>
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default UpdatePortfolioManagerForm;
