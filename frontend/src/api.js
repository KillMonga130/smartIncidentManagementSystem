import axios from 'axios';

const API_URL = '/api'; // Ensure this matches the backend endpoint

export const getApiRoot = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching API root:', error);
    throw error;
  }
};
