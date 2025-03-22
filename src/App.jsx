import { useState, useEffect } from "react";
import { FaSearch, FaStar, FaTrash, FaMoon, FaSun, FaCompass, FaMapMarkerAlt } from "react-icons/fa";
import { WiDaySunny, WiCloudy, WiRain, WiSnow, WiThunderstorm, WiDust, WiHumidity, WiStrongWind, WiSunrise, WiSunset, WiBarometer } from "react-icons/wi";
import { motion, AnimatePresence } from "framer-motion";
import { fetchWeather, fetchWeatherByCoords } from "./api/weatherAPI";
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
  
  // New state for location detection
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState(null);

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

  // Add a new function to determine weather background class
  const getWeatherBackgroundClass = (weatherCode) => {
    const code = weatherCode?.toLowerCase();
    switch (true) {
      case code?.includes('clear'): return 'clear';
      case code?.includes('cloud'): return 'clouds';
      case code?.includes('rain'): return 'rain';
      case code?.includes('snow'): return 'snow';
      case code?.includes('thunder'): return 'thunderstorm';
      case code?.includes('mist'): return 'mist';
      default: return 'default';
    }
  };

  // New function to detect user's location
  // Add this function to your component if it's not already there
  // In your App.jsx file, update the detectLocation function:
  
  const detectLocation = () => {
    setLocationLoading(true);
    // Clear any existing errors
    setError(null);
    
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setLocationLoading(false);
      return;
    }
    
    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    };
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          console.log("Got coordinates:", latitude, longitude);
          const data = await fetchWeatherByCoords(latitude, longitude);
          
          if (data) {
            setWeather(data);
            setCity(data.name); // Update the city input with detected location name
            setError(null); // Clear any errors on success
          }
        } catch (err) {
          console.error("Error in location detection:", err);
          setError("Failed to fetch weather for your location");
        } finally {
          setLocationLoading(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        let errorMessage;
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location permission denied";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information unavailable";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out";
            break;
          default:
            errorMessage = "An unknown error occurred";
        }
        setError(errorMessage);
        setLocationLoading(false);
      }
    );
  };
  return (
    <>
      {/* Dynamic weather background */}
      {weather && (
        <div className={`weather-background ${getWeatherBackgroundClass(weather.weather[0].main)}`}></div>
      )}
      
      <div className="background-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
        <div className="shape shape-4"></div>
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
        
        {/* Location Button */}
        <motion.button
          className="location-button"
          onClick={detectLocation}
          disabled={locationLoading}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <FaMapMarkerAlt className="location-icon" />
        </motion.button>

        <div className={`weather-layout ${!weather ? 'initial-state' : ''}`}>
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
              
              <form onSubmit={handleSubmit}>
                <div className="search-input-container">
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Enter city name"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
                
                <button
                  type="submit"
                  className="search-button"
                  disabled={loading || !city.trim()}
                >
                  {loading ? <div className="loading-spinner"></div> : "SET"}
                </button>
              </form>
              
              {/* Location detection button */}
              <div className="location-detection">
                <button 
                  className="detect-location-button"
                  onClick={detectLocation}
                  disabled={locationLoading}
                >
                  {locationLoading ? (
                    <div className="loading-spinner"></div>
                  ) : (
                    <>
                      <FaMapMarkerAlt className="location-icon" />
                      Use My Location
                    </>
                  )}
                </button>
                
                {locationError && (
                  <div className="error-message">
                    {locationError}
                  </div>
                )}
              </div>
              
              {error && <div className="error-message">{error}</div>}
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
