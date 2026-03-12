
import React, { useEffect, useState, useCallback } from "react";
import { MapPin, Droplets, Wind, Gauge, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

interface WeatherData {
  temp: number;
  feelsLike: number;
  humidity: number;
  wind_speed: number;
  pressure: number;
  weatherCode: number;
  city: string;
  forecast: { day: string; code: number; tempMax: number; humidity: number; wind: number }[];
}

// Animated SVG weather icons
const SunnyIcon = ({ size = 40 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 80 80">
    <motion.g animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} style={{ transformOrigin: "40px 40px" }}>
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
        <motion.line key={angle} x1="40" y1="8" x2="40" y2="18" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" transform={`rotate(${angle} 40 40)`} />
      ))}
    </motion.g>
    <circle cx="40" cy="40" r="16" fill="#FBBF24" />
    <circle cx="40" cy="40" r="12" fill="#FCD34D" />
  </svg>
);

const CloudyIcon = ({ size = 40 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 80 80">
    <motion.g animate={{ x: [0, 4, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
      <ellipse cx="32" cy="42" rx="18" ry="12" fill="#93C5FD" />
      <ellipse cx="48" cy="38" rx="20" ry="14" fill="#60A5FA" />
      <ellipse cx="40" cy="44" rx="22" ry="10" fill="#BFDBFE" />
    </motion.g>
  </svg>
);

const PartlyCloudyIcon = ({ size = 40 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 80 80">
    <motion.g animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} style={{ transformOrigin: "28px 30px" }}>
      {[0, 60, 120, 180, 240, 300].map((angle) => (
        <line key={angle} x1="28" y1="14" x2="28" y2="20" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" transform={`rotate(${angle} 28 30)`} />
      ))}
    </motion.g>
    <circle cx="28" cy="30" r="10" fill="#FBBF24" />
    <motion.g animate={{ x: [0, 3, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>
      <ellipse cx="42" cy="44" rx="18" ry="11" fill="#93C5FD" />
      <ellipse cx="52" cy="40" rx="16" ry="12" fill="#60A5FA" />
      <ellipse cx="46" cy="46" rx="20" ry="9" fill="#BFDBFE" />
    </motion.g>
  </svg>
);

const RainIcon = ({ size = 40 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 80 80">
    <ellipse cx="34" cy="30" rx="16" ry="10" fill="#93C5FD" />
    <ellipse cx="46" cy="28" rx="18" ry="12" fill="#60A5FA" />
    <ellipse cx="40" cy="32" rx="20" ry="9" fill="#BFDBFE" />
    {[28, 40, 52].map((x, i) => (
      <motion.line key={i} x1={x} y1="42" x2={x - 3} y2="54" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round"
        animate={{ y: [0, 8, 0], opacity: [1, 0.3, 1] }}
        transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.3 }}
      />
    ))}
  </svg>
);

const ThunderstormIcon = ({ size = 40 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 80 80">
    <ellipse cx="34" cy="26" rx="16" ry="10" fill="#64748B" />
    <ellipse cx="46" cy="24" rx="18" ry="12" fill="#475569" />
    <ellipse cx="40" cy="28" rx="20" ry="9" fill="#94A3B8" />
    <motion.polygon points="42,34 36,48 42,48 38,62 50,44 44,44 48,34" fill="#FBBF24"
      animate={{ opacity: [1, 0.2, 1, 0.2, 1] }}
      transition={{ duration: 2, repeat: Infinity, times: [0, 0.1, 0.2, 0.8, 1] }}
    />
  </svg>
);

const SnowIcon = ({ size = 40 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 80 80">
    <ellipse cx="34" cy="28" rx="16" ry="10" fill="#CBD5E1" />
    <ellipse cx="46" cy="26" rx="18" ry="12" fill="#94A3B8" />
    <ellipse cx="40" cy="30" rx="20" ry="9" fill="#E2E8F0" />
    {[30, 42, 54].map((x, i) => (
      <motion.text key={i} x={x} y="50" fontSize="10" fill="#60A5FA" textAnchor="middle"
        animate={{ y: [44, 58, 44], opacity: [1, 0.4, 1] }}
        transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
      >❄</motion.text>
    ))}
  </svg>
);

const DrizzleIcon = ({ size = 40 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 80 80">
    <ellipse cx="34" cy="30" rx="16" ry="10" fill="#93C5FD" />
    <ellipse cx="46" cy="28" rx="18" ry="12" fill="#60A5FA" />
    <ellipse cx="40" cy="32" rx="20" ry="9" fill="#BFDBFE" />
    {[32, 40, 48].map((x, i) => (
      <motion.circle key={i} cx={x} cy="46" r="1.5" fill="#3B82F6"
        animate={{ y: [0, 10, 0], opacity: [1, 0, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.35 }}
      />
    ))}
  </svg>
);

const FogIcon = ({ size = 40 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 80 80">
    {[28, 38, 48].map((y, i) => (
      <motion.line key={i} x1="16" y1={y} x2="64" y2={y} stroke="#94A3B8" strokeWidth="3" strokeLinecap="round"
        animate={{ x: [0, 4, 0] }}
        transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
      />
    ))}
  </svg>
);

const WindyIcon = ({ size = 40 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 80 80">
    {[
      { y: 28, w: 44 },
      { y: 40, w: 36 },
      { y: 52, w: 40 },
    ].map((l, i) => (
      <motion.path key={i} d={`M16,${l.y} Q${16 + l.w / 2},${l.y - 6} ${16 + l.w},${l.y}`} stroke="#60A5FA" strokeWidth="3" fill="none" strokeLinecap="round"
        animate={{ x: [0, 6, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.3 }}
      />
    ))}
  </svg>
);

const getAnimatedIcon = (code: number, size = 40) => {
  if (code === 0) return <SunnyIcon size={size} />;
  if (code <= 2) return <PartlyCloudyIcon size={size} />;
  if (code <= 3) return <CloudyIcon size={size} />;
  if (code <= 48) return <FogIcon size={size} />;
  if (code <= 57) return <DrizzleIcon size={size} />;
  if (code <= 67) return <RainIcon size={size} />;
  if (code <= 77) return <SnowIcon size={size} />;
  if (code <= 82) return <RainIcon size={size} />;
  if (code <= 86) return <SnowIcon size={size} />;
  if (code <= 99) return <ThunderstormIcon size={size} />;
  return <CloudyIcon size={size} />;
};

const getWeatherLabel = (code: number) => {
  if (code === 0) return "Clear Sky";
  if (code <= 3) return "Partly Cloudy";
  if (code <= 48) return "Foggy";
  if (code <= 57) return "Drizzle";
  if (code <= 67) return "Rain";
  if (code <= 77) return "Snow";
  if (code <= 82) return "Showers";
  if (code <= 86) return "Snow Showers";
  if (code <= 99) return "Thunderstorm";
  return "Cloudy";
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
        fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m,surface_pressure&daily=temperature_2m_max,temperature_2m_min,weather_code,relative_humidity_2m_mean,wind_speed_10m_max,surface_pressure_mean&timezone=auto&forecast_days=8`),
        getCityName(lat, lon),
      ]);
      if (!weatherRes.ok) throw new Error("Weather fetch failed");
      const data = await weatherRes.json();

      const forecast = [];
      for (let i = 1; i <= 7; i++) {
        const date = new Date(data.daily.time[i]);
        forecast.push({
          day: DAY_NAMES[date.getDay()],
          code: data.daily.weather_code[i],
          tempMax: Math.round(data.daily.temperature_2m_max[i]),
          humidity: Math.round(data.daily.relative_humidity_2m_mean?.[i] ?? 0),
          wind: Math.round(data.daily.wind_speed_10m_max?.[i] ?? 0),
        });
      }

      setWeather({
        temp: Math.round(data.current.temperature_2m),
        feelsLike: Math.round(data.current.apparent_temperature),
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
      <div className="flex items-center justify-center rounded-[28px]" style={{ minHeight: 320, background: "linear-gradient(145deg, #E0F2FE 0%, #BAE6FD 50%, #7DD3FC 100%)" }}>
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
          <RefreshCw className="h-7 w-7 text-sky-500/60" />
        </motion.div>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="flex items-center justify-center rounded-[28px]" style={{ minHeight: 320, background: "linear-gradient(145deg, #E0F2FE 0%, #BAE6FD 50%, #7DD3FC 100%)" }}>
        <p className="text-slate-600 text-sm font-medium">{error || "No weather data"}</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-[28px] mx-auto"
      style={{
        maxWidth: 900,
        background: "linear-gradient(150deg, #E0F2FE 0%, #BAE6FD 35%, #7DD3FC 70%, #38BDF8 100%)",
        boxShadow: "0 20px 50px -12px rgba(56,189,248,0.3), 0 8px 20px -8px rgba(0,0,0,0.08)",
      }}
    >
      {/* Background texture */}
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 600'%3E%3Cpath d='M150,200 Q200,100 300,150 Q350,80 420,130 Q500,90 550,160 Q600,120 680,170 Q720,130 780,180 Q850,100 920,160 Q980,120 1050,180' stroke='%23000' stroke-width='2' fill='none'/%3E%3Cpath d='M100,300 Q180,250 280,290 Q350,240 430,280 Q520,230 600,270 Q680,220 760,280 Q840,240 920,300 Q1000,260 1100,320' stroke='%23000' stroke-width='2' fill='none'/%3E%3Cellipse cx='300' cy='220' rx='120' ry='70' fill='%23000' opacity='0.3'/%3E%3Cellipse cx='700' cy='250' rx='150' ry='80' fill='%23000' opacity='0.3'/%3E%3C/svg%3E")`,
        backgroundSize: "cover",
      }} />

      {/* Glass overlay */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 50%, rgba(255,255,255,0.08) 100%)" }} />

      {/* Content */}
      <div className="relative z-10 p-6">

        {/* Top: Location + Metrics + Temp badge */}
        <div className="flex items-start justify-between mb-4">
          {/* Left: location, day, metrics */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-full" style={{ background: "rgba(255,255,255,0.3)" }}>
                <MapPin className="h-3.5 w-3.5 text-slate-700" strokeWidth={2.5} />
              </div>
              <span className="text-slate-800 text-base font-bold tracking-wide">{weather.city}</span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight leading-none">{dayName}</h2>
            <p className="text-slate-600 text-xs font-medium">{getWeatherLabel(weather.weatherCode)}</p>
            
            <div className="flex flex-col gap-1.5 mt-2">
              {[
                { icon: Droplets, value: `${weather.humidity}%`, label: "humidity" },
                { icon: Wind, value: `${weather.wind_speed} km/h`, label: "wind" },
                { icon: Gauge, value: `${weather.pressure} hPa`, label: "pressure" },
              ].map(({ icon: Icon, value, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <div className="p-0.5 rounded" style={{ background: "rgba(255,255,255,0.25)" }}>
                    <Icon className="h-3.5 w-3.5 text-slate-600" strokeWidth={2} />
                  </div>
                  <span className="text-slate-800 text-xs font-semibold">{value}</span>
                  <span className="text-slate-500 text-[10px]">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Center: Hero weather illustration */}
          <div className="relative flex items-center justify-center" style={{ width: 160, height: 140 }}>
            <div className="absolute inset-0 rounded-full" style={{ background: "radial-gradient(circle, rgba(251,191,36,0.2) 0%, transparent 70%)", filter: "blur(16px)" }} />
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-10"
            >
              {getAnimatedIcon(weather.weatherCode, 120)}
            </motion.div>
          </div>

          {/* Right: Temperature badge */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="text-center"
            style={{
              background: "rgba(255,255,255,0.35)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              borderRadius: 20,
              border: "1.5px solid rgba(255,255,255,0.5)",
              padding: "14px 22px",
              boxShadow: "0 8px 24px -6px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.5)",
            }}
          >
            <div className="flex items-start justify-center gap-0.5">
              <span className="text-[44px] font-extrabold text-slate-900 leading-none">
                {weather.temp > 0 ? "+" : ""}{weather.temp}
              </span>
              <span className="text-slate-600 text-lg font-light mt-1">°C</span>
            </div>
            <p className="text-slate-500 text-[11px] font-medium mt-1.5">
              Feels like {weather.feelsLike}°C
            </p>
          </motion.div>
        </div>

        {/* Forecast Section */}
        <div className="mt-2">
          <div className="flex gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
            {weather.forecast.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 * i, duration: 0.35 }}
                whileHover={{ scale: 1.06, y: -3 }}
                className="flex-shrink-0 flex flex-col items-center gap-1 p-2.5 cursor-default"
                style={{
                  width: 110,
                  background: "rgba(255,255,255,0.3)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  borderRadius: 16,
                  border: "1px solid rgba(255,255,255,0.45)",
                  boxShadow: "0 4px 12px -3px rgba(0,0,0,0.06)",
                }}
              >
                <span className="text-slate-700 text-[10px] font-bold tracking-widest">{f.day}</span>
                <div className="my-0.5">{getAnimatedIcon(f.code, 36)}</div>
                <span className="text-slate-900 text-sm font-bold">{f.tempMax > 0 ? "+" : ""}{f.tempMax}°C</span>
                <div className="flex flex-col items-center gap-0.5">
                  <span className="text-slate-500 text-[9px] font-medium flex items-center gap-0.5">
                    <Droplets className="h-2.5 w-2.5" /> {f.humidity}%
                  </span>
                  <span className="text-slate-500 text-[9px] font-medium flex items-center gap-0.5">
                    <Wind className="h-2.5 w-2.5" /> {f.wind}km/h
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
