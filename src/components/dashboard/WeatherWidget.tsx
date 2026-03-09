
import React, { useEffect, useState, useCallback } from "react";
import { Cloud, Sun, CloudRain, CloudSnow, CloudLightning, CloudDrizzle, Wind, Droplets, Eye, Thermometer, MapPin, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface WeatherData {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  humidity: number;
  pressure: number;
  visibility: number;
  wind_speed: number;
  description: string;
  icon: string;
  city: string;
}

const getWeatherIcon = (icon: string) => {
  if (icon.includes("01")) return Sun;
  if (icon.includes("02") || icon.includes("03") || icon.includes("04")) return Cloud;
  if (icon.includes("09")) return CloudDrizzle;
  if (icon.includes("10")) return CloudRain;
  if (icon.includes("11")) return CloudLightning;
  if (icon.includes("13")) return CloudSnow;
  return Cloud;
};

export function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchWeather = useCallback(async (lat: number, lon: number) => {
    try {
      const API_KEY = "7ac24cec8d1ddee12e7b9e6d8f33c5a4";
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
      );
      if (!res.ok) throw new Error("Weather fetch failed");
      const data = await res.json();
      setWeather({
        temp: Math.round(data.main.temp),
        feels_like: Math.round(data.main.feels_like),
        temp_min: Math.round(data.main.temp_min),
        temp_max: Math.round(data.main.temp_max),
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        visibility: Math.round((data.visibility || 10000) / 1000),
        wind_speed: Math.round(data.wind.speed * 3.6),
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        city: data.name,
      });
      setError(null);
    } catch {
      setError("Unable to fetch weather");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude),
          () => fetchWeather(21.2514, 81.6296) // Fallback: Raipur
        );
      } else {
        fetchWeather(21.2514, 81.6296);
      }
    };
    getLocation();
    const interval = setInterval(getLocation, 600000); // 10 min
    return () => clearInterval(interval);
  }, [fetchWeather]);

  const timeStr = currentTime.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
  const dateStr = currentTime.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });

  if (loading) {
    return (
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 p-6 min-h-[340px] flex items-center justify-center shadow-xl">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
          <RefreshCw className="h-8 w-8 text-white/70" />
        </motion.div>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 p-6 min-h-[340px] flex items-center justify-center shadow-xl">
        <p className="text-white/80 text-sm">{error || "No weather data"}</p>
      </div>
    );
  }

  const WeatherIcon = getWeatherIcon(weather.icon);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 p-6 min-h-[340px] shadow-xl hover:shadow-2xl transition-shadow duration-300"
    >
      {/* Glass overlay */}
      <div className="absolute inset-0 bg-white/5 backdrop-blur-sm" />

      {/* Decorative circles */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-300/10 rounded-full blur-2xl" />

      <div className="relative z-10 flex flex-col h-full">
        {/* Top: City + Temp */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <MapPin className="h-3.5 w-3.5 text-white/70" />
              <span className="text-white/80 text-sm font-medium">{weather.city}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-5xl font-bold text-white tracking-tight">{weather.temp}°</span>
              <span className="text-white/60 text-sm mt-2">C</span>
            </div>
            <p className="text-white/70 text-xs mt-1">Feels like {weather.feels_like}°C</p>
          </div>
          <motion.div
            animate={{ y: [0, -6, 0], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <WeatherIcon className="h-14 w-14 text-yellow-300 drop-shadow-lg" />
          </motion.div>
        </div>

        {/* Middle: Condition + Time */}
        <div className="text-center my-3 py-3 border-t border-b border-white/10">
          <p className="text-white/90 text-sm font-medium capitalize mb-1">{weather.description}</p>
          <p className="text-white text-2xl font-bold tracking-wide">{timeStr}</p>
          <p className="text-white/60 text-xs mt-0.5">{dateStr}</p>
        </div>

        {/* Bottom: Metrics */}
        <div className="grid grid-cols-4 gap-2 mt-auto">
          {[
            { icon: Thermometer, label: "Min/Max", value: `${weather.temp_min}°/${weather.temp_max}°` },
            { icon: Droplets, label: "Humidity", value: `${weather.humidity}%` },
            { icon: Wind, label: "Wind", value: `${weather.wind_speed} km/h` },
            { icon: Eye, label: "Visibility", value: `${weather.visibility} km` },
          ].map((m, i) => (
            <div key={i} className="flex flex-col items-center gap-1 bg-white/10 rounded-xl py-2 px-1">
              <m.icon className="h-4 w-4 text-white/70" />
              <span className="text-white text-xs font-semibold">{m.value}</span>
              <span className="text-white/50 text-[10px]">{m.label}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
