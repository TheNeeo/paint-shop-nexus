
import React, { useEffect, useState, useCallback } from "react";
import { Cloud, Sun, CloudRain, CloudSnow, CloudLightning, CloudDrizzle, Wind, Droplets, Eye, Thermometer, MapPin, RefreshCw, CloudFog } from "lucide-react";
import { motion } from "framer-motion";

interface WeatherData {
  temp: number;
  temp_min: number;
  temp_max: number;
  humidity: number;
  wind_speed: number;
  weatherCode: number;
  city: string;
  forecast: { day: string; code: number; tempMax: number; tempMin: number }[];
}

const getWeatherInfo = (code: number) => {
  if (code === 0) return { icon: Sun, label: "Clear Sky" };
  if (code <= 3) return { icon: Cloud, label: "Partly Cloudy" };
  if (code <= 48) return { icon: CloudFog, label: "Foggy" };
  if (code <= 57) return { icon: CloudDrizzle, label: "Drizzle" };
  if (code <= 67) return { icon: CloudRain, label: "Rain" };
  if (code <= 77) return { icon: CloudSnow, label: "Snow" };
  if (code <= 82) return { icon: CloudRain, label: "Rain Showers" };
  if (code <= 86) return { icon: CloudSnow, label: "Snow Showers" };
  if (code <= 99) return { icon: CloudLightning, label: "Thunderstorm" };
  return { icon: Cloud, label: "Cloudy" };
};

const getCityName = async (lat: number, lon: number): Promise<string> => {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=en`);
    const data = await res.json();
    return data.address?.city || data.address?.town || data.address?.village || data.address?.state || "Your Location";
  } catch {
    return "Your Location";
  }
};

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchWeather = useCallback(async (lat: number, lon: number) => {
    try {
      const [weatherRes, city] = await Promise.all([
        fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto&forecast_days=4`),
        getCityName(lat, lon),
      ]);
      if (!weatherRes.ok) throw new Error("Weather fetch failed");
      const data = await weatherRes.json();
      
      const forecast = [];
      for (let i = 1; i <= 3; i++) {
        const date = new Date(data.daily.time[i]);
        forecast.push({
          day: DAY_NAMES[date.getDay()],
          code: data.daily.weather_code[i],
          tempMax: Math.round(data.daily.temperature_2m_max[i]),
          tempMin: Math.round(data.daily.temperature_2m_min[i]),
        });
      }

      setWeather({
        temp: Math.round(data.current.temperature_2m),
        temp_min: Math.round(data.daily.temperature_2m_min[0]),
        temp_max: Math.round(data.daily.temperature_2m_max[0]),
        humidity: data.current.relative_humidity_2m,
        wind_speed: Math.round(data.current.wind_speed_10m),
        weatherCode: data.current.weather_code,
        city,
        forecast,
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
          () => fetchWeather(21.2514, 81.6296)
        );
      } else {
        fetchWeather(21.2514, 81.6296);
      }
    };
    getLocation();
    const interval = setInterval(getLocation, 600000);
    return () => clearInterval(interval);
  }, [fetchWeather]);

  const timeStr = currentTime.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
  const dateStr = currentTime.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });

  if (loading) {
    return (
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 p-6 min-h-[400px] flex items-center justify-center shadow-xl">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
          <RefreshCw className="h-8 w-8 text-white/70" />
        </motion.div>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 p-6 min-h-[400px] flex items-center justify-center shadow-xl">
        <p className="text-white/80 text-sm">{error || "No weather data"}</p>
      </div>
    );
  }

  const { icon: WeatherIcon, label: weatherLabel } = getWeatherInfo(weather.weatherCode);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 p-6 min-h-[400px] shadow-xl hover:shadow-2xl hover:scale-[1.01] transition-all duration-300"
    >
      {/* Glassmorphism overlays */}
      <div className="absolute inset-0 bg-white/5 backdrop-blur-sm" />
      <div className="absolute -top-16 -right-16 w-56 h-56 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-purple-300/15 rounded-full blur-3xl" />
      <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-indigo-300/10 rounded-full blur-2xl" />

      <div className="relative z-10 flex flex-col h-full">
        {/* Top: Location + Temp + Big Icon */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <MapPin className="h-4 w-4 text-white/70" />
              <span className="text-white/90 text-sm font-medium">{weather.city}</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-6xl font-extrabold text-white tracking-tighter">{weather.temp}°</span>
              <span className="text-white/50 text-lg font-light">C</span>
            </div>
            <p className="text-white/80 text-sm font-medium mt-1">{weatherLabel}</p>
          </div>
          <motion.div
            animate={{ y: [0, -8, 0], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="mt-2"
          >
            <WeatherIcon className="h-20 w-20 text-yellow-300 drop-shadow-[0_0_20px_rgba(253,224,71,0.4)]" />
          </motion.div>
        </div>

        {/* Time & Date */}
        <div className="text-center my-3 py-3 border-t border-b border-white/10">
          <p className="text-white text-2xl font-bold tracking-wide">{timeStr}</p>
          <p className="text-white/50 text-xs mt-0.5">{dateStr}</p>
        </div>

        {/* Glass Metric Cards */}
        <div className="grid grid-cols-4 gap-2 mb-3">
          {[
            { icon: Thermometer, label: "Min/Max", value: `${weather.temp_min}°/${weather.temp_max}°` },
            { icon: Droplets, label: "Humidity", value: `${weather.humidity}%` },
            { icon: Wind, label: "Wind", value: `${weather.wind_speed} km/h` },
            { icon: Eye, label: "Visibility", value: "10 km" },
          ].map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className="flex flex-col items-center gap-1.5 bg-white/10 backdrop-blur-md rounded-xl py-2.5 px-1 border border-white/10 hover:bg-white/15 hover:scale-105 transition-all duration-200"
            >
              <m.icon className="h-4 w-4 text-white/80" />
              <span className="text-white text-xs font-bold">{m.value}</span>
              <span className="text-white/40 text-[10px]">{m.label}</span>
            </motion.div>
          ))}
        </div>

        {/* 3-Day Forecast */}
        <div className="flex items-center justify-between bg-white/8 backdrop-blur-md rounded-xl px-3 py-2.5 border border-white/10 mt-auto">
          {weather.forecast.map((f, i) => {
            const FIcon = getWeatherInfo(f.code).icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="flex flex-col items-center gap-1"
              >
                <span className="text-white/50 text-[10px] font-medium">{f.day}</span>
                <FIcon className="h-5 w-5 text-white/70" />
                <span className="text-white text-[11px] font-semibold">{f.tempMax}°</span>
                <span className="text-white/40 text-[10px]">{f.tempMin}°</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
