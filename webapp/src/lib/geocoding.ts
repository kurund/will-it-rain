export interface GeoLocation {
	lat: number;
	lng: number;
	name: string;
	country?: string;
}

// Cache for geocoding results to avoid repeated API calls
const geocodingCache = typeof window !== 'undefined' ? new Map<string, GeoLocation>() : null;

export async function geocodeLocation(locationName: string): Promise<GeoLocation | null> {
	// Only run on client side
	if (typeof window === 'undefined') {
		return null;
	}

	// Check cache first
	const cacheKey = locationName.toLowerCase().trim();
	if (geocodingCache && geocodingCache.has(cacheKey)) {
		return geocodingCache.get(cacheKey)!;
	}

	try {
		// Use OpenStreetMap Nominatim API (free, no API key required)
		const encodedLocation = encodeURIComponent(locationName);
		const response = await fetch(
			`https://nominatim.openstreetmap.org/search?q=${encodedLocation}&format=json&limit=1&addressdetails=1`,
			{
				headers: {
					'User-Agent': 'Will-It-Rain-App/1.0'
				}
			}
		);

		if (!response.ok) {
			throw new Error(`Geocoding failed: ${response.status}`);
		}

		const data = await response.json();

		if (!data || data.length === 0) {
			console.warn(`No geocoding results found for: ${locationName}`);
			return null;
		}

		const result = data[0];
		const geoLocation: GeoLocation = {
			lat: parseFloat(result.lat),
			lng: parseFloat(result.lon),
			name: result.display_name?.split(',')[0] || locationName,
			country: result.address?.country
		};

		// Cache the result
		if (geocodingCache) {
			geocodingCache.set(cacheKey, geoLocation);
		}

		return geoLocation;
	} catch (error) {
		console.error('Geocoding error:', error);
		return null;
	}
}

// Fallback coordinates for major cities (in case geocoding fails)
const FALLBACK_LOCATIONS: Record<string, GeoLocation> = {
	'new york': { lat: 40.7128, lng: -74.006, name: 'New York City' },
	london: { lat: 51.5074, lng: -0.1278, name: 'London' },
	paris: { lat: 48.8566, lng: 2.3522, name: 'Paris' },
	tokyo: { lat: 35.6762, lng: 139.6503, name: 'Tokyo' },
	sydney: { lat: -33.8688, lng: 151.2093, name: 'Sydney' },
	mumbai: { lat: 19.076, lng: 72.8777, name: 'Mumbai' },
	toronto: { lat: 43.6532, lng: -79.3832, name: 'Toronto' },
	berlin: { lat: 52.52, lng: 13.405, name: 'Berlin' },
	moscow: { lat: 55.7558, lng: 37.6173, name: 'Moscow' },
	cairo: { lat: 30.0444, lng: 31.2357, name: 'Cairo' }
};

export function getFallbackLocation(locationName: string): GeoLocation | null {
	const key = locationName.toLowerCase().trim();
	return FALLBACK_LOCATIONS[key] || null;
}

export async function geocodeWithFallback(locationName: string): Promise<GeoLocation | null> {
	// Try geocoding first
	const result = await geocodeLocation(locationName);
	if (result) {
		return result;
	}

	// Try fallback locations
	const fallback = getFallbackLocation(locationName);
	if (fallback) {
		console.log(`Using fallback coordinates for: ${locationName}`);
		return fallback;
	}

	console.warn(`No coordinates found for: ${locationName}`);
	return null;
}
