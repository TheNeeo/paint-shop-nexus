
import React, { useEffect, useState, useCallback } from "react";
import { Cloud, Sun, CloudRain, CloudSnow, CloudLightning, CloudDrizzle, Wind, Droplets, Gauge, MapPin, RefreshCw, CloudFog } from "lucide-react";
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

// Background cloud shapes SVG for texture
const CLOUD_TEXTURE_SVG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1400 700'%3E%3Cdefs%3E%3CradialGradient id='g1' cx='50%25' cy='50%25' r='50%25'%3E%3Cstop offset='0%25' stop-color='%23fff' stop-opacity='0.08'/%3E%3Cstop offset='100%25' stop-color='%23fff' stop-opacity='0'/%3E%3C/radialGradient%3E%3C/defs%3E%3Cellipse cx='200' cy='180' rx='220' ry='140' fill='url(%23g1)'/%3E%3Cellipse cx='650' cy='120' rx='160' ry='100' fill='url(%23g1)'/%3E%3Cellipse cx='1000' cy='200' rx='200' ry='130' fill='url(%23g1)'/%3E%3Cellipse cx='400' cy='400' rx='180' ry='100' fill='url(%23g1)'/%3E%3Cellipse cx='1100' cy='450' rx='140' ry='80' fill='url(%23g1)'/%3E%3Cellipse cx='750' cy='550' rx='200' ry='90' fill='url(%23g1)'/%3E%3C/svg%3E")`;

// World map outline SVG
const WORLD_MAP_SVG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 600'%3E%3Cpath d='M150,200 Q200,100 300,150 Q350,80 420,130 Q500,90 550,160 Q600,120 680,170 Q720,130 780,180 Q850,100 920,160 Q980,120 1050,180' stroke='%23fff' stroke-width='1.5' fill='none' opacity='0.06'/%3E%3Cpath d='M100,300 Q180,250 280,290 Q350,240 430,280 Q520,230 600,270 Q680,220 760,280 Q840,240 920,300 Q1000,260 1100,320' stroke='%23fff' stroke-width='1.5' fill='none' opacity='0.05'/%3E%3Cpath d='M200,400 Q280,360 370,390 Q440,350 520,380 Q600,340 680,370 Q760,330 840,380 Q920,350 1000,400' stroke='%23fff' stroke-width='1' fill='none' opacity='0.04'/%3E%3Cellipse cx='300' cy='220' rx='120' ry='70' fill='%23fff' opacity='0.02'/%3E%3Cellipse cx='700' cy='250' rx='150' ry='80' fill='%23fff' opacity='0.02'/%3E%3Cellipse cx='500' cy='380' rx='100' ry='50' fill='%23fff' opacity='0.015'/%3E%3C/svg%3E")`;

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
      <div className="relative overflow-hidden p-8 flex items-center justify-center" style={{ borderRadius: 28, minHeight: 480, background: "linear-gradient(135deg, #7EC8E3 0%, #A8D8EA 30%, #B8E4F0 60%, #C5EBF5 100%)", boxShadow: "0 20px 60px -15px rgba(100,180,220,0.4), 0 8px 24px -8px rgba(0,0,0,0.1)" }}>
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
          <RefreshCw className="h-8 w-8 text-white/60" />
        </motion.div>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="relative overflow-hidden p-8 flex items-center justify-center" style={{ borderRadius: 28, minHeight: 480, background: "linear-gradient(135deg, #7EC8E3 0%, #A8D8EA 30%, #B8E4F0 60%, #C5EBF5 100%)", boxShadow: "0 20px 60px -15px rgba(100,180,220,0.4), 0 8px 24px -8px rgba(0,0,0,0.1)" }}>
        <p className="text-white/80 text-sm font-medium">{error || "No weather data"}</p>
      </div>
    );
  }

  const { icon: WeatherIcon, color: weatherColor } = getWeatherInfo(weather.weatherCode);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden"
      style={{
        borderRadius: 28,
        minHeight: 480,
        background: "linear-gradient(145deg, #6BB8D6 0%, #7EC8E3 15%, #A8D8EA 40%, #B8E4F0 65%, #D0F0FA 100%)",
        boxShadow: "0 25px 60px -15px rgba(80,160,210,0.45), 0 10px 30px -10px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.3)",
      }}
    >
      {/* Layer 1: World map texture */}
      <div className="absolute inset-0" style={{ backgroundImage: WORLD_MAP_SVG, backgroundSize: "cover", backgroundPosition: "center" }} />

      {/* Layer 2: Cloud texture shapes */}
      <div className="absolute inset-0" style={{ backgroundImage: CLOUD_TEXTURE_SVG, backgroundSize: "cover", backgroundPosition: "center" }} />

      {/* Layer 3: Glass overlay for depth */}
      <div className="absolute inset-0" style={{
        background: "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 40%, rgba(255,255,255,0.06) 100%)",
        backdropFilter: "blur(1px)",
      }} />

      {/* Layer 4: Decorative floating clouds in background */}
      <motion.div
        animate={{ x: [0, 30, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-8 right-[15%] opacity-[0.08]"
      >
        <Cloud className="h-32 w-32 text-white" fill="white" strokeWidth={0.5} />
      </motion.div>
      <motion.div
        animate={{ x: [0, -20, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-28 left-[5%] opacity-[0.06]"
      >
        <Cloud className="h-24 w-24 text-white" fill="white" strokeWidth={0.5} />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full p-6 pb-5" style={{ minHeight: 480 }}>

        {/* === TOP SECTION === */}
        <div className="flex items-start justify-between mb-2">
          {/* Left: Location + Day */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-full bg-white/20 backdrop-blur-sm">
                <MapPin className="h-4 w-4 text-white" strokeWidth={2} />
              </div>
              <span className="text-white text-lg font-bold tracking-wide drop-shadow-sm">{weather.city}</span>
            </div>
          </div>

          {/* Right: Temperature glass badge */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="relative"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.15) 100%)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              borderRadius: 20,
              border: "1.5px solid rgba(255,255,255,0.45)",
              padding: "12px 24px",
              boxShadow: "0 8px 32px -8px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.4)",
            }}
          >
            <div className="flex items-start gap-1">
              <span className="text-[42px] font-extrabold text-white leading-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.15)]">
                +{weather.temp}
              </span>
              <span className="text-white/80 text-lg font-light mt-1">°C</span>
            </div>
            <p className="text-white/70 text-xs font-medium text-center mt-1.5">
              Feels like {weather.feelsLike}°C
            </p>
          </motion.div>
        </div>

        {/* === MIDDLE SECTION: Day + Metrics + Hero Illustration === */}
        <div className="flex items-center justify-between flex-1 my-2">
          {/* Left: Day name + weather metrics */}
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-extrabold text-white drop-shadow-sm tracking-tight">{dayName}</h2>
            <div className="flex flex-col gap-2.5 mt-1">
              <div className="flex items-center gap-2.5">
                <div className="p-1 rounded-lg bg-white/15">
                  <Droplets className="h-4 w-4 text-white/90" strokeWidth={2} />
                </div>
                <span className="text-white text-sm font-semibold">{weather.humidity}%</span>
                <span className="text-white/50 text-xs">humidity</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="p-1 rounded-lg bg-white/15">
                  <Wind className="h-4 w-4 text-white/90" strokeWidth={2} />
                </div>
                <span className="text-white text-sm font-semibold">{weather.wind_speed} km/h</span>
                <span className="text-white/50 text-xs">wind</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="p-1 rounded-lg bg-white/15">
                  <Gauge className="h-4 w-4 text-white/90" strokeWidth={2} />
                </div>
                <span className="text-white text-sm font-semibold">{weather.pressure} hPa</span>
                <span className="text-white/50 text-xs">pressure</span>
              </div>
            </div>
          </div>

          {/* Right: LARGE hero weather illustration */}
          <div className="relative flex items-center justify-center" style={{ width: 200, height: 180 }}>
            {/* Glow behind icon */}
            <div className="absolute inset-0 rounded-full" style={{
              background: "radial-gradient(circle, rgba(255,220,80,0.25) 0%, rgba(255,220,80,0) 70%)",
              filter: "blur(20px)",
            }} />

            {/* Main weather icon - 140px */}
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-10"
            >
              <WeatherIcon
                className={`h-36 w-36 ${weatherColor} drop-shadow-[0_8px_24px_rgba(250,204,21,0.4)]`}
                strokeWidth={1.2}
              />
            </motion.div>

            {/* Cloud 1 - large, right */}
            <motion.div
              animate={{ x: [0, 14, 0], y: [0, -4, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -right-4 top-6 z-20"
            >
              <Cloud className="h-20 w-20 text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.08)]" strokeWidth={1.2} fill="white" />
            </motion.div>

            {/* Cloud 2 - medium, left bottom */}
            <motion.div
              animate={{ x: [0, -10, 0], y: [0, 3, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -left-6 bottom-2 z-20"
            >
              <Cloud className="h-14 w-14 text-white/80 drop-shadow-md" strokeWidth={1.2} fill="white" fillOpacity={0.85} />
            </motion.div>

            {/* Cloud 3 - small, top left */}
            <motion.div
              animate={{ x: [0, 8, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              className="absolute left-2 -top-2 z-5"
            >
              <Cloud className="h-10 w-10 text-white/50 drop-shadow-sm" strokeWidth={1} fill="white" fillOpacity={0.5} />
            </motion.div>
          </div>
        </div>

        {/* === FORECAST SECTION === */}
        <div className="mt-auto pt-4">
          <div className="grid grid-cols-6 gap-2">
            {weather.forecast.map((f, i) => {
              const FIcon = getWeatherInfo(f.code).icon;
              const fColor = getWeatherInfo(f.code).color;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i, duration: 0.4 }}
                  whileHover={{ scale: 1.08, y: -4 }}
                  className="flex flex-col items-center gap-1.5 p-2.5 cursor-default transition-all duration-200"
                  style={{
                    background: "linear-gradient(135deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.12) 100%)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    borderRadius: 18,
                    border: "1px solid rgba(255,255,255,0.35)",
                    boxShadow: "0 4px 16px -4px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.3)",
                  }}
                >
                  <span className="text-white/80 text-[10px] font-bold tracking-widest uppercase">{f.day}</span>
                  <FIcon className={`h-7 w-7 ${fColor} drop-shadow-sm`} strokeWidth={1.5} />
                  <span className="text-white text-sm font-bold drop-shadow-sm">+{f.tempMax}°C</span>
                  <div className="flex flex-col items-center gap-0.5 mt-0.5">
                    <span className="text-white/55 text-[8px] font-medium flex items-center gap-0.5">
                      <Droplets className="h-2.5 w-2.5" /> {f.humidity}%
                    </span>
                    <span className="text-white/55 text-[8px] font-medium flex items-center gap-0.5">
                      <Wind className="h-2.5 w-2.5" /> {f.wind}km/h
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
