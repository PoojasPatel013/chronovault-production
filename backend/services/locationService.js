// backend/services/locationService.js
import axios from 'axios';

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

export const getPlaceCoordinates = async (location) => {
  try {
    const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
      params: {
        address: location,
        key: GOOGLE_PLACES_API_KEY
      }
    });

    if (response.data.status !== 'OK') {
      throw new Error(response.data.error_message || 'Failed to get location coordinates');
    }

    const { lat, lng } = response.data.results[0].geometry.location;
    return { lat, lng };
  } catch (error) {
    console.error('Error getting place coordinates:', error);
    throw error;
  }
};

export const searchNearbyTherapists = async (location, radius = 50000) => {
  try {
    const { lat, lng } = await getPlaceCoordinates(location);
    
    // Search for therapists within the specified radius
    const response = await axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json`, {
      params: {
        location: `${lat},${lng}`,
        radius,
        type: 'health',
        keyword: 'therapist',
        key: GOOGLE_PLACES_API_KEY
      }
    });

    if (response.data.status !== 'OK') {
      throw new Error(response.data.error_message || 'Failed to find therapists');
    }

    return response.data.results;
  } catch (error) {
    console.error('Error searching for therapists:', error);
    throw error;
  }
};