// In your src/components/PortfolioManagersList.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PortfolioManagerList.css'; // Import the CSS file

const PortfolioManagerList = () => {
    const [portfolioManager, setPortfolioManager] = useState([]);

    // Function to fetch all Portfolio Managers and update the state
    const fetchPortfolioManager = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/portfolioManagers');
            const data = response.data;
            setPortfolioManager(data.data);
        } catch (error) {
            console.error('Error fetching Portfolio Managers:', error);
        }
    };

    // Fetch Portfolio Managers on component mount
    useEffect(() => {
        fetchPortfolioManager();
    }, []);

    return (
        <div className="portfolio-managers-list">
            <h2>Portfolio Managers List</h2>
            <ul className="manager-list">
                {portfolioManager.map((manager) => (
                    <li key={manager._id} className="manager-item">
                        <p className="manager-name">Name: {manager.name}</p>
                        <p className="manager-status">Status: {manager.status}</p>
                        <p className="manager-role">Role: {manager.role}</p>
                        <p className="manager-bio">Bio: {manager.bio}</p>
                        <p className="manager-start-date">Start Date: {manager.start_date}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PortfolioManagerList;
