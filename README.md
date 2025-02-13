# 🌤️ SkyCast - A Modern Weather App
## 🚀 Project Overview

SkyCast is a modern, user-friendly weather app built using React & OpenWeather API. It allows users to search for current weather, save favorite cities, and explore features like:

✅ Voice Search 🎙️  
✅ Dark Mode 🌙  
✅ Dynamic Weather Backgrounds 🌅  
✅ Auto-Detect Location 📍  
✅ Multi-Language Support 🌍  

## 🛠 Tech Stack

- **Frontend:** React (Vite), Tailwind CSS
- **API:** OpenWeather API
- **Other:** LocalStorage, Web Speech API, Geolocation API

## 🔥 Features

### 1. Search Weather by City ✅
- Enter a city name to get real-time weather details (temperature, humidity, wind speed).

### 2. Voice Search 🎙️
- Users can speak a city name instead of typing.

### 3. Dark Mode Toggle 🌙
- Toggle between light and dark themes.

### 4. Dynamic Weather Backgrounds 🌅
- Background automatically updates based on the weather.

### 5. Auto-Detect Location 📍
- Fetches weather for your current location using Geolocation API.

### 6. Multi-Language Support 🌍
- Supports multiple languages (English, Spanish, French, German).

## 🎯 Getting Started

### 1. Install Dependencies 🛠

Clone this project and install required dependencies:

```sh
git clone https://github.com/your-username/skycast.git
cd skycast
npm install
```

### 2. Get Your OpenWeather API Key 🔑

1. Sign up for a free API key at OpenWeather.
2. Replace `YOUR_OPENWEATHER_API_KEY` in `src/api/weatherAPI.js` with your API key.

### 3. Run the Project 🚀

```sh
npm run dev
```

Then open `http://localhost:5173` in your browser.

## 🖼️ Screenshots

*(Add screenshots here of your app in action!)*

## 🛠 Project Structure

```
skycast/
│── public/
│── src/
│   ├── api/
│   │   ├── weatherAPI.js    # API Calls
│   ├── assets/             # Images & Icons
│   ├── components/         # UI Components
│   ├── App.jsx            # Main App Component
│   ├── App.css            # Styling
│   ├── index.js           # Entry Point
│── .gitignore
│── package.json
│── tailwind.config.js
│── vite.config.js
│── README.md
```

## 🎨 Customization

- **Change Background Images:** Replace images in `public/images/`
- **Add More Languages:** Extend translations in `src/languages.js`

## 🚀 Deployment

To deploy on **Vercel**:
```sh
npm install -g vercel
vercel
```

To deploy on **Netlify**:
```sh
npm run build
netlify deploy
```

## 🤝 Contributing

Feel free to open issues or submit pull requests to improve this project.

## 💡 Author
🔗 Created by **[[@Jayanithu](hthttps://github.com/Jayanithu)]**. 

Happy Coding! 🎉