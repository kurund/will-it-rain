<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script lang="ts">
	interface Props {
		weatherCondition?: string;
		airQuality?: string;
	}

	let { weatherCondition, airQuality }: Props = $props();
</script>

<!-- Weather Effects -->
{#if weatherCondition === 'rainy'}
	<div class="weather-container">
		{#each Array(200) as _, i (i)}
			<div
				class="rain-drop"
				style="left: {Math.random() * 100}%; animation-delay: {Math.random() *
					2}s; animation-duration: {0.5 + Math.random() * 1}s;"
			></div>
		{/each}
	</div>
{:else if weatherCondition === 'snowy'}
	<div class="weather-container">
		{#each Array(100) as _, i (i)}
			<div
				class="snowflake"
				style="left: {Math.random() * 100}%; animation-delay: {Math.random() *
					3}s; animation-duration: {3 + Math.random() * 4}s;"
			>
				❄
			</div>
		{/each}
	</div>
{:else if weatherCondition === 'windy'}
	<div class="weather-container">
		{#each Array(150) as _, i (i)}
			<div
				class="wind-particle"
				style="left: {Math.random() * 100}%; top: {Math.random() *
					100}%; animation-delay: {Math.random() * 3}s; animation-duration: {2 +
					Math.random() * 2}s;"
			></div>
		{/each}
	</div>
{:else if weatherCondition === 'sunny'}
	<div class="weather-container">
		{#each Array(30) as _, i (i)}
			<div
				class="sun-particle"
				style="left: {Math.random() * 100}%; top: {Math.random() *
					100}%; animation-delay: {Math.random() * 4}s;"
			></div>
		{/each}
	</div>
{:else if weatherCondition === 'stormy'}
	<div class="weather-container">
		<div class="lightning-overlay"></div>
		{#each Array(250) as _, i (i)}
			<div
				class="storm-rain"
				style="left: {Math.random() * 100}%; animation-delay: {Math.random() *
					1}s; animation-duration: {0.3 + Math.random() * 0.5}s;"
			></div>
		{/each}
	</div>
{:else if weatherCondition === 'foggy'}
	<div class="weather-container">
		<div class="fog-layer fog-layer-1"></div>
		<div class="fog-layer fog-layer-2"></div>
		<div class="fog-layer fog-layer-3"></div>
	</div>
{/if}

<!-- Air Quality Effects -->
{#if airQuality === 'moderate'}
	<div class="air-quality-container">
		{#each Array(20) as _, i (i)}
			<div
				class="air-particle air-moderate"
				style="left: {Math.random() * 100}%; top: {Math.random() *
					100}%; animation-delay: {Math.random() * 8}s;"
			></div>
		{/each}
	</div>
{:else if airQuality === 'poor' || airQuality === 'very_poor'}
	<div class="air-quality-container">
		{#each Array(40) as _, i (i)}
			<div
				class="air-particle air-poor"
				style="left: {Math.random() * 100}%; top: {Math.random() *
					100}%; animation-delay: {Math.random() * 6}s;"
			></div>
		{/each}
	</div>
{:else if airQuality === 'unhealthy'}
	<div class="air-quality-container">
		{#each Array(60) as _, i (i)}
			<div
				class="air-particle air-unhealthy"
				style="left: {Math.random() * 100}%; top: {Math.random() *
					100}%; animation-delay: {Math.random() * 4}s;"
			></div>
		{/each}
	</div>
{/if}

<style>
	.weather-container,
	.air-quality-container {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
		z-index: 1;
	}

	.air-quality-container {
		z-index: 2;
	}

	/* Rain */
	.rain-drop {
		position: absolute;
		top: -10px;
		width: 2px;
		height: 15px;
		background: linear-gradient(
			to bottom,
			transparent 0%,
			rgba(74, 144, 226, 0.8) 50%,
			rgba(135, 206, 235, 1) 100%
		);
		border-radius: 0 0 2px 2px;
		animation: fall linear infinite;
	}

	/* Snow */
	.snowflake {
		position: absolute;
		top: -10px;
		color: white;
		font-size: 14px;
		animation: snow-fall linear infinite;
		text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.3);
	}

	/* Wind */
	.wind-particle {
		position: absolute;
		width: 3px;
		height: 3px;
		background: radial-gradient(circle, rgba(144, 238, 144, 0.8), transparent);
		border-radius: 50%;
		animation: wind-blow linear infinite;
	}

	/* Sun */
	.sun-particle {
		position: absolute;
		width: 3px;
		height: 3px;
		background: radial-gradient(circle, rgba(255, 215, 0, 0.8), transparent);
		border-radius: 50%;
		animation: sun-sparkle 4s ease-in-out infinite;
	}

	/* Storm */
	.lightning-overlay {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(255, 255, 255, 0.1);
		animation: lightning 4s infinite;
	}

	.storm-rain {
		position: absolute;
		top: -10px;
		width: 3px;
		height: 20px;
		background: linear-gradient(
			to bottom,
			transparent 0%,
			rgba(30, 58, 138, 0.9) 50%,
			rgba(59, 130, 246, 1) 100%
		);
		border-radius: 0 0 2px 2px;
		animation: storm-fall linear infinite;
	}

	/* Fog */
	.fog-layer {
		position: absolute;
		top: 0;
		left: 0;
		width: 120%;
		height: 100%;
		background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent);
		animation: fog-drift linear infinite;
		backdrop-filter: blur(1px);
	}

	.fog-layer-1 {
		animation-duration: 20s;
		opacity: 0.6;
	}

	.fog-layer-2 {
		animation-duration: 25s;
		animation-delay: -10s;
		opacity: 0.4;
		background: linear-gradient(90deg, transparent, rgba(240, 240, 240, 0.5), transparent);
	}

	.fog-layer-3 {
		animation-duration: 30s;
		animation-delay: -20s;
		opacity: 0.3;
		background: linear-gradient(90deg, transparent, rgba(250, 250, 250, 0.4), transparent);
	}

	/* Air Quality */
	.air-particle {
		position: absolute;
		border-radius: 50%;
		animation: air-float ease-in-out infinite;
	}

	.air-moderate {
		width: 3px;
		height: 3px;
		background: radial-gradient(circle, rgba(253, 224, 71, 0.6), transparent);
		animation-duration: 8s;
	}

	.air-poor {
		width: 4px;
		height: 4px;
		background: radial-gradient(circle, rgba(139, 69, 19, 0.7), transparent);
		animation-duration: 6s;
	}

	.air-unhealthy {
		width: 5px;
		height: 5px;
		background: radial-gradient(circle, rgba(220, 20, 60, 0.8), transparent);
		animation-duration: 4s;
	}

	/* Animations */
	@keyframes fall {
		to {
			transform: translateY(100vh);
		}
	}

	@keyframes snow-fall {
		to {
			transform: translateY(100vh) rotate(360deg);
		}
	}

	@keyframes wind-blow {
		0% {
			transform: translate(0, 0);
			opacity: 0;
		}
		10% {
			opacity: 1;
		}
		90% {
			opacity: 1;
		}
		100% {
			transform: translate(100vw, -50vh);
			opacity: 0;
		}
	}

	@keyframes sun-sparkle {
		0%,
		100% {
			opacity: 0;
			transform: scale(0);
		}
		50% {
			opacity: 1;
			transform: scale(1);
		}
	}

	@keyframes storm-fall {
		to {
			transform: translateY(100vh) translateX(20px);
		}
	}

	@keyframes lightning {
		0%,
		90%,
		100% {
			opacity: 0;
		}
		91%,
		92% {
			opacity: 1;
		}
		93%,
		94% {
			opacity: 0;
		}
		95% {
			opacity: 1;
		}
	}

	@keyframes fog-drift {
		from {
			transform: translateX(-20%);
		}
		to {
			transform: translateX(100%);
		}
	}

	@keyframes air-float {
		0%,
		100% {
			transform: translateY(0px) translateX(0px);
			opacity: 0.3;
		}
		25% {
			transform: translateY(-10px) translateX(5px);
			opacity: 0.7;
		}
		50% {
			transform: translateY(-5px) translateX(-3px);
			opacity: 0.5;
		}
		75% {
			transform: translateY(-15px) translateX(8px);
			opacity: 0.8;
		}
	}

	/* Variations */
	.rain-drop:nth-child(odd) {
		width: 1px;
		height: 12px;
	}
	.rain-drop:nth-child(3n) {
		width: 3px;
		height: 18px;
	}

	.snowflake:nth-child(3n) {
		font-size: 18px;
		animation-duration: 8s;
	}
	.snowflake:nth-child(4n) {
		font-size: 10px;
		opacity: 0.8;
	}

	.wind-particle:nth-child(2n) {
		animation-duration: 3s;
	}
	.wind-particle:nth-child(3n) {
		animation-duration: 4s;
	}

	.storm-rain:nth-child(2n) {
		width: 4px;
		height: 25px;
	}
	.storm-rain:nth-child(3n) {
		animation-duration: 0.4s;
	}
</style>
