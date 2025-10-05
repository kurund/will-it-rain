export interface SearchHistoryItem {
	id: string;
	location: string;
	date: string;
	timestamp: number;
	weatherResult?: any; // Store the entire transformedWeather object
	coordinates?: { lat: number; lng: number }; // Store coordinates to avoid geocoding calls
}

const STORAGE_KEY = 'weather_search_history';

export function getSearchHistory(): SearchHistoryItem[] {
	if (typeof window === 'undefined') return [];

	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		return stored ? JSON.parse(stored) : [];
	} catch (error) {
		console.error('Error reading search history:', error);
		return [];
	}
}

export function addSearchToHistory(
	location: string,
	date: string,
	weatherResult?: any,
	coordinates?: { lat: number; lng: number }
): string {
	if (typeof window === 'undefined') return '';

	const id = `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
	const newSearch: SearchHistoryItem = {
		id,
		location,
		date,
		timestamp: Date.now(),
		...(weatherResult && { weatherResult }),
		...(coordinates && { coordinates })
	};

	try {
		const history = getSearchHistory();
		// Add to beginning of array (most recent first)
		history.unshift(newSearch);
		// Keep only last 20 searches
		const trimmedHistory = history.slice(0, 20);
		localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedHistory));
		return id;
	} catch (error) {
		console.error('Error saving search history:', error);
		return '';
	}
}

export function deleteSearchFromHistory(id: string) {
	if (typeof window === 'undefined') return;

	try {
		const history = getSearchHistory();
		const filteredHistory = history.filter((item) => item.id !== id);
		localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredHistory));
	} catch (error) {
		console.error('Error deleting search from history:', error);
	}
}

export function clearSearchHistory() {
	if (typeof window === 'undefined') return;

	try {
		localStorage.removeItem(STORAGE_KEY);
	} catch (error) {
		console.error('Error clearing search history:', error);
	}
}
