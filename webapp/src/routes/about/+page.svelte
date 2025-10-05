<script lang="ts">
	import { goto } from '$app/navigation';
	import logo from '$lib/assets/clear-logo.gif';
</script>

<div class="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-blue-600 p-4">
	<div class="mx-auto max-w-4xl">
		<div class="rounded-lg bg-white p-8 shadow-xl">
			<div class="mb-8">
				<button
					onclick={() => goto('/')}
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
					Back to home
				</button>
			</div>

			<div class="mb-12">
				<div class="mb-8 text-center">
					<!-- Logo -->
					<div class="mb-6 flex justify-center">
						<div class="overflow-hidden" style="height: 180px; width: 300px;">
							<img
								width="300"
								alt="Will It Rain? project logo"
								src={logo}
								style="margin-top: -80px; margin-bottom: -80px;"
							/>
						</div>
					</div>

					<h2 class="mb-4 text-2xl font-bold text-gray-800">Weather Forecasting for Travelers</h2>
					<p class="text-lg text-gray-600">
						Plan your perfect vacation with confidence using accurate weather predictions
					</p>
					<div class="mt-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
						<p class="text-center text-yellow-800">
							🏆 Built for the
							<a
								href="https://www.spaceappschallenge.org/2025/find-a-team/lovelace-fanbase/"
								target="_blank"
								rel="noopener noreferrer"
								class="text-yellow-900 underline hover:text-yellow-700"
							>
								NASA Space Apps Challenge 2025
							</a>
						</p>
					</div>
				</div>

				<div class="rounded-lg bg-blue-50 p-6">
					<h3 class="mb-3 text-xl font-semibold text-blue-800">Our Mission</h3>
					<p class="text-gray-700">
						To help travelers make informed decisions about their trips by providing accurate,
						detailed weather forecasts with beautiful visualizations and comprehensive data
						including temperature, precipitation, wind conditions, and air quality.
					</p>
				</div>
			</div>

			<div class="mb-12">
				<h2 class="mb-6 text-2xl font-bold text-gray-800">Meet the Team</h2>
				<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					<div
						class="rounded-lg border border-gray-200 p-6 text-center transition-shadow hover:shadow-md"
					>
						<h3 class="mb-2 text-lg font-semibold text-gray-800">Aishwarya Murugappan</h3>
						<a
							href="https://www.linkedin.com/in/aishwarya-murugappan/"
							target="_blank"
							rel="noopener noreferrer"
							class="inline-flex items-center text-blue-600 transition-colors hover:text-blue-800"
							aria-label="Aishwarya Murugappan's LinkedIn profile"
						>
							<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
								<path
									fill-rule="evenodd"
									d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.328v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.328C19 1.581 18.402 1 17.668 1z"
									clip-rule="evenodd"
								/>
							</svg>
						</a>
					</div>
					<div
						class="rounded-lg border border-gray-200 p-6 text-center transition-shadow hover:shadow-md"
					>
						<h3 class="mb-2 text-lg font-semibold text-gray-800">Maura Jaye Douglas-Morgan</h3>
						<a
							href="https://www.linkedin.com/in/maura-douglas-morgan-7b1b852b6/"
							target="_blank"
							rel="noopener noreferrer"
							class="inline-flex items-center text-blue-600 transition-colors hover:text-blue-800"
							aria-label="Maura Jaye Douglas-Morgan's LinkedIn profile"
						>
							<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
								<path
									fill-rule="evenodd"
									d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.328v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.328C19 1.581 18.402 1 17.668 1z"
									clip-rule="evenodd"
								/>
							</svg>
						</a>
					</div>
					<div
						class="rounded-lg border border-gray-200 p-6 text-center transition-shadow hover:shadow-md"
					>
						<h3 class="mb-2 text-lg font-semibold text-gray-800">Saori Matsuoka</h3>
						<a
							href="https://www.linkedin.com/in/saori-m-01231ba0/"
							target="_blank"
							rel="noopener noreferrer"
							class="inline-flex items-center text-blue-600 transition-colors hover:text-blue-800"
							aria-label="Saori Matsuoka's LinkedIn profile"
						>
							<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
								<path
									fill-rule="evenodd"
									d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.328v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.328C19 1.581 18.402 1 17.668 1z"
									clip-rule="evenodd"
								/>
							</svg>
						</a>
					</div>
					<div
						class="rounded-lg border border-gray-200 p-6 text-center transition-shadow hover:shadow-md"
					>
						<h3 class="mb-2 text-lg font-semibold text-gray-800">Harry Green</h3>
						<a
							href="https://www.linkedin.com/in/harry-green-b2778954/"
							target="_blank"
							rel="noopener noreferrer"
							class="inline-flex items-center text-blue-600 transition-colors hover:text-blue-800"
							aria-label="Harry Green's LinkedIn profile"
						>
							<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
								<path
									fill-rule="evenodd"
									d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.328v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.328C19 1.581 18.402 1 17.668 1z"
									clip-rule="evenodd"
								/>
							</svg>
						</a>
					</div>
					<div
						class="rounded-lg border border-gray-200 p-6 text-center transition-shadow hover:shadow-md"
					>
						<h3 class="mb-2 text-lg font-semibold text-gray-800">Matt Hall</h3>
						<a
							href="https://www.linkedin.com/in/fuzzpedal/"
							target="_blank"
							rel="noopener noreferrer"
							class="inline-flex items-center text-blue-600 transition-colors hover:text-blue-800"
							aria-label="Matt Hall's LinkedIn profile"
						>
							<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
								<path
									fill-rule="evenodd"
									d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.328v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.328C19 1.581 18.402 1 17.668 1z"
									clip-rule="evenodd"
								/>
							</svg>
						</a>
					</div>
					<div
						class="rounded-lg border border-gray-200 p-6 text-center transition-shadow hover:shadow-md"
					>
						<h3 class="mb-2 text-lg font-semibold text-gray-800">Kurund Jalmi</h3>
						<a
							href="https://www.linkedin.com/in/kurundjalmi/"
							target="_blank"
							rel="noopener noreferrer"
							class="inline-flex items-center text-blue-600 transition-colors hover:text-blue-800"
							aria-label="Kurund Jalmi's LinkedIn profile"
						>
							<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
								<path
									fill-rule="evenodd"
									d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.328v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.328C19 1.581 18.402 1 17.668 1z"
									clip-rule="evenodd"
								/>
							</svg>
						</a>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
