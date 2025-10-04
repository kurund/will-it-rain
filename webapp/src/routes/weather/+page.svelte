<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	$: location = $page.url.searchParams.get('location') || '';
	$: date = $page.url.searchParams.get('date') || '';

	function goBack() {
		goto('/');
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
</script>

<div class="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 p-4">
	<div class="mx-auto max-w-4xl">
		<div class="rounded-lg bg-white p-8 shadow-xl">
			<div class="mb-8 flex items-center justify-between">
				<button
					on:click={goBack}
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
				<h1 class="text-2xl font-bold text-gray-800">Weather Forecast</h1>
			</div>

			{#if location && date}
				<div class="mb-8 text-center">
					<h2 class="mb-2 text-xl font-semibold text-gray-800">{location}</h2>
					<p class="text-gray-600">{formatDate(date)}</p>
				</div>

				<div class="rounded-lg bg-gray-50 p-6 text-center">
					<div class="mb-4 text-6xl">🌤️</div>
					<h3 class="mb-2 text-xl font-semibold text-gray-800">Weather data coming soon!</h3>
					<p class="mb-4 text-gray-600">
						We're working on integrating weather API to show you the forecast for {location} on {formatDate(
							date
						)}.
					</p>
					<div class="rounded-lg border border-blue-300 bg-blue-100 p-4">
						<p class="text-sm text-blue-800">
							<strong>Query parameters:</strong><br />
							Location: {location}<br />
							Date: {date}
						</p>
					</div>
				</div>
			{:else}
				<div class="text-center">
					<div class="mb-4 text-6xl">❓</div>
					<h3 class="mb-2 text-xl font-semibold text-gray-800">Missing information</h3>
					<p class="mb-4 text-gray-600">
						Please provide both location and date to check the weather.
					</p>
					<button
						on:click={goBack}
						class="rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
					>
						Go back to search
					</button>
				</div>
			{/if}
		</div>
	</div>
</div>

