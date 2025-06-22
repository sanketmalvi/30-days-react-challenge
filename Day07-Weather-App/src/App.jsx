// src/App.jsx
import { useState, useEffect } from 'react';
import './App.css';

const API_KEY = "a591b91cb4d3c9b9eeb7eb8483119346"; // Replace with your actual key

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchWeather = async (query) => {
    if (!query) return;
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${API_KEY}&units=metric`
      );
      if (!res.ok) throw new Error("City not found");
      const data = await res.json();
      setWeather(data);
    } catch (err) {
      setWeather(null);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getWeatherByCoords = async (lat, lon) => {
    try {
      setLoading(true);
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      if (!res.ok) throw new Error("Location not found");
      const data = await res.json();
      setWeather(data);
      setCity(data.name);
    } catch (err) {
      setError("Failed to detect location or fetch weather.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          getWeatherByCoords(latitude, longitude);
        },
        (err) => {
          console.error("Geolocation error:", err);
          if (err.code === 1) {
            setError("Location access was denied. Please enable it in your browser settings.");
          } else {
            setError("Unable to detect your location.");
          }
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  }, []);

  const getWeatherIcon = (main) => {
    switch (main) {
      case 'Clear': return '☀️';
      case 'Rain': return '🌧️';
      case 'Clouds': return '☁️';
      case 'Snow': return '❄️';
      case 'Thunderstorm': return '⛈️';
      case 'Drizzle': return '🌦️';
      case 'Mist':
      case 'Fog':
      case 'Haze': return '🌫️';
      default: return '🌡️';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") fetchWeather(city);
  };

  return (
    <div className="app">
      <h1 className="heading">🌦️ Weather App</h1>
      <div className="search-box">
        <input
          type="text"
          placeholder="Enter city name..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={() => fetchWeather(city)}>Search</button>
      </div>

      {loading && <p className="loading">⏳ Loading weather...</p>}

      {!loading && error && <p className="error">❗ {error}</p>}

      {!loading && weather && (
        <div className="weather-card">
          <h2>{weather.name}, {weather.sys.country}</h2>
          <p>{getWeatherIcon(weather.weather[0].main)} {weather.weather[0].main} ({weather.weather[0].description})</p>
          <h1>{Math.round(weather.main.temp)}°C</h1>
          <p>Humidity: {weather.main.humidity}%</p>
          <p>Wind Speed: {weather.wind.speed} m/s</p>
        </div>
      )}
    </div>
  );
}

export default App;
