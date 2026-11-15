# SkyCast Weather App

A responsive Next.js weather app for GitHub and Vercel. Users can search a city or country and view current weather plus a seven-day forecast.

## Features
- Worldwide city/country search
- Current temperature and apparent temperature
- Weather condition, humidity, wind, gusts, pressure, cloud cover and precipitation
- Seven-day high/low temperatures
- Daily rain probability, wind and UV index
- Sunrise and sunset
- Responsive interface
- No API key or environment variable required

## Data provider
This project uses the Open-Meteo Geocoding API and Forecast API. Review Open-Meteo usage and licensing terms before commercial use.

## Run locally
```bash
npm install
npm run dev
```
Open `http://localhost:3000`.

## Deploy to Vercel
1. Create a GitHub repository and upload all extracted files.
2. In Vercel choose **Add New > Project**.
3. Import the GitHub repository.
4. Keep the detected Next.js defaults and deploy.

## Search accuracy
For ambiguous place names, include the country or state, such as `Paris, France` or `Springfield, Illinois`.
