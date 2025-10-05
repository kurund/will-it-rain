<script lang="ts">
	import { goto } from '$app/navigation';
	import { getSearchHistory, addSearchToHistory } from '$lib/searchHistory';
	import { geocodeWithFallback, type GeoLocation } from '$lib/geocoding';
	import { transformWeatherData, type TransformedWeatherData } from '$lib/weatherTransform';
	import Globe from '$lib/components/Globe.svelte';
	import CSSParticles from '$lib/components/CSSParticles.svelte';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	let location = $state(data.location);
	let date = $state(data.date);
	let searchId = data.searchId;

	let transformedWeather: TransformedWeatherData | null = $state(null);
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
			// Parse location to get city and country
			let city = location;
			let country = location;

			if (location.includes(', ')) {
				const parts = location.split(', ');
				city = parts[0];
				country = parts[1];
			} else {
				// Fallback: load locations data to find country
				const locationsResponse = await fetch('/data/locations.json');
				const locationsData = await locationsResponse.json();

				const locationEntry = locationsData.find(
					(entry: any) => entry.location_name.toLowerCase() === location.toLowerCase()
				);

				if (locationEntry) {
					city = locationEntry.location_name;
					country = locationEntry.country;
				}
			}

			const backendUrl = import.meta.env.VITE_BACKEND_URL;
			const response = await fetch(
				`${backendUrl}/weather?location=${encodeURIComponent(country)}&date=${date}`
			);

			if (!response.ok) {
				throw new Error(`Failed to fetch weather data: ${response.status}`);
			}

			const data = await response.json();
			transformedWeather = transformWeatherData(data);

			// Save weather result to search history (only for new searches, not from history)
			if (!searchId && transformedWeather && geoLocation) {
				addSearchToHistory(location, date, transformedWeather, geoLocation);
			}
		} catch (err) {
			console.error('Error fetching weather data:', err);
			error = err instanceof Error ? err.message : 'Failed to fetch weather data';
			// Reset on error
			transformedWeather = null;
		} finally {
			loading = false;
		}
	}

	async function fetchCurrentWeather(location: string, coordinates?: { lat: number; lng: number }) {
		if (!location) return;

		loadingCurrent = true;

		try {
			let coords = coordinates;

			// Get coordinates only if not provided (for new searches)
			if (!coords) {
				coords = await geocodeWithFallback(location);
				if (!coords) {
					throw new Error('Could not find coordinates for location');
				}
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
					// Use cached weather data from localStorage
					transformedWeather = existingSearch.weatherResult;
				} else {
					// Fetch fresh weather data if not cached
					await fetchWeatherData(location, date);
				}
				// Fetch current weather using stored coordinates (no geocoding needed)
				if (existingSearch.coordinates) {
					fetchCurrentWeather(location, existingSearch.coordinates);
				}
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
		if (!transformedWeather) {
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

<div
	class="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 p-4"
>
	<!-- Weather & Air Quality Effects -->

	<CSSParticles
		weatherCondition={transformedWeather?.summary.weather}
		airQuality={transformedWeather?.airQuality.level.toLowerCase()}
	/>

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
								{:else if transformedWeather}
									<div class="mb-4 text-6xl">
										{transformedWeather.summary.emoji}
									</div>
									<h3 class="mb-2 text-xl font-semibold text-gray-800">
										{transformedWeather.summary.condition}
									</h3>
									<p class="mb-6 text-sm text-gray-600 italic">
										{transformedWeather.summary.headline}
									</p>

									<!-- Detailed Weather Information -->
									<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
										<!-- Temperature Details -->
										<div class="rounded-lg bg-white p-4 shadow-sm">
											<h4 class="mb-3 flex items-center text-lg font-semibold text-gray-800">
												🌡️ Temperature
											</h4>
											<div class="space-y-2 text-sm">
												<div class="flex justify-between">
													<span class="text-gray-600">Predicted:</span>
													<span class="font-medium"
														>{transformedWeather.forecast.temperature.predicted}°C</span
													>
												</div>
												<div class="flex justify-between">
													<span class="text-gray-600">Feels like:</span>
													<span class="font-medium"
														>{transformedWeather.forecast.temperature.feelsLike}°C</span
													>
												</div>
												<div class="flex justify-between">
													<span class="text-gray-600">Likely range:</span>
													<span class="font-medium">
														{transformedWeather.forecast.temperature.range.likely.min}°C - {transformedWeather
															.forecast.temperature.range.likely.max}°C
													</span>
												</div>
											</div>
										</div>

										<!-- Rain Details -->
										<div class="rounded-lg bg-white p-4 shadow-sm">
											<h4 class="mb-3 flex items-center text-lg font-semibold text-gray-800">
												🌧️ Precipitation
											</h4>
											<div class="space-y-2 text-sm">
												<div class="flex justify-between">
													<span class="text-gray-600">Probability:</span>
													<span class="font-medium"
														>{transformedWeather.forecast.rain.probability}%</span
													>
												</div>
												<div class="flex justify-between">
													<span class="text-gray-600">Expected amount:</span>
													<span class="font-medium"
														>{transformedWeather.forecast.rain.expectedAmount}mm</span
													>
												</div>
												<p class="mt-2 text-xs text-gray-500 italic">
													{transformedWeather.forecast.rain.description}
												</p>
											</div>
										</div>

										<!-- Wind Details -->
										<div class="rounded-lg bg-white p-4 shadow-sm">
											<h4 class="mb-3 flex items-center text-lg font-semibold text-gray-800">
												💨 Wind Conditions
											</h4>
											<div class="space-y-2 text-sm">
												<div class="flex justify-between">
													<span class="text-gray-600">Speed:</span>
													<span class="font-medium"
														>{transformedWeather.forecast.wind.speed} km/h</span
													>
												</div>
												{#each transformedWeather.forecast.wind.conditions as windCondition}
													<div class="flex justify-between">
														<span class="text-gray-600">{windCondition.type}:</span>
														<span class="font-medium">{windCondition.probability}%</span>
													</div>
												{/each}
												<p class="mt-2 text-xs text-gray-500 italic">
													{transformedWeather.forecast.wind.description}
												</p>
											</div>
										</div>

										<!-- Air Quality Details -->
										<div class="rounded-lg bg-white p-4 shadow-sm">
											<h4 class="mb-3 flex items-center text-lg font-semibold text-gray-800">
												🌫️ Air Pollution
											</h4>
											<div class="space-y-2 text-sm">
												<div class="flex justify-between">
													<span class="text-gray-600">Index:</span>
													<span class="font-medium">{transformedWeather.airQuality.index}</span>
												</div>
												<div class="flex justify-between">
													<span class="text-gray-600">Level:</span>
													<span
														class="font-medium {transformedWeather.airQuality.level === 'Low'
															? 'text-green-600'
															: transformedWeather.airQuality.level === 'Moderate'
																? 'text-yellow-600'
																: transformedWeather.airQuality.level === 'High'
																	? 'text-orange-600'
																	: 'text-red-600'}"
													>
														{transformedWeather.airQuality.level}
													</span>
												</div>
												<p class="mt-2 text-xs text-gray-500 italic">
													{transformedWeather.airQuality.description}
												</p>
											</div>
										</div>

										<!-- Cloud Coverage Details -->
										<div class="rounded-lg bg-white p-4 shadow-sm">
											<h4 class="mb-3 flex items-center text-lg font-semibold text-gray-800">
												☁️ Cloud Coverage
											</h4>
											<div class="space-y-2 text-sm">
												<div class="flex justify-between">
													<span class="text-gray-600">Coverage:</span>
													<span class="font-medium"
														>{transformedWeather.forecast.clouds.coverage}%</span
													>
												</div>
												<p class="mt-2 text-xs text-gray-500 italic">
													{transformedWeather.forecast.clouds.description}
												</p>
											</div>
										</div>
									</div>
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
