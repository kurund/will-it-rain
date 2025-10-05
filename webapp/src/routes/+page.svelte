<script lang="ts">
	import logo from '$lib/assets/clear-logo.gif';
	import { goto } from '$app/navigation';
	import { addSearchToHistory } from '$lib/searchHistory';

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
			// Save to search history
			addSearchToHistory(location.trim(), date);

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
		location = `${selectedLocation.location_name}`;
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
</script>

<div
	class="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-blue-400 via-purple-500 to-blue-600 p-4"
>
	<!-- Floating background elements -->
	<div class="pointer-events-none absolute inset-0 overflow-hidden">
		<!-- Floating travel icons -->
		<div
			class="absolute top-20 left-10 text-6xl opacity-20 {floatingClouds ? 'animate-bounce' : ''}"
			style="animation-delay: 0s;"
		>
			✈️
		</div>
		<div
			class="absolute top-32 right-20 text-4xl opacity-30 {floatingClouds ? 'animate-pulse' : ''}"
			style="animation-delay: 1s;"
		>
			🏖️
		</div>
		<div
			class="absolute bottom-40 left-20 text-5xl opacity-25 {floatingClouds
				? 'animate-bounce'
				: ''}"
			style="animation-delay: 2s;"
		>
			🗺️
		</div>
		<div
			class="absolute top-60 right-10 text-3xl opacity-20 {floatingClouds ? 'animate-pulse' : ''}"
			style="animation-delay: 0.5s;"
		>
			🧳
		</div>
		<div
			class="absolute right-32 bottom-20 text-4xl opacity-25 {floatingClouds
				? 'animate-bounce'
				: ''}"
			style="animation-delay: 3s;"
		>
			🏔️
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
			<!-- Dashboard link -->
			<div class="mb-4 flex justify-end">
				<button
					onclick={() => goto('/dashboard')}
					class="flex items-center text-gray-600 transition-colors hover:text-blue-600"
				>
					<svg class="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
						></path>
					</svg>
					My Searches
				</button>
			</div>

			<!-- Logo -->
			<div class="mb-4 flex justify-center">
				<div class="overflow-hidden" style="height: 180px; width: 300px;">
					<img
						width="300"
						alt="The project logo"
						src={logo}
						style="margin-top: -80px; margin-bottom: -80px;"
					/>
				</div>
			</div>

			<h1
				class="mb-3 animate-pulse bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-4xl font-bold text-transparent"
			>
				Will It Rain?
			</h1>
			<p class="text-lg text-gray-600">Plan your perfect vacation with confidence ✈️</p>
			<p class="mt-1 text-sm text-gray-500">Check weather forecasts for your travel destination</p>
		</div>

		<form onsubmit={handleSubmit} class="space-y-6">
			<div class="group relative">
				<label
					for="location"
					class="mb-2 block text-sm font-semibold text-gray-700 transition-colors group-focus-within:text-blue-600"
				>
					🌍 Travel Destination
				</label>
				<input
					type="text"
					id="location"
					bind:value={searchTerm}
					oninput={handleSearchInput}
					onfocus={() => (showDropdown = searchTerm.length > 0)}
					onblur={() => setTimeout(() => (showDropdown = false), 200)}
					placeholder="Where are you planning to go?"
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
					🗓️ Travel Date
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
				<span class="flex items-center justify-center"> ✈️ Plan My Trip </span>
			</button>
		</form>
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
