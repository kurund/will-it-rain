<script lang="ts">
	import { goto } from '$app/navigation';
	import {
		getSearchHistory,
		clearSearchHistory,
		deleteSearchFromHistory,
		type SearchHistoryItem
	} from '$lib/searchHistory';

	let searchHistory = $state<SearchHistoryItem[]>([]);

	// Load search history on component mount
	$effect(() => {
		searchHistory = getSearchHistory();
	});

	function goBack() {
		goto('/');
	}

	function viewWeather(item: SearchHistoryItem) {
		const params = new URLSearchParams({
			location: item.location,
			date: item.date,
			searchId: item.id
		});
		goto(`/weather?${params.toString()}`);
	}

	function deleteItem(item: SearchHistoryItem, event: Event) {
		event.stopPropagation(); // Prevent triggering the view weather action
		if (confirm(`Delete search for ${item.location}?`)) {
			deleteSearchFromHistory(item.id);
			searchHistory = getSearchHistory();
		}
	}

	function clearHistory() {
		if (confirm('Are you sure you want to clear all search history?')) {
			clearSearchHistory();
			searchHistory = [];
		}
	}

	function formatDate(dateString: string) {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	}

	function formatTimestamp(timestamp: number) {
		const date = new Date(timestamp);
		return date.toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			hour: 'numeric',
			minute: '2-digit'
		});
	}

	function getWeatherEmoji(weather?: string) {
		if (!weather) return '🌤️';
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
</script>

<div class="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 p-4">
	<div class="mx-auto max-w-4xl">
		<div class="rounded-lg bg-white p-8 shadow-xl">
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
					Back to search
				</button>
				<h1 class="text-2xl font-bold text-gray-800">Search History</h1>
				{#if searchHistory.length > 0}
					<button onclick={clearHistory} class="text-red-600 transition-colors hover:text-red-800">
						Clear All
					</button>
				{/if}
			</div>

			{#if searchHistory.length === 0}
				<div class="py-12 text-center">
					<div class="mb-4 text-6xl">📈</div>
					<h3 class="mb-2 text-xl font-semibold text-gray-800">No search history yet</h3>
					<p class="mb-6 text-gray-600">
						Start planning your trips to see your search history here!
					</p>
					<button
						onclick={goBack}
						class="rounded-md bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700"
					>
						Plan Your First Trip
					</button>
				</div>
			{:else}
				<div class="space-y-4">
					{#each searchHistory as item (item.id)}
						<div
							class="group rounded-lg border border-gray-200 transition-all hover:border-blue-300 hover:shadow-md"
						>
							<div class="flex items-center">
								<button
									class="flex-1 cursor-pointer p-4 text-left"
									onclick={() => viewWeather(item)}
								>
									<div class="flex items-center gap-3">
										<div class="text-2xl">
											{#if item.weatherResult}
												{getWeatherEmoji(item.weatherResult.summary?.weather)}
											{:else}
												🌤️
											{/if}
										</div>
										<div class="flex-1">
											<h3 class="font-semibold text-gray-800">{item.location}</h3>
											<p class="text-sm text-gray-600">
												Travel date: {formatDate(item.date)}
											</p>
											{#if item.weatherResult}
												<p class="text-sm font-medium text-blue-600">
													Rain probability: {item.weatherResult.forecast?.rain?.probability}%
												</p>
											{/if}
										</div>
									</div>
								</button>
								<div class="flex items-center gap-2 pr-4">
									<div class="text-right">
										<p class="text-xs text-gray-500">
											Searched {formatTimestamp(item.timestamp)}
										</p>
									</div>
									<button
										onclick={(e) => deleteItem(item, e)}
										class="shake-on-hover rounded p-1 text-gray-400 transition-colors hover:bg-red-100 hover:text-red-600"
										title="Delete this search"
									>
										<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
											></path>
										</svg>
									</button>
									<svg
										class="h-5 w-5 text-gray-400 transition-colors group-hover:text-blue-600"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M9 5l7 7-7 7"
										></path>
									</svg>
								</div>
							</div>
						</div>
					{/each}
				</div>

				<div class="mt-8 rounded-lg border border-blue-300 bg-blue-100 p-4">
					<p class="text-sm text-blue-800">
						<strong>📊 Dashboard Stats:</strong>
						You've searched for weather in {searchHistory.length} location{searchHistory.length ===
						1
							? ''
							: 's'}. Keep planning those amazing trips! ✈️
					</p>
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	@keyframes shake {
		0%,
		100% {
			transform: translateX(0) scale(1);
		}
		25% {
			transform: translateX(-2px) scale(0.95);
		}
		75% {
			transform: translateX(2px) scale(0.95);
		}
	}

	.shake-on-hover:hover {
		animation: shake 0.3s ease-in-out;
	}
</style>
