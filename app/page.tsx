"use client";
import { useEffect, useState } from "react";
import { Search, MapPin, Wind, Droplets, Gauge, Eye, Sunrise, Sunset, Navigation, CloudSun } from "lucide-react";

type Place={name:string;country?:string;admin1?:string;latitude:number;longitude:number;timezone?:string};
type Weather={current:any;current_units:any;daily:any;daily_units:any;timezone_abbreviation:string};
const codes:Record<number,[string,string]>= {0:["☀️","Clear sky"],1:["🌤️","Mainly clear"],2:["⛅","Partly cloudy"],3:["☁️","Overcast"],45:["🌫️","Fog"],48:["🌫️","Rime fog"],51:["🌦️","Light drizzle"],53:["🌦️","Drizzle"],55:["🌧️","Heavy drizzle"],61:["🌦️","Light rain"],63:["🌧️","Rain"],65:["🌧️","Heavy rain"],71:["🌨️","Light snow"],73:["🌨️","Snow"],75:["❄️","Heavy snow"],77:["❄️","Snow grains"],80:["🌦️","Rain showers"],81:["🌧️","Rain showers"],82:["⛈️","Heavy showers"],85:["🌨️","Snow showers"],86:["❄️","Heavy snow showers"],95:["⛈️","Thunderstorm"],96:["⛈️","Storm with hail"],99:["⛈️","Heavy hail storm"]};
const wx=(n:number)=>codes[n]||["🌡️","Weather"];
const day=(s:string,i:number)=>i===0?"Today":new Date(s+"T12:00:00").toLocaleDateString(undefined,{weekday:"short"});
const time=(s:string)=>new Date(s).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});

export default function Home(){
 const [query,setQuery]=useState("Mumbai"); const [place,setPlace]=useState<Place|null>(null); const [weather,setWeather]=useState<Weather|null>(null); const [loading,setLoading]=useState(false); const [error,setError]=useState("");
 async function search(name=query){
  if(!name.trim())return; setLoading(true);setError("");
  try{
   const g=await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name.trim())}&count=1&language=en&format=json`); if(!g.ok)throw new Error("Location search failed");
   const gj=await g.json(); if(!gj.results?.length)throw new Error("Location not found. Try adding the country, for example: Paris, France.");
   const p:Place=gj.results[0]; setPlace(p);
   const params=new URLSearchParams({latitude:String(p.latitude),longitude:String(p.longitude),timezone:"auto",forecast_days:"7",temperature_unit:"celsius",wind_speed_unit:"kmh",precipitation_unit:"mm",current:"temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m",daily:"weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,precipitation_sum,rain_sum,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max"});
   const r=await fetch(`https://api.open-meteo.com/v1/forecast?${params}`); if(!r.ok)throw new Error("Weather service is temporarily unavailable"); setWeather(await r.json());
  }catch(e){setError(e instanceof Error?e.message:"Unable to load weather");setWeather(null)}finally{setLoading(false)}
 }
 useEffect(()=>{search("Mumbai")},[]);
 const c=weather?.current,d=weather?.daily;
 return <main>
  <header><div className="brand"><span><CloudSun/></span>SkyCast</div><div className="unit">°C</div></header>
  <section className="wrap">
   <div className="intro"><p>WORLDWIDE WEATHER</p><h1>Weather, wherever you are.</h1><span>Search any city or country for current conditions and a seven-day outlook.</span></div>
   <form className="search" onSubmit={e=>{e.preventDefault();search()}}><MapPin/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Enter city or country, e.g. London"/><button disabled={loading}><Search size={19}/>{loading?"Searching...":"Search"}</button></form>
   {error&&<div className="error">{error}</div>}
   {place&&weather&&c&&d&&<>
    <section className="current">
     <div className="currentMain"><div className="location"><MapPin size={18}/><div><h2>{place.name}</h2><p>{[place.admin1,place.country].filter(Boolean).join(", ")}</p></div></div><div className="condition"><span className="weatherIcon">{wx(c.weather_code)[0]}</span><div><div className="temp">{Math.round(c.temperature_2m)}°</div><b>{wx(c.weather_code)[1]}</b><p>Feels like {Math.round(c.apparent_temperature)}°C</p></div></div><small>Updated {time(c.time)} {weather.timezone_abbreviation}</small></div>
     <div className="details"><Detail icon={<Droplets/>} label="Humidity" value={`${c.relative_humidity_2m}%`}/><Detail icon={<Wind/>} label="Wind" value={`${Math.round(c.wind_speed_10m)} km/h`}/><Detail icon={<Navigation/>} label="Gusts" value={`${Math.round(c.wind_gusts_10m)} km/h`}/><Detail icon={<Gauge/>} label="Pressure" value={`${Math.round(c.pressure_msl)} hPa`}/><Detail icon={<CloudSun/>} label="Cloud cover" value={`${c.cloud_cover}%`}/><Detail icon={<Droplets/>} label="Precipitation" value={`${c.precipitation} mm`}/></div>
    </section>
    <section className="forecast"><div className="sectionTitle"><div><p>7-DAY FORECAST</p><h2>Plan the week ahead</h2></div><span>{place.name} · Local time</span></div><div className="days">{d.time.map((date:string,i:number)=><article className={i===0?"today":""} key={date}><div className="dayHead"><b>{day(date,i)}</b><span>{new Date(date+"T12:00:00").toLocaleDateString(undefined,{day:"numeric",month:"short"})}</span></div><div className="dayIcon">{wx(d.weather_code[i])[0]}</div><strong>{wx(d.weather_code[i])[1]}</strong><div className="temps"><b>{Math.round(d.temperature_2m_max[i])}°</b><span>{Math.round(d.temperature_2m_min[i])}°</span></div><div className="rain"><Droplets size={14}/>{d.precipitation_probability_max[i]}%</div><div className="mini"><span><Wind size={13}/>{Math.round(d.wind_speed_10m_max[i])} km/h</span><span>UV {Math.round(d.uv_index_max[i])}</span></div></article>)}</div></section>
    <section className="sun"><div><Sunrise/><span>Sunrise<b>{time(d.sunrise[0])}</b></span></div><div className="sunline"><i></i></div><div><Sunset/><span>Sunset<b>{time(d.sunset[0])}</b></span></div></section>
   </>}
   {loading&&!weather&&<div className="loader"><CloudSun/>Loading weather...</div>}
  </section><footer>Weather data from Open-Meteo · No API key required</footer>
 </main>
}
function Detail({icon,label,value}:{icon:React.ReactNode,label:string,value:string}){return <div className="detail"><span>{icon}</span><div><small>{label}</small><b>{value}</b></div></div>}
