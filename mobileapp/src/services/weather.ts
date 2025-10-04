import { API_URL } from "react-native-dotenv";

export const getWeather = async (location: string, date: string) => {
    const response = await fetch(
        `${API_URL}/weather?location=${encodeURIComponent(location)}&date=${date}`
    );
    if (!response.ok) {
        throw new Error(`Failed to fetch weather data: ${response.status}`);
    }

    return await response.json();
}