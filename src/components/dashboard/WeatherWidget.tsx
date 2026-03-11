
import React, { useEffect, useState, useCallback } from "react";
import { Cloud, Sun, CloudRain, CloudSnow, CloudLightning, CloudDrizzle, Wind, Droplets, Gauge, MapPin, RefreshCw, CloudFog, Thermometer } from "lucide-react";
import { motion } from "framer-motion";

interface WeatherData {
  temp: number;
  feelsLike: number;
  temp_min: number;
  temp_max: number;
  humidity: number;
  wind_speed: number;
  pressure: number;
  weatherCode: number;
  city: string;
  forecast: { day: string; code: number; tempMax: number; humidity: number; wind: number; pressure: number }[];
}

const getWeatherInfo = (code: number) => {
  if (code === 0) return { icon: Sun, label: "Clear Sky", color: "text-yellow-400" };
  if (code <= 3) return { icon: Cloud, label: "Partly Cloudy", color: "text-white" };
  if (code <= 48) return { icon: CloudFog, label: "Foggy", color: "text-gray-300" };
  if (code <= 57) return { icon: CloudDrizzle, label: "Drizzle", color: "text-blue-200" };
  if (code <= 67) return { icon: CloudRain, label: "Rain", color: "text-blue-300" };
  if (code <= 77) return { icon: CloudSnow, label: "Snow", color: "text-white" };
  if (code <= 82) return { icon: CloudRain, label: "Rain Showers", color: "text-blue-300" };
  if (code <= 86) return { icon: CloudSnow, label: "Snow Showers", color: "text-white" };
  if (code <= 99) return { icon: CloudLightning, label: "Thunderstorm", color: "text-yellow-300" };
  return { icon: Cloud, label: "Cloudy", color: "text-gray-300" };
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

const DAY_NAMES = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

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
        fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m,surface_pressure&daily=temperature_2m_max,temperature_2m_min,weather_code,relative_humidity_2m_mean,wind_speed_10m_max,surface_pressure_mean&timezone=auto&forecast_days=7`),
        getCityName(lat, lon),
      ]);
      if (!weatherRes.ok) throw new Error("Weather fetch failed");
      const data = await weatherRes.json();

      const forecast = [];
      for (let i = 1; i <= 6; i++) {
        const date = new Date(data.daily.time[i]);
        forecast.push({
          day: DAY_NAMES[date.getDay()],
          code: data.daily.weather_code[i],
          tempMax: Math.round(data.daily.temperature_2m_max[i]),
          humidity: Math.round(data.daily.relative_humidity_2m_mean?.[i] ?? 0),
          wind: Math.round(data.daily.wind_speed_10m_max?.[i] ?? 0),
          pressure: Math.round(data.daily.surface_pressure_mean?.[i] ?? 0),
        });
      }

      setWeather({
        temp: Math.round(data.current.temperature_2m),
        feelsLike: Math.round(data.current.apparent_temperature),
        temp_min: Math.round(data.daily.temperature_2m_min[0]),
        temp_max: Math.round(data.daily.temperature_2m_max[0]),
        humidity: data.current.relative_humidity_2m,
        wind_speed: Math.round(data.current.wind_speed_10m),
        pressure: Math.round(data.current.surface_pressure),
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

  const dayName = currentTime.toLocaleDateString("en-IN", { weekday: "long" });

  if (loading) {
    return (
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-300 via-sky-200 to-blue-200 p-6 min-h-[420px] flex items-center justify-center shadow-xl">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
          <RefreshCw className="h-8 w-8 text-sky-600/70" />
        </motion.div>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-300 via-sky-200 to-blue-200 p-6 min-h-[420px] flex items-center justify-center shadow-xl">
        <p className="text-sky-800/80 text-sm">{error || "No weather data"}</p>
      </div>
    );
  }

  const { icon: WeatherIcon } = getWeatherInfo(weather.weatherCode);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#87CEEB] via-[#B0D9F1] to-[#A8D8EA] shadow-xl hover:shadow-2xl hover:scale-[1.005] transition-all duration-300"
      style={{ minHeight: 420 }}
    >
      {/* World map watermark */}
      <div className="absolute inset-0 opacity-[0.06]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 600'%3E%3Cellipse cx='250' cy='220' rx='200' ry='130' fill='%23000'/%3E%3Cellipse cx='600' cy='180' rx='120' ry='80' fill='%23000'/%3E%3Cellipse cx='800' cy='250' rx='180' ry='120' fill='%23000'/%3E%3Cellipse cx='450' cy='380' rx='120' ry='70' fill='%23000'/%3E%3Cellipse cx='900' cy='350' rx='80' ry='50' fill='%23000'/%3E%3C/svg%3E")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }} />

      <div className="relative z-10 flex flex-col h-full p-5 pb-4">
        {/* Top: Location + Temperature */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <MapPin className="h-4 w-4 text-sky-700" />
              <span className="text-sky-800 text-base font-bold tracking-wide">{weather.city}</span>
            </div>
          </div>
          {/* Temperature box */}
          <div className="bg-white/30 backdrop-blur-md rounded-2xl px-5 py-2.5 border border-white/40 shadow-sm">
            <div className="flex items-start gap-0.5">
              <span className="text-4xl font-extrabold text-sky-900 leading-none">+{weather.temp}</span>
              <span className="text-sky-700 text-base font-light mt-0.5">°C</span>
            </div>
            <p className="text-sky-700 text-[11px] font-medium text-center mt-1">Feels like {weather.feelsLike}°C</p>
          </div>
        </div>

        {/* Middle: Day name + metrics + large weather icon */}
        <div className="flex items-center justify-between mt-1 flex-1">
          <div>
            <h2 className="text-2xl font-bold text-sky-900 mb-2">{dayName}</h2>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Droplets className="h-4 w-4 text-sky-700/80" />
                <span className="text-sky-800 text-sm font-semibold">{weather.humidity}%</span>
              </div>
              <div className="flex items-center gap-2">
                <Wind className="h-4 w-4 text-sky-700/80" />
                <span className="text-sky-800 text-sm font-semibold">{weather.wind_speed}km/h</span>
              </div>
              <div className="flex items-center gap-2">
                <Gauge className="h-4 w-4 text-sky-700/80" />
                <span className="text-sky-800 text-sm font-semibold">{weather.pressure}hPa</span>
              </div>
            </div>
          </div>

          {/* Large animated weather icon with cloud */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="relative mr-2"
          >
            <WeatherIcon className="h-24 w-24 text-yellow-400 drop-shadow-[0_6px_16px_rgba(250,204,21,0.5)]" strokeWidth={1.5} />
            <motion.div
              animate={{ x: [0, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -right-6 top-2"
            >
              <Cloud className="h-16 w-16 text-white drop-shadow-lg" strokeWidth={1.5} fill="white" />
            </motion.div>
            <motion.div
              animate={{ x: [0, -6, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -left-4 bottom-0"
            >
              <Cloud className="h-10 w-10 text-white/70 drop-shadow-md" strokeWidth={1.5} fill="white" fillOpacity={0.7} />
            </motion.div>
          </motion.div>
        </div>

        {/* Forecast Row - 6 days */}
        <div className="mt-auto pt-3">
          <div className="grid grid-cols-6 gap-1.5">
            {weather.forecast.map((f, i) => {
              const FIcon = getWeatherInfo(f.code).icon;
              const fColor = getWeatherInfo(f.code).color;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 * i }}
                  className="bg-white/25 backdrop-blur-sm rounded-2xl p-2 flex flex-col items-center gap-1 border border-white/30 hover:bg-white/40 hover:scale-105 transition-all duration-200 cursor-default"
                >
                  <span className="text-sky-800 text-[10px] font-bold tracking-wider">{f.day}</span>
                  <FIcon className={`h-6 w-6 ${fColor}`} strokeWidth={1.5} />
                  <span className="text-sky-900 text-xs font-bold">+{f.tempMax}°C</span>
                  <div className="flex flex-col items-center gap-0.5 mt-0.5">
                    <span className="text-sky-700/60 text-[7px] flex items-center gap-0.5">
                      <Droplets className="h-2 w-2" /> {f.humidity}%
                    </span>
                    <span className="text-sky-700/60 text-[7px] flex items-center gap-0.5">
                      <Wind className="h-2 w-2" /> {f.wind}km/h
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
