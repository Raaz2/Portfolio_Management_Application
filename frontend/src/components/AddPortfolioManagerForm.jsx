import React, { useState } from 'react';
import axios from 'axios';
import './AddPortfolioManagerForm.css';

const AddPortfolioManagerForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    status: '',
    role: '',
    bio: '',
    start_date: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/portfolioManagers', formData);
      // Add logic to handle successful submission (e.g., show success message, redirect, etc.)
      console.log('New Portfolio Manager added:', response.data);
      // Clear the form after successful submission
      setFormData({
        name: '',
        status: '',
        role: '',
        bio: '',
        start_date: '',
      });
      setTimeout(() => window.location.reload(), 1000); // Refresh the page after 2 seconds
    return <div>Manager added Successfully! The page will refresh shortly...</div>;
    } catch (error) {
      console.error('Error adding Portfolio Manager:', error);
      // Add logic to handle error (e.g., show error message)
    }
  };

  return (
    <div>
      <h2>Add New Portfolio Manager</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name:</label>
        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} />

        <label htmlFor="status">Status:</label>
        <input type="text" id="status" name="status" value={formData.status} onChange={handleChange} />

        <label htmlFor="role">Role:</label>
        <input type="text" id="role" name="role" value={formData.role} onChange={handleChange} />

        <label htmlFor="bio">Bio:</label>
        <textarea id="bio" name="bio" value={formData.bio} onChange={handleChange}></textarea>

        <label htmlFor="start_date">Start Date:</label>
        <input type="date" id="start_date" name="start_date" value={formData.start_date} onChange={handleChange} />

        <button type="submit">Add Portfolio Manager</button>
      </form>
    </div>
  );
};

export default AddPortfolioManagerForm;
