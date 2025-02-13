import { useState, useEffect } from "react";
import { fetchWeather } from "./api/weatherAPI";
import { FaSearch, FaStar } from "react-icons/fa";
import "./App.css"; // Import CSS file

export default function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [favorites, setFavorites] = useState(
    JSON.parse(localStorage.getItem("favorites")) || []
  );

  const getWeather = async () => {
    if (!city) return;
    const data = await fetchWeather(city);
    if (data) setWeather(data);
  };

  const saveFavorite = () => {
    if (!weather) return;
    if (!favorites.includes(weather.name)) {
      const updatedFavorites = [...favorites, weather.name];
      setFavorites(updatedFavorites);
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    }
  };

  const removeFavorite = (favCity) => {
    const updatedFavorites = favorites.filter((c) => c !== favCity);
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  useEffect(() => {
    if (favorites.length > 0) setCity(favorites[0]);
  }, []);

  return (
    <div className="app-container">
      <h1 className="app-title">
        SkyCast 🌤️
      </h1>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city..."
          className="search-input"
        />
        <button onClick={getWeather} className="search-button">
          <FaSearch size={20} />
        </button>
      </div>

      {/* Weather Display */}
      {weather && (
        <div className="weather-box">
          <h2>{weather.name}, {weather.sys.country}</h2>
          <p>🌡️ {weather.main.temp}°C</p>
          <p>💧 Humidity: {weather.main.humidity}%</p>
          <p>🌬️ Wind Speed: {weather.wind.speed} m/s</p>

          {/* Save Favorite Button */}
          <button onClick={saveFavorite} className="favorite-button">
            <FaStar /> Save Favorite
          </button>
        </div>
      )}

      {/* Favorites List */}
      {favorites.length > 0 && (
        <div className="favorites-container">
          <h3>⭐ Favorite Cities</h3>
          <ul>
            {favorites.map((fav) => (
              <li key={fav} className="favorite-item">
                <button onClick={() => setCity(fav)}>{fav}</button>
                <button onClick={() => removeFavorite(fav)} className="remove-button">
                  ❌
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
