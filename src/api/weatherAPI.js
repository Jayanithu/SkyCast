import axios from "axios";

const API_KEY = "2f238e866977691e12a9e1648ccb46da"; 
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

export const fetchWeather = async (city) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        q: city,
        units: 'metric',
        appid: API_KEY
      }
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      // API responded with an error
      if (error.response.status === 404) {
        throw new Error('City not found');
      }
      throw new Error(error.response.data.message || 'Failed to fetch weather data');
    }
    // Network error or other issues
    throw new Error('Network error. Please check your connection');
  }
};

// New function to fetch weather by coordinates
// Add this function if it's not already there
export const fetchWeatherByCoords = async (lat, lon) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        lat,
        lon,
        units: 'metric',
        appid: API_KEY
      }
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to fetch weather data');
    }
    throw new Error('Network error. Please check your connection');
  }
};
