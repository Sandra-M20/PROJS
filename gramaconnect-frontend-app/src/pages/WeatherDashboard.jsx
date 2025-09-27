import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import dayjs from "dayjs";
import "./WeatherDashboard.css";

export default function WeatherDashboard() {
  const [city, setCity] = useState("Thrissur");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [alert, setAlert] = useState("");

  // Fetch weather data
  const getWeather = useCallback(async () => {
    setLoading(true);
    setMessage("");
    setAlert("");

    try {
      const res = await axios.get(`http://localhost:5000/api/weather?city=${city}`);
      const data = res.data;
      setWeather(data);

      // Simple rain alert
      if (data.condition && data.condition.toLowerCase().includes("rain")) {
        setAlert(`🌧️ Rain Alert in ${data.city}! Please carry an umbrella ☂️`);
      }
    } catch (err) {
      console.error(err);
      setMessage("⚠️ Unable to fetch weather data. Try again later.");
    } finally {
      setLoading(false);
    }
  }, [city]);

  // Auto refresh every 15 minutes
  useEffect(() => {
    getWeather();
    const interval = setInterval(getWeather, 900000);
    return () => clearInterval(interval);
  }, [getWeather]);

  return (
    <div className="weather-container">
      <h2>🌦 Kerala Weather Dashboard</h2>

      <div className="search-box">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name..."
        />
        <button onClick={getWeather} disabled={loading}>
          {loading ? "Loading..." : "Search"}
        </button>
      </div>

      {message && <p className="error">{message}</p>}

      {alert && (
        <div className="alert-box">
          <p>{alert}</p>
        </div>
      )}

      {weather && (
        <div className="weather-card">
          <h3>{weather.city}</h3>
          <p>{dayjs(weather.date).format("dddd, MMM D, YYYY")}</p>
          <h1>{weather.temp}°C</h1>
          <p className="condition">{weather.condition}</p>
          <p>💧 Humidity: {weather.humidity}%</p>
          <p>🌬 Wind: {weather.windSpeed} km/h</p>

          <button className="refresh-btn" onClick={getWeather}>
            🔄 Refresh
          </button>
        </div>
      )}
    </div>
  );
}
