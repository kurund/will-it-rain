# 🌦️ Will It Rain On My Parade?

### 2025 NASA Space Apps Challenge – Team: Lovelace Fanbase

---

## 🚀 Overview

**Will It Rain On My Parade?** is a web and mobile application that helps users plan their holidays by predicting the likelihood of weather conditions.  
Instead of generic forecasts, the app translates Global Weather Repository data into **personalized risk categories**:

- 🌡️ Temperature
- 🌬️ Wind condition
- ☔ Precipitation
- 😷 Air pollution
- 🌫️ Cloud coverage

---

## 🌍 Features

- **Custom Query** – Users enter a location (search) and a date.
- **Mobile-first Design** – Optimized for both desktop and mobile.
- **Weather Categories** - Temperature, precipitation, wind conditions, air quality, and cloud coverage.
- **Live coverage** - A current weather update of the location selected by user.

---

## 📊 Data Sources

- **API** Global Weather Repository
- **Open-Meteo API:** Real-time weather data and forecasts
- **OpenStreetMap Nominatim:** Geocoding and location services

---

## 🧩 Tech Stack

### Frontend (Web App)

- **Framework:** SvelteKit with Svelte 5
- **Styling:** Tailwind CSS 4.x
- **3D Visualization:** Globe.gl + Three.js for interactive globe
- **Language:** TypeScript

### Mobile App

- **Framework:** React Native
- **Language:** TypeScript

### Backend

- **Framework:** Python + FastAPI
- **APIs:** Open-Meteo, OpenStreetMap Nominatim

### Deployment

- **Frontend:** Netlify
- **Backend:** Render

---

## ⚙️ Installation & Setup

1. Clone this repository:

   ```bash
   git clone https://github.com/<your-team>/will-it-rain.git
   cd will-it-rain
   ```

2. Follow frontend and backend setup instructions in their respective directories.

### Frontend Setup (webapp/)

```bash
cd webapp
pnpm install
pnpm run dev
```

### Backend Setup (api/)

```bash
cd api
pip install -r requirements.txt
fastapi dev main.py
```

---

## 🌐 Live Demo

Try the application at: <https://getmyweather.info>

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🏆 NASA Space Apps Challenge 2025

Built for the NASA Space Apps Challenge 2025 by Team: Lovelace Fanbase
