<script lang="ts">
	import { goto } from '$app/navigation';
	import { getSearchHistory } from '$lib/searchHistory';
	import { geocodeWithFallback, type GeoLocation } from '$lib/geocoding';
	import Globe from '$lib/components/Globe.svelte';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	let location = $state(data.location);
	let date = $state(data.date);
	let searchId = data.searchId;

	let weatherCondition: any = $state();
	let currentWeather: any = $state();
	let loading = $state(false);
	let loadingCurrent = $state(false);
	let error = $state('');
	let geoLocation = $state<GeoLocation | null>(null);
	let showGlobe = $state(!searchId); // Don't show globe if coming from history
	let showWeatherData = $state(false);
	let showWeatherDetails = $state(false);

	function goBack() {
		// If we came from search history, go back to dashboard
		if (searchId) {
			goto('/dashboard');
		} else {
			goto('/');
		}
	}

	// Format date for display
	function formatDate(dateString: string) {
		if (!dateString) return '';
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	// Get weather emoji based on weather condition
	function getWeatherEmoji(weather: string) {
		const weatherMap: Record<string, string> = {
			sunny: '☀️',
			cloudy: '☁️',
			rainy: '🌧️',
			stormy: '⛈️',
			snowy: '❄️',
			foggy: '🌫️',
			windy: '💨',
			partly_cloudy: '⛅',
			overcast: '☁️'
		};
		return weatherMap[weather?.toLowerCase()] || '🌤️';
	}

	// Map Open-Meteo weather codes to our conditions
	function mapWeatherCode(code: number): string {
		if (code === 0) return 'sunny';
		if (code <= 3) return 'partly_cloudy';
		if (code <= 48) return 'foggy';
		if (code <= 57) return 'rainy';
		if (code <= 67) return 'rainy';
		if (code <= 77) return 'snowy';
		if (code <= 82) return 'rainy';
		if (code <= 86) return 'snowy';
		if (code <= 99) return 'stormy';
		return 'cloudy';
	}

	// Get weather description from code
	function getWeatherDescription(code: number): string {
		const descriptions: Record<number, string> = {
			0: 'Clear sky',
			1: 'Mainly clear',
			2: 'Partly cloudy',
			3: 'Overcast',
			45: 'Fog',
			48: 'Depositing rime fog',
			51: 'Light drizzle',
			53: 'Moderate drizzle',
			55: 'Dense drizzle',
			56: 'Light freezing drizzle',
			57: 'Dense freezing drizzle',
			61: 'Slight rain',
			63: 'Moderate rain',
			65: 'Heavy rain',
			66: 'Light freezing rain',
			67: 'Heavy freezing rain',
			71: 'Slight snow fall',
			73: 'Moderate snow fall',
			75: 'Heavy snow fall',
			77: 'Snow grains',
			80: 'Slight rain showers',
			81: 'Moderate rain showers',
			82: 'Violent rain showers',
			85: 'Slight snow showers',
			86: 'Heavy snow showers',
			95: 'Thunderstorm',
			96: 'Thunderstorm with slight hail',
			99: 'Thunderstorm with heavy hail'
		};
		return descriptions[code] || 'Unknown conditions';
	}

	async function fetchWeatherData(location: string, date: string) {
		if (!location || !date) return;

		loading = true;
		error = '';

		try {
			const backendUrl = import.meta.env.VITE_BACKEND_URL;
			const response = await fetch(
				`${backendUrl}/weather?location=${encodeURIComponent(location)}&date=${date}`
			);

			if (!response.ok) {
				throw new Error(`Failed to fetch weather data: ${response.status}`);
			}

			const data = await response.json();
			weatherCondition = data;
		} catch (err) {
			console.error('Error fetching weather data:', err);
			error = err instanceof Error ? err.message : 'Failed to fetch weather data';
			// Fallback to placeholder data
			weatherCondition = {
				condition: '🌤️',
				description: 'Weather data temporarily unavailable',
				temperature: '--°C'
			};
		} finally {
			loading = false;
		}
	}

	async function fetchCurrentWeather(location: string) {
		if (!location) return;

		loadingCurrent = true;

		try {
			// Get coordinates for the location
			const coords = await geocodeWithFallback(location);
			if (!coords) {
				throw new Error('Could not find coordinates for location');
			}

			// Use Open-Meteo API for current weather
			const currentUrl = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lng}&current=temperature_2m,weather_code&timezone=auto`;

			const response = await fetch(currentUrl);
			if (!response.ok) {
				throw new Error(`Current weather API error: ${response.status}`);
			}

			const data = await response.json();

			if (!data.current) {
				throw new Error('No current weather data available');
			}

			const weatherCode = data.current.weather_code;
			const temperature = Math.round(data.current.temperature_2m);

			currentWeather = {
				condition: mapWeatherCode(weatherCode),
				temperature: `${temperature}°C`,
				description: getWeatherDescription(weatherCode)
			};
		} catch (err) {
			console.error('Error fetching current weather:', err);
			// Fallback to placeholder data
			currentWeather = {
				condition: 'partly_cloudy',
				temperature: '--°C',
				description: 'Current weather temporarily unavailable'
			};
		} finally {
			loadingCurrent = false;
		}
	}

	$effect(() => {
		if (location && date) {
			initializeWeatherFlow();
		}
	});

	async function initializeWeatherFlow() {
		// If we have a searchId, try to load from history first
		if (searchId) {
			const history = getSearchHistory();
			const existingSearch = history.find((item) => item.id === searchId);

			if (existingSearch) {
				// We have a search in history - skip globe and show weather details
				showWeatherData = true;
				showWeatherDetails = true;

				if (existingSearch.weatherResult) {
					// Use cached weather data
					weatherCondition = {
						weather: existingSearch.weatherResult.weather,
						probability: existingSearch.weatherResult.probability,
						date: existingSearch.weatherResult.date
					};
				} else {
					// Fetch fresh weather data
					await fetchWeatherData(location, date);
				}
				// Also fetch current weather as additional info
				fetchCurrentWeather(location);
				return;
			}
		}

		// For new searches, get coordinates for the globe animation
		if (typeof window !== 'undefined') {
			try {
				geoLocation = await geocodeWithFallback(location);
			} catch (err) {
				console.warn('Failed to geocode location:', err);
			}
		}
	}

	function onGlobeLocationReached() {
		// Show weather overlay first
		showWeatherData = true;

		// Then fade in details after a delay
		setTimeout(() => {
			showWeatherDetails = true;
		}, 500);

		// If we don't have weather data yet, fetch it now
		if (!weatherCondition) {
			fetchWeatherData(location, date);
		}
		// Also fetch current weather as additional info
		fetchCurrentWeather(location);
	}

	// Add a fallback timeout in case globe callback doesn't fire
	$effect(() => {
		if (geoLocation && showGlobe) {
			// Fallback: if globe doesn't complete in 10 seconds, proceed anyway
			const fallbackTimer = setTimeout(() => {
				onGlobeLocationReached();
			}, 10000);

			return () => clearTimeout(fallbackTimer);
		}
	});
</script>

<div class="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 p-4">
	<div class="relative mx-auto max-w-4xl">
		<!-- Back Navigation -->
		{#if !showWeatherData}
			<div class="relative z-20 mb-4 flex justify-between">
				<button
					onclick={goBack}
					class="flex items-center text-white/80 transition-colors hover:text-white"
				>
					<svg class="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M10 19l-7-7m0 0l7-7m-7 7h18"
						></path>
					</svg>
					{searchId ? 'Back to history' : 'Back to search'}
				</button>
			</div>
		{/if}

		<!-- Globe Background (Always Visible) -->
		{#if showGlobe}
			<div
				class="absolute inset-0 transition-opacity duration-1000 ease-out {showGlobe
					? 'opacity-100'
					: 'opacity-0'}"
			>
				<div class="relative h-[90vh] w-full">
					{#if !showWeatherData}
						<div class="absolute top-1/3 left-1/2 z-10 -translate-x-1/2 transform text-center">
							<h1 class="mb-2 text-3xl font-bold text-white">Locating {location}</h1>
							<p class="mb-4 text-white/80">Zooming to your destination...</p>
						</div>
					{/if}

					{#if geoLocation}
						<Globe targetLocation={geoLocation} onLocationReached={onGlobeLocationReached} />
					{:else}
						<div class="flex h-full items-center justify-center">
							<div class="text-center text-white">
								<div class="mb-4 animate-spin text-6xl">🌍</div>
								<p>Finding location coordinates...</p>
							</div>
						</div>
					{/if}
				</div>
			</div>
		{/if}

		<!-- Weather Data Overlay -->
		{#if showWeatherData}
			<div
				class="relative z-10 transition-all duration-1000 ease-in {showWeatherData
					? 'translate-y-0 opacity-100'
					: 'translate-y-4 opacity-0'}"
			>
				<div class="rounded-lg border border-white/20 bg-white/90 p-8 shadow-xl backdrop-blur-md">
					<div class="mb-8 flex items-center justify-between">
						<button
							onclick={goBack}
							class="flex items-center text-blue-600 transition-colors hover:text-blue-800"
						>
							<svg class="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M10 19l-7-7m0 0l7-7m-7 7h18"
								></path>
							</svg>
							{searchId ? 'Back to history' : 'Back to search'}
						</button>
						<h1 class="text-2xl font-bold text-gray-800">Weather Forecast</h1>
					</div>

					{#if showWeatherDetails}
						<div
							class="transition-all duration-1200 ease-out {showWeatherDetails
								? 'translate-y-0 scale-100 opacity-100'
								: 'translate-y-4 scale-95 opacity-0'}"
						>
							<div class="animate-fade-in mb-8 text-center" style="animation-delay: 200ms;">
								<h2 class="mb-2 text-xl font-semibold text-gray-800">{location}</h2>
								<p class="text-gray-600">{formatDate(date)}</p>
							</div>

							<div
								class="animate-fade-in rounded-lg bg-gray-50 p-6 text-center"
								style="animation-delay: 400ms;"
							>
								{#if loading}
									<div class="mb-4 animate-spin text-6xl">🌀</div>
									<h3 class="mb-2 text-xl font-semibold text-gray-800">Loading weather data...</h3>
									<p class="text-gray-600">
										Please wait while we fetch the forecast for {location}
									</p>
								{:else if error}
									<div class="mb-4 text-6xl">⚠️</div>
									<h3 class="mb-2 text-xl font-semibold text-red-600">
										Unable to load weather data
									</h3>
									<p class="mb-4 text-gray-600">{error}</p>
									<button
										onclick={() => fetchWeatherData(location, date)}
										class="rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
									>
										Try Again
									</button>
								{:else if weatherCondition}
									<div class="mb-4 text-6xl">
										{getWeatherEmoji(weatherCondition.weather)}
									</div>
									<h3 class="mb-2 text-xl font-semibold text-gray-800 capitalize">
										{weatherCondition.weather} Weather
									</h3>
									<p class="mb-4 text-2xl font-bold text-blue-600">
										Rain Probability: {weatherCondition.probability}%
									</p>
								{:else}
									<div class="mb-4 text-6xl">⏳</div>
									<h3 class="mb-2 text-xl font-semibold text-gray-800">
										Preparing weather data...
									</h3>
									<p class="mb-4 text-gray-600">
										We're working on integrating weather API to show you the forecast for {location}
										on {formatDate(date)}.
									</p>
								{/if}
							</div>

							<!-- Current Weather Section -->
							<div
								class="animate-fade-in mt-6 rounded-lg border border-green-300 bg-green-50 p-4"
								style="animation-delay: 600ms;"
							>
								<h4 class="mb-3 text-lg font-semibold text-green-800">Current Weather</h4>
								{#if loadingCurrent}
									<div class="flex items-center justify-center py-4">
										<div class="mr-3 animate-spin text-2xl">🌀</div>
										<span class="text-green-700">Loading current conditions...</span>
									</div>
								{:else if currentWeather}
									<div class="flex items-center justify-between">
										<div class="flex items-center">
											<div class="mr-3 text-3xl">{getWeatherEmoji(currentWeather.condition)}</div>
											<div>
												<p class="font-medium text-green-800 capitalize">
													{currentWeather.condition?.replace('_', ' ')}
												</p>
												<p class="text-sm text-green-600">
													{currentWeather.description || 'Current conditions'}
												</p>
											</div>
										</div>
										<div class="text-right">
											<p class="text-2xl font-bold text-green-800">
												{currentWeather.temperature || '--°C'}
											</p>
											<p class="text-xs text-green-600">Now</p>
										</div>
									</div>
								{:else}
									<div class="py-2 text-center text-green-600">
										<p class="text-sm">Current weather data will be available soon</p>
									</div>
								{/if}
							</div>
						</div>
					{/if}
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	@keyframes fade-in {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.animate-fade-in {
		animation: fade-in 0.8s ease-out forwards;
		opacity: 0;
	}
</style>
