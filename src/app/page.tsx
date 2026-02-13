"use client";

import { useEffect, useState } from "react";

interface WeatherData {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    weather_code: number;
    wind_speed_10m: number;
  };
}

const getWeatherDescription = (code: number): string => {
  if (code === 0) return "Clear sky";
  if (code <= 3) return "Partly cloudy";
  if (code <= 49) return "Foggy";
  if (code <= 69) return "Rainy";
  if (code <= 79) return "Snowy";
  if (code <= 99) return "Thunderstorm";
  return "Unknown";
};

const getWeatherEmoji = (code: number): string => {
  if (code === 0) return "☀️";
  if (code <= 3) return "⛅";
  if (code <= 49) return "🌫️";
  if (code <= 69) return "🌧️";
  if (code <= 79) return "❄️";
  if (code <= 99) return "⛈️";
  return "🌡️";
};

export default function Home() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=52.3676&longitude=4.9041&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m"
        );
        const data = await response.json();
        setWeather(data);
      } catch (_err) {
        setError("Failed to fetch weather data");
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 text-center border border-gray-100 dark:border-gray-700">
          <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Hello Marciano
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8">Welcome to your weather dashboard</p>

          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg mb-6">
            <p className="text-sm font-medium opacity-80 mb-1">Current Weather in Amsterdam</p>

            {loading ? (
              <div className="py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
              </div>
            ) : error ? (
              <div className="py-8 text-red-200">{error}</div>
            ) : weather ? (
              <>
                <div className="flex items-center justify-center gap-4 mb-4">
                  <span className="text-6xl">
                    {getWeatherEmoji(weather.current.weather_code)}
                  </span>
                  <span className="text-6xl font-light">
                    {Math.round(weather.current.temperature_2m)}°C
                  </span>
                </div>
                <p className="text-lg font-medium mb-4">
                  {getWeatherDescription(weather.current.weather_code)}
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-white/20 rounded-xl p-3">
                    <p className="opacity-70">Humidity</p>
                    <p className="font-semibold text-lg">{weather.current.relative_humidity_2m}%</p>
                  </div>
                  <div className="bg-white/20 rounded-xl p-3">
                    <p className="opacity-70">Wind</p>
                    <p className="font-semibold text-lg">{weather.current.wind_speed_10m} km/h</p>
                  </div>
                </div>
              </>
            ) : null}
          </div>

          <p className="text-xs text-gray-400 dark:text-gray-500">
            Data from Open-Meteo API • Updated in real-time
          </p>
        </div>
      </div>
    </div>
  );
}