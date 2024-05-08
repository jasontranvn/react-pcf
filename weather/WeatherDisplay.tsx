import * as React from 'react';
import { useState, useEffect } from 'react';
import './WeatherDisplay.css';

interface WeatherDay {
  dt: number;
  temp: {
    min: number;
    max: number;
  };
  weather: [
    {
      id: number;
      description: string;
      main: string;
      icon: string;
    },
  ];
  pressure: number;
  humidity: number;
  wind_speed: number;
  clouds: number;
}

interface WeatherDisplayProps {
  zipCode: string;
}

interface ModalProps {
  day: WeatherDay;
  onClose: () => void;
}

const apiKey = 'c05629370b6d54c4064ee341b43825be'; // not the best practice i know :(
const iconBaseUrl = 'http://openweathermap.org/img/wn/';

const WeatherDisplay: React.FC<WeatherDisplayProps> = ({ zipCode }) => {
  const [weatherData, setWeatherData] = useState<WeatherDay[]>([]);
  const [selectedDay, setSelectedDay] = useState<WeatherDay | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Fetch latitude and longitude from ZIP code
        const zipResponse = await fetch(
          `https://api.openweathermap.org/geo/1.0/zip?zip=${zipCode}&appid=${apiKey}`,
        );
        const zipData = await zipResponse.json();
        const { lat, lon } = zipData;

        // Fetch weather data using latitude and longitude
        const weatherResponse = await fetch(
          `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&appid=${apiKey}`,
        );

        if (!weatherResponse.ok) {
          throw new Error('(1) Failed to fetch weather data.');
        }

        const weatherData = await weatherResponse.json();
        setWeatherData(weatherData.daily.slice(0, 7));
        setError(null);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setError('(2) Failed to fetch weather data.');
      }
    };

    fetchWeather();
  }, [zipCode]);

  const convertKelvinToFahrenheit = (kelvin: number) => {
    return Math.round((kelvin - 273.15) * (9 / 5) + 32); // Convert Kelvin to Fahrenheit
  };

  const handleDayClick = (day: WeatherDay) => {
    setSelectedDay(day);
  };

  const handleModalClose = () => {
    setSelectedDay(null);
  };

  const Modal = ({ day, onClose }: ModalProps) => {
    return (
      <div
        style={{
          position: 'fixed',
          inset: '20% auto auto 50%',
          transform: 'translate(-50%, -20%)',
          backgroundColor: '#f9f9f9',
          padding: '20px',
          zIndex: 1000,
          border: '2px solid #ccc',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          textAlign: 'center',
          marginBottom: '10px',
        }}
      >
        {' '}
        <h2>Detailed Forecast for {new Date(day.dt * 1000).toDateString()}</h2>
        <p>
          High: {convertKelvinToFahrenheit(day.temp.max)}°F Low:{' '}
          {convertKelvinToFahrenheit(day.temp.min)}°F
        </p>
        <p>Pressure: {day.pressure}</p>
        <p>Humidity: {day.humidity} hPa</p>
        <p>Wind Speed: {day.wind_speed} metre/sec</p>
        <p>Cloudiness: {day.clouds}%</p>
        <img
          src={`${iconBaseUrl}${day.weather[0].icon}@2x.png`}
          alt={day.weather[0].main}
        />
        <p>
          {' '}
          {day.weather[0].description
            .split(' ')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')}
        </p>
        <button onClick={onClose}>Close</button>
      </div>
    );
  };

  return (
    <div className="weather-app">
      <h1>7 Day Weather Forecast For Zipcode {zipCode} Area</h1>
      {error ? (
        <p className="error">{error}</p>
      ) : (
        weatherData.length > 0 && (
          <div className="forecast-list">
            {weatherData.map((day) => (
              <div
                key={day.dt}
                className="day-forecast"
                onClick={() => handleDayClick(day)}
              >
                <h3>{new Date(day.dt * 1000).toDateString()}</h3>
                <p>
                  High: {convertKelvinToFahrenheit(day.temp.max)}°F Low:{' '}
                  {convertKelvinToFahrenheit(day.temp.min)}°F
                </p>
                <p>
                  {day.weather[0].description
                    .split(' ')
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ')}
                </p>
              </div>
            ))}
          </div>
        )
      )}
      {selectedDay && <Modal day={selectedDay} onClose={handleModalClose} />}
    </div>
  );
};

export default WeatherDisplay;
