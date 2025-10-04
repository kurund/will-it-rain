# 🌦️ Will It Rain On My Parade?

### 2025 NASA Space Apps Challenge – Team: Lovelace Fanbase

---

## 🚀 Overview

**Will It Rain On My Parade?** is a web and mobile application that helps users plan outdoor activities by predicting the likelihood of uncomfortable weather conditions.  
Instead of generic forecasts, the app translates NASA Earth observation data into **personalized risk categories**:

- 🌡️ Very Hot - bring your water bottle 🥵
- 🧊 Very Cold - wrap up warm ❄️
- 🌬️ Very Windy - bring a jacket! 🧥
- ☔ Very Wet - perhaps an umbrella? ☔️
- 😓 Polluted - remember a facemask! 😷

---

## 🌍 Features

- **Custom Query** – Users enter a location (search) and a date.
- **Weather Risk Categories** – Get a clear probability of extreme or uncomfortable weather.
- **Interactive UI** – Color-coded indicators and intuitive icons.
- **Mobile-first Design** – Optimized for both desktop and mobile.
- **Visual Insights** – Graphs and maps powered by NASA Earth observation data.

---

## 📊 Data Sources

We use NASA’s Earth Science Division datasets:

- \*\*Global Weather Repository
- **GPM (Global Precipitation Measurement):** rainfall likelihood
- **MERRA-2:** temperature, wind, humidity reanalysis
- **GEOS:** atmospheric conditions
- **MODIS / VIIRS:** land surface temperature trends

---

## 🧩 Tech Stack

- **Frontend:** Svelte, CSS (Tailwind)
- **Backend:** Python + FastAPI (for API calls and processing)
- **APIs / Data:** NASA Earthdata APIs, GES DISC, Open-Meteo (for integration fallback)
- **Visualization:** Leaflet.js / Mapbox for maps, Chart.js / D3.js for graphs
- **Deployment:** Netlify (Frontend), Render (Backend)

---

## ⚙️ Installation & Setup

1. Clone this repository:

   ```bash
   git clone https://github.com/<your-team>/will-it-rain.git
   cd will-it-rain
   ```
