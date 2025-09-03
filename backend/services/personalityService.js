// backend/services/personalityService.js
import axios from 'axios';

const API_BASE_URL = 'https://16personalities-api.com/api/personality';

export const getQuestions = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/questions`);
    return response.data;
  } catch (error) {
    console.error('Error fetching personality questions:', error);
    throw error;
  }
};

export const getPersonalityType = async (answers, gender) => {
  try {
    const response = await axios.post(`${API_BASE_URL}`, {
      answers,
      gender
    });
    return response.data;
  } catch (error) {
    console.error('Error getting personality type:', error);
    throw error;
  }
};