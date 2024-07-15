import axios from 'axios';

const API_URL = '/'; // Base URL is set to root, since proxy will handle it

export const getApiRoot = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching API root:', error);
    throw error;
  }
};
