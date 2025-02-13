import axios from "axios";

const API_KEY = "2f238e866977691e12a9e1648ccb46da"; 
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

export const fetchWeather = async (city) => {
  try {
    const response = await axios.get(`${BASE_URL}?q=${city}&units=metric&appid=${API_KEY}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching weather:", error);
    return null;
  }
};
