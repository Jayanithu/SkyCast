import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { WiDaySunny, WiCloudy, WiRain, WiSnow, WiThunderstorm, WiFog } from 'react-icons/wi';

const WeatherForecast = ({ forecast }) => {
  const { t } = useTranslation();
  
  const getWeatherIcon = (condition) => {
    switch (condition.toLowerCase()) {
      case 'clear':
        return <WiDaySunny className="forecast-icon" />;
      case 'clouds':
        return <WiCloudy className="forecast-icon" />;
      case 'rain':
      case 'drizzle':
        return <WiRain className="forecast-icon" />;
      case 'snow':
        return <WiSnow className="forecast-icon" />;
      case 'thunderstorm':
        return <WiThunderstorm className="forecast-icon" />;
      case 'mist':
      case 'fog':
        return <WiFog className="forecast-icon" />;
      default:
        return <WiDaySunny className="forecast-icon" />;
    }
  };
  
  const formatDay = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString(undefined, { weekday: 'short' });
  };

  return (
    <div className="forecast-container">
      <h3 className="forecast-title">{t('forecast')}</h3>
      <div className="forecast-items">
        {forecast.map((day, index) => (
          <motion.div 
            key={index}
            className="forecast-item"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="forecast-day">{formatDay(day.dt)}</div>
            {getWeatherIcon(day.weather[0].main)}
            <div className="forecast-temp">
              <span className="forecast-temp-max">{Math.round(day.temp.max)}°</span>
              <span className="forecast-temp-min">{Math.round(day.temp.min)}°</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default WeatherForecast;