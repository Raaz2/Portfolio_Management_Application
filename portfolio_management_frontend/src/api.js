import axios from 'axios';

const backendAxios = axios.create({
  baseURL: 'http://localhost:5000', // Replace with the actual backend URL and port
});

export const getAllPortfolioManagers = async () => {
  try {
    const response = await backendAxios.get('/api/portfolioManagers');
    return response.data;
  } catch (error) {
    throw error;
  }
};
