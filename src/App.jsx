import { useState, useEffect } from "react";
import { FaSearch, FaStar, FaTrash, FaMoon, FaSun, FaCompass, FaMapMarkerAlt } from "react-icons/fa";
import { WiDaySunny, WiCloudy, WiRain, WiSnow, WiThunderstorm, WiDust, WiHumidity, WiStrongWind, WiSunrise, WiSunset, WiBarometer } from "react-icons/wi";
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

  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getWindDirection = (degrees) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
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

        <div className="weather-layout">
          {/* Left Section - Search and Location */}
          <div className="left-section">
            <div className="search-card">
              <motion.h2 
                className="text-3xl font-bold text-white/90 mb-8 text-center tracking-wide"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                LOCATION
              </motion.h2>
              
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <motion.div 
                  className="search-input-container"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Enter city name"
                    className="search-input"
                  />
                  <motion.button
                    type="submit"
                    className="search-button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="loading-spinner" />
                    ) : (
                      <span className="font-semibold tracking-wider">SET</span>
                    )}
                  </motion.button>
                </motion.div>
              </form>

              {error && (
                <motion.div
                  className="error-message"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {error}
                </motion.div>
              )}
            </div>

            {/* Favorites List with new styling */}
            {favorites.length > 0 && (
              <motion.div 
                className="favorites-card"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="text-sm font-medium text-white/70 uppercase tracking-wider mb-3">
                  Saved Locations
                </h3>
                <div className="favorites-grid">
                  {favorites.map(fav => (
                    <motion.button
                      key={fav}
                      className="favorite-item"
                      onClick={() => {
                        setCity(fav);
                        handleSubmit(new Event('submit'));
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FaMapMarkerAlt className="text-blue-400" />
                      <span>{fav}</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Section - Weather Display */}
          <div className="right-section">
            <AnimatePresence mode="wait">
              {weather && (
                <motion.div
                  key="weather"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="weather-display"
                >
                  {/* Main Weather Info */}
                  <div className="weather-main">
                    <div className="weather-header">
                      <div className="location-details">
                        <h2>{weather.name}, {weather.sys.country}</h2>
                        <span className="coordinates">
                          {weather.coord.lat.toFixed(2)}°N, {weather.coord.lon.toFixed(2)}°E
                        </span>
                      </div>
                      <motion.button
                        className={`favorite-button ${isFavorite ? 'active' : ''}`}
                        onClick={toggleFavorite}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <FaStar />
                      </motion.button>
                    </div>

                    <div className="current-weather">
                      {getWeatherIcon(weather.weather[0].main)}
                      <div className="temperature-display">
                        <span className="temperature">{Math.round(weather.main.temp)}°</span>
                        <span className="weather-description">{weather.weather[0].main}</span>
                      </div>
                    </div>

                    {/* Weather Details Grid */}
                    <div className="weather-details-grid">
                      <div className="detail-card">
                        <WiHumidity className="detail-icon" />
                        <div className="detail-info">
                          <span className="detail-value">{weather.main.humidity}%</span>
                          <span className="detail-label">Humidity</span>
                        </div>
                      </div>

                      <div className="detail-card">
                        <WiStrongWind className="detail-icon" />
                        <div className="detail-info">
                          <span className="detail-value">
                            {weather.wind.speed} m/s
                            <FaCompass 
                              className="wind-direction"
                              style={{ transform: `rotate(${weather.wind.deg}deg)` }}
                            />
                          </span>
                          <span className="detail-label">Wind</span>
                        </div>
                      </div>

                      <div className="detail-card">
                        <WiSunrise className="detail-icon" />
                        <div className="detail-info">
                          <span className="detail-value">{formatTime(weather.sys.sunrise)}</span>
                          <span className="detail-label">Sunrise</span>
                        </div>
                      </div>

                      <div className="detail-card">
                        <WiSunset className="detail-icon" />
                        <div className="detail-info">
                          <span className="detail-value">{formatTime(weather.sys.sunset)}</span>
                          <span className="detail-label">Sunset</span>
                        </div>
                      </div>
                    </div>
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
        </div>
      </motion.div>
    </>
  );
}
