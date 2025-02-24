import { useState, useEffect } from "react";
import { FaSearch, FaStar, FaTrash, FaMoon, FaSun } from "react-icons/fa";
import { WiDaySunny, WiCloudy, WiRain, WiSnow, WiThunderstorm, WiDust } from "react-icons/wi";
import { motion, AnimatePresence } from "framer-motion";
import { fetchWeather } from "./api/weatherAPI";
import "./App.css"; // Import CSS file

export default function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [favorites, setFavorites] = useState(() => {
    return JSON.parse(localStorage.getItem('favorites') || '[]');
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const getWeatherIcon = (weatherCode) => {
    const code = weatherCode?.toLowerCase();
    switch (true) {
      case code?.includes('clear'): return <WiDaySunny className="weather-icon sun-animation" />;
      case code?.includes('cloud'): return <WiCloudy className="weather-icon cloud-animation" />;
      case code?.includes('rain'): return <WiRain className="weather-icon rain-animation" />;
      case code?.includes('snow'): return <WiSnow className="weather-icon snow-animation" />;
      case code?.includes('thunder'): return <WiThunderstorm className="weather-icon thunder-animation" />;
      case code?.includes('mist'): return <WiDust className="weather-icon mist-animation" />;
      default: return <WiDaySunny className="weather-icon sun-animation" />;
    }
  };

  const formatDate = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: '2-digit'
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!city.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchWeather(city);
      if (data) {
        setWeather(data);
        setError(null);
      } else {
        setError("City not found. Please try again.");
      }
    } catch (err) {
      setError("Failed to fetch weather data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = () => {
    if (!weather) return;
    
    const cityName = weather.name;
    if (favorites.includes(cityName)) {
      setFavorites(favorites.filter(city => city !== cityName));
    } else {
      setFavorites([...favorites, cityName]);
    }
  };

  const isFavorite = weather && favorites.includes(weather.name);

  return (
    <>
      <div className="background-shapes">
        <div className="shape"></div>
        <div className="shape"></div>
        <div className="shape"></div>
        <div className="shape"></div>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="app-container"
      >
        {/* Theme Toggle */}
        <motion.button
          className="theme-toggle"
          onClick={() => setDarkMode(!darkMode)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {darkMode ? <FaSun className="sun-icon" /> : <FaMoon className="moon-icon" />}
        </motion.button>

        <div 
          className="weather-card"
          data-weather={weather?.weather[0]?.main || 'Clear'}
        >
          {/* Location Input Section */}
          <div className="location-section">
            <motion.label 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="location-label"
            >
              LOCATION
            </motion.label>
            <form onSubmit={handleSubmit} className="location-form">
              <motion.input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter city name"
                className="location-input"
                whileFocus={{ scale: 1.02 }}
              />
              <motion.button
                type="submit"
                className="set-button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={loading}
              >
                {loading ? 'LOADING...' : 'SET'}
              </motion.button>
            </form>
          </div>

          {/* Weather Display Section */}
          <AnimatePresence mode="wait">
            {weather && (
              <motion.div
                key="weather"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="weather-display"
              >
                <div className="weather-info">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  >
                    {getWeatherIcon(weather.weather[0].main)}
                  </motion.div>
                  <motion.div 
                    className="temperature"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {Math.round(weather.main.temp)}°
                  </motion.div>
                  <motion.div 
                    className="weather-description"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {weather.weather[0].main}
                  </motion.div>
                  <motion.div 
                    className="date"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    {formatDate()}
                  </motion.div>

                  {/* Favorite Button */}
                  <motion.button
                    className={`favorite-button ${isFavorite ? 'active' : ''}`}
                    onClick={toggleFavorite}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FaStar />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {error && (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="error-message"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Favorites List */}
        {favorites.length > 0 && (
          <motion.div 
            className="favorites-list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h3>Favorite Cities</h3>
            {favorites.map(fav => (
              <motion.button
                key={fav}
                className="favorite-city"
                onClick={() => {
                  setCity(fav);
                  handleSubmit(new Event('submit'));
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {fav}
              </motion.button>
            ))}
          </motion.div>
        )}
      </motion.div>
    </>
  );
}
