
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
        fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min&timezone=auto`),
        getCityName(lat, lon),
      ]);
      if (!weatherRes.ok) throw new Error("Weather fetch failed");
      const data = await weatherRes.json();
      setWeather({
        temp: Math.round(data.current.temperature_2m),
        temp_min: Math.round(data.daily.temperature_2m_min[0]),
        temp_max: Math.round(data.daily.temperature_2m_max[0]),
        humidity: data.current.relative_humidity_2m,
        wind_speed: Math.round(data.current.wind_speed_10m),
        weatherCode: data.current.weather_code,
        city,
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
    const interval = setInterval(getLocation, 600000);
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

  const { icon: WeatherIcon, label: weatherLabel } = getWeatherInfo(weather.weatherCode);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 p-6 min-h-[340px] shadow-xl hover:shadow-2xl transition-shadow duration-300"
    >
      <div className="absolute inset-0 bg-white/5 backdrop-blur-sm" />
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-300/10 rounded-full blur-2xl" />

      <div className="relative z-10 flex flex-col h-full">
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
          </div>
          <motion.div
            animate={{ y: [0, -6, 0], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <WeatherIcon className="h-14 w-14 text-yellow-300 drop-shadow-lg" />
          </motion.div>
        </div>

        <div className="text-center my-3 py-3 border-t border-b border-white/10">
          <p className="text-white/90 text-sm font-medium capitalize mb-1">{weatherLabel}</p>
          <p className="text-white text-2xl font-bold tracking-wide">{timeStr}</p>
          <p className="text-white/60 text-xs mt-0.5">{dateStr}</p>
        </div>

        <div className="grid grid-cols-4 gap-2 mt-auto">
          {[
            { icon: Thermometer, label: "Min/Max", value: `${weather.temp_min}°/${weather.temp_max}°` },
            { icon: Droplets, label: "Humidity", value: `${weather.humidity}%` },
            { icon: Wind, label: "Wind", value: `${weather.wind_speed} km/h` },
            { icon: Eye, label: "Visibility", value: "10 km" },
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
