<script lang="ts">
	import { goto } from '$app/navigation';

	let location = $state('');
	let date = $state('');
	let isLoaded = $state(false);
	let floatingClouds = $state(false);
	let locations = $state<Array<{ country: string; location_name: string }>>([]);
	let filteredLocations = $state<Array<{ country: string; location_name: string }>>([]);
	let searchTerm = $state('');
	let showDropdown = $state(false);

	function handleSubmit(event: Event) {
		event.preventDefault();

		if (location.trim() && date) {
			const params = new URLSearchParams({
				location: location.trim(),
				date
			});
			goto(`/weather?${params.toString()}`);
		}
	}

	// Set default date to today
	const today = new Date().toISOString().split('T')[0];
	date = today;

	// Load locations data
	async function loadLocations() {
		try {
			const response = await fetch('/data/locations.json');
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			locations = await response.json();
			filteredLocations = locations;
			console.log('Loaded locations:', locations.length, 'items');
		} catch (error) {
			console.error('Failed to load locations:', error);
		}
	}

	// Filter locations based on search term
	function filterLocations(search: string) {
		if (!search.trim()) {
			filteredLocations = locations;
			return;
		}

		const searchLower = search.toLowerCase();
		filteredLocations = locations.filter(
			(loc) =>
				loc.location_name.toLowerCase().includes(searchLower) ||
				loc.country.toLowerCase().includes(searchLower)
		);
	}

	// Handle location selection
	function selectLocation(selectedLocation: { country: string; location_name: string }) {
		location = `${selectedLocation.location_name}, ${selectedLocation.country}`;
		searchTerm = location;
		showDropdown = false;
	}

	// Handle search input
	function handleSearchInput(event: Event) {
		const target = event.target as HTMLInputElement;
		searchTerm = target.value;
		location = searchTerm;
		filterLocations(searchTerm);
		showDropdown = searchTerm.length > 0;
	}

	$effect(() => {
		isLoaded = true;
		loadLocations();
		setTimeout(() => {
			floatingClouds = true;
		}, 500);
	});

	// Weather emojis that change randomly
	const weatherEmojis = ['🌤️', '☀️', '⛅', '🌧️', '⛈️', '🌈', '❄️', '🌪️'];
	let currentEmoji = $state(weatherEmojis[0]);

	function rotateEmoji() {
		const randomIndex = Math.floor(Math.random() * weatherEmojis.length);
		currentEmoji = weatherEmojis[randomIndex];
	}

	// Auto-rotate emoji every 3 seconds
	$effect(() => {
		const interval = setInterval(rotateEmoji, 3000);
		return () => clearInterval(interval);
	});
</script>

<div
	class="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-blue-400 via-purple-500 to-blue-600 p-4"
>
	<!-- Floating background elements -->
	<div class="pointer-events-none absolute inset-0 overflow-hidden">
		<!-- Floating clouds -->
		<div
			class="absolute top-20 left-10 text-6xl opacity-20 {floatingClouds ? 'animate-bounce' : ''}"
			style="animation-delay: 0s;"
		>
			☁️
		</div>
		<div
			class="absolute top-32 right-20 text-4xl opacity-30 {floatingClouds ? 'animate-pulse' : ''}"
			style="animation-delay: 1s;"
		>
			⛅
		</div>
		<div
			class="absolute bottom-40 left-20 text-5xl opacity-25 {floatingClouds
				? 'animate-bounce'
				: ''}"
			style="animation-delay: 2s;"
		>
			🌤️
		</div>
		<div
			class="absolute top-60 right-10 text-3xl opacity-20 {floatingClouds ? 'animate-pulse' : ''}"
			style="animation-delay: 0.5s;"
		>
			☀️
		</div>

		<!-- Animated particles -->
		<div
			class="absolute top-1/4 left-1/3 h-2 w-2 animate-ping rounded-full bg-white opacity-60"
			style="animation-delay: 1s;"
		></div>
		<div
			class="absolute top-3/4 right-1/4 h-1 w-1 animate-ping rounded-full bg-yellow-200 opacity-80"
			style="animation-delay: 2s;"
		></div>
		<div
			class="absolute top-1/2 left-1/4 h-1.5 w-1.5 animate-ping rounded-full bg-white opacity-50"
			style="animation-delay: 3s;"
		></div>
	</div>

	<div
		class="w-full max-w-md transform rounded-2xl bg-white/95 p-8 shadow-2xl backdrop-blur-sm {isLoaded
			? 'scale-100 opacity-100'
			: 'scale-95 opacity-0'} transition-all duration-700 ease-out"
	>
		<div class="mb-8 text-center">
			<!-- Animated weather icon -->
			<div
				class="mb-4 transform cursor-pointer text-8xl transition-all duration-500 hover:scale-110"
				onclick={rotateEmoji}
				role="button"
				tabindex="0"
				onkeydown={(e) => e.key === 'Enter' && rotateEmoji()}
			>
				{currentEmoji}
			</div>

			<h1
				class="mb-3 animate-pulse bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-4xl font-bold text-transparent"
			>
				Will It Rain?
			</h1>
			<p class="text-lg text-gray-600">Discover the weather forecast for any location ✨</p>
		</div>

		<form onsubmit={handleSubmit} class="space-y-6">
			<div class="group relative">
				<label
					for="location"
					class="mb-2 block text-sm font-semibold text-gray-700 transition-colors group-focus-within:text-blue-600"
				>
					📍 Location
				</label>
				<input
					type="text"
					id="location"
					bind:value={searchTerm}
					oninput={handleSearchInput}
					onfocus={() => (showDropdown = searchTerm.length > 0)}
					onblur={() => setTimeout(() => (showDropdown = false), 200)}
					placeholder="Search for a city..."
					required
					class="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-lg shadow-sm transition-all duration-300 hover:border-blue-300 hover:shadow-md focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
					autocomplete="off"
				/>

				{#if showDropdown && filteredLocations.length > 0}
					<div
						class="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-lg"
					>
						{#each filteredLocations.slice(0, 10) as loc}
							<button
								type="button"
								onclick={() => selectLocation(loc)}
								class="w-full border-b border-gray-100 px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none"
							>
								<div class="font-medium text-gray-800">{loc.location_name}</div>
								<div class="text-sm text-gray-500">{loc.country}</div>
							</button>
						{/each}

						{#if filteredLocations.length > 10}
							<div class="border-t px-4 py-2 text-center text-sm text-gray-500">
								Showing first 10 results. Keep typing to narrow down...
							</div>
						{/if}
					</div>
				{/if}

				{#if showDropdown && filteredLocations.length === 0 && searchTerm.length > 0}
					<div
						class="absolute z-10 mt-1 w-full rounded-xl border border-gray-200 bg-white p-4 text-center text-gray-500 shadow-lg"
					>
						No locations found matching "{searchTerm}"
					</div>
				{/if}
			</div>

			<div class="group">
				<label
					for="date"
					class="mb-2 block text-sm font-semibold text-gray-700 transition-colors group-focus-within:text-blue-600"
				>
					📅 Date
				</label>
				<input
					type="date"
					id="date"
					bind:value={date}
					required
					class="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-lg shadow-sm transition-all duration-300 hover:border-blue-300 hover:shadow-md focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
				/>
			</div>

			<button
				type="submit"
				disabled={!location.trim() || !date}
				class="w-full transform rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 text-lg font-semibold text-white transition-all duration-300 hover:scale-105 hover:from-blue-700 hover:to-purple-700 hover:shadow-lg focus:ring-4 focus:ring-blue-300 focus:outline-none active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
			>
				<span class="flex items-center justify-center"> 🌦️ Check Weather </span>
			</button>
		</form>

		<!-- Fun fact section -->
		<div class="mt-8 rounded-xl border border-blue-100 bg-blue-50 p-4">
			<p class="text-center text-sm text-blue-800">
				💡 <strong>Fun fact:</strong> Click the weather icon above to see different weather types!
			</p>
		</div>
	</div>
</div>

<style>
	@keyframes float {
		0%,
		100% {
			transform: translateY(0px);
		}
		50% {
			transform: translateY(-20px);
		}
	}
</style>
