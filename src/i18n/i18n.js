import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          appTitle: 'SkycastWeather',
          searchPlaceholder: 'Enter city name...',
          searchButton: 'SET',
          useLocation: 'Use My Location',
          favorites: 'Favorites',
          addToFavorites: 'Add to Favorites',
          removeFromFavorites: 'Remove from Favorites',
          feelsLike: 'Feels like',
          humidity: 'Humidity',
          wind: 'Wind',
          locationError: 'Unable to get your location',
          searchError: 'Error fetching weather data',
          noFavorites: 'No favorites yet',
          forecast: 'Forecast',
        }
      },
      es: {
        translation: {
          appTitle: 'SkycastWeather',
          searchPlaceholder: 'Ingrese el nombre de la ciudad...',
          searchButton: 'BUSCAR',
          useLocation: 'Usar Mi Ubicación',
          favorites: 'Favoritos',
          addToFavorites: 'Añadir a Favoritos',
          removeFromFavorites: 'Quitar de Favoritos',
          feelsLike: 'Sensación',
          humidity: 'Humedad',
          wind: 'Viento',
          locationError: 'No se puede obtener su ubicación',
          searchError: 'Error al obtener datos del clima',
          noFavorites: 'Aún no hay favoritos',
          forecast: 'Pronóstico',
        }
      },
      fr: {
        translation: {
          appTitle: 'SkycastWeather',
          searchPlaceholder: 'Entrez le nom de la ville...',
          searchButton: 'DÉFINIR',
          useLocation: 'Utiliser Ma Position',
          favorites: 'Favoris',
          addToFavorites: 'Ajouter aux Favoris',
          removeFromFavorites: 'Retirer des Favoris',
          feelsLike: 'Ressenti',
          humidity: 'Humidité',
          wind: 'Vent',
          locationError: 'Impossible d\'obtenir votre position',
          searchError: 'Erreur lors de la récupération des données météo',
          noFavorites: 'Pas encore de favoris',
          forecast: 'Prévisions',
        }
      }
    },
    fallbackLng: 'en',
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;