import axios from 'axios';

const API_BASE_URL = '/api';

export const analyzeGraph = async (graphData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/analyze-graph`, graphData);
    return response.data;
  } catch (error) {
    console.error('API error:', error);
    throw error;
  }
};

export const analyzeStability = async (stabilityData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/stability-analysis`, stabilityData);
    return response.data;
  } catch (error) {
    console.error('API error:', error);
    throw error;
  }
};
