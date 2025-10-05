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
		<!-- Rain clouds -->
		{#each Array(5) as _, i (i)}
			<div
				class="rain-cloud"
				style="left: {Math.random() * 120 - 10}%; top: {Math.random() * 20 +
					5}%; animation-delay: {i * 2}s;"
			>
				🌧️
			</div>
		{/each}
		<!-- Heavy rain drops -->
		{#each Array(250) as _, i (i)}
			<div
				class="rain-drop"
				style="left: {Math.random() * 100}%; animation-delay: {Math.random() *
					2}s; animation-duration: {0.3 + Math.random() * 0.8}s;"
			></div>
		{/each}
		<!-- Rain puddle splashes -->
		{#each Array(15) as _, i (i)}
			<div
				class="rain-splash"
				style="left: {Math.random() * 100}%; bottom: {Math.random() *
					20}%; animation-delay: {Math.random() * 4}s;"
			></div>
		{/each}
	</div>
{:else if weatherCondition === 'snowy'}
	<div class="weather-container">
		<!-- Snow clouds -->
		{#each Array(4) as _, i (i)}
			<div
				class="snow-cloud"
				style="left: {Math.random() * 120 - 10}%; top: {Math.random() * 15 +
					5}%; animation-delay: {i * 3}s;"
			>
				☁️
			</div>
		{/each}
		<!-- Mixed snowflakes -->
		{#each Array(80) as _, i (i)}
			<div
				class="snowflake"
				style="left: {Math.random() * 100}%; animation-delay: {Math.random() *
					4}s; animation-duration: {4 + Math.random() * 6}s;"
			>
				❄️
			</div>
		{/each}
		{#each Array(60) as _, i (i)}
			<div
				class="snowflake-alt"
				style="left: {Math.random() * 100}%; animation-delay: {Math.random() *
					5}s; animation-duration: {3 + Math.random() * 5}s;"
			>
				{['❅', '❆', '*'][Math.floor(Math.random() * 3)]}
			</div>
		{/each}
		<!-- Ground snow accumulation -->
		{#each Array(10) as _, i (i)}
			<div
				class="snow-pile"
				style="left: {Math.random() * 100}%; bottom: 0%; animation-delay: {Math.random() * 8}s;"
			>
				🌨️
			</div>
		{/each}
	</div>
{:else if weatherCondition === 'windy'}
	<div class="weather-container">
		<!-- Wind gusts -->
		{#each Array(8) as _, i (i)}
			<div class="wind-gust" style="top: {Math.random() * 80 + 10}%; animation-delay: {i * 0.8}s;">
				💨
			</div>
		{/each}
		<!-- Wind particles -->
		{#each Array(120) as _, i (i)}
			<div
				class="wind-particle"
				style="left: {Math.random() * 100}%; top: {Math.random() *
					100}%; animation-delay: {Math.random() * 3}s; animation-duration: {1.5 +
					Math.random() * 2}s;"
			></div>
		{/each}
		<!-- Swirling leaves -->
		{#each Array(25) as _, i (i)}
			<div
				class="wind-leaf"
				style="left: {Math.random() * 100}%; top: {Math.random() * 80 +
					10}%; animation-delay: {Math.random() * 5}s;"
			>
				{['🍃', '🍂', '🌿'][Math.floor(Math.random() * 3)]}
			</div>
		{/each}
		<!-- Wind streaks -->
		{#each Array(6) as _, i (i)}
			<div
				class="wind-streak"
				style="top: {Math.random() * 100}%; animation-delay: {Math.random() * 4}s;"
			></div>
		{/each}
	</div>
{:else if weatherCondition === 'sunny'}
	<div class="weather-container">
		<!-- Sun rays -->
		{#each Array(8) as _, i (i)}
			<div
				class="sun-ray"
				style="transform: rotate({i * 45}deg); animation-delay: {i * 0.2}s;"
			></div>
		{/each}
		<!-- Sun sparkles -->
		{#each Array(40) as _, i (i)}
			<div
				class="sun-sparkle"
				style="left: {Math.random() * 100}%; top: {Math.random() *
					100}%; animation-delay: {Math.random() * 4}s;"
			></div>
		{/each}
		<!-- Floating sun particles -->
		{#each Array(15) as _, i (i)}
			<div
				class="sun-emoji"
				style="left: {Math.random() * 100}%; top: {Math.random() * 80 +
					10}%; animation-delay: {Math.random() * 6}s;"
			>
				☀️
			</div>
		{/each}
	</div>
{:else if weatherCondition === 'stormy'}
	<div class="weather-container">
		<!-- Lightning overlay with multiple flashes -->
		<div class="lightning-overlay"></div>
		<div class="lightning-flash lightning-flash-1"></div>
		<div class="lightning-flash lightning-flash-2"></div>
		<!-- Storm clouds -->
		{#each Array(6) as _, i (i)}
			<div
				class="storm-cloud"
				style="left: {Math.random() * 120 - 10}%; top: {Math.random() * 25}%; animation-delay: {i *
					1.5}s;"
			>
				⛈️
			</div>
		{/each}
		<!-- Heavy storm rain -->
		{#each Array(300) as _, i (i)}
			<div
				class="storm-rain"
				style="left: {Math.random() * 100}%; animation-delay: {Math.random() *
					1}s; animation-duration: {0.2 + Math.random() * 0.4}s;"
			></div>
		{/each}
		<!-- Thunder emojis -->
		{#each Array(4) as _, i (i)}
			<div
				class="thunder-emoji"
				style="left: {Math.random() * 100}%; top: {Math.random() * 40 +
					10}%; animation-delay: {Math.random() * 6}s;"
			>
				⚡
			</div>
		{/each}
	</div>
{:else if weatherCondition === 'foggy'}
	<div class="weather-container">
		<!-- Multiple fog layers -->
		<div class="fog-layer fog-layer-1"></div>
		<div class="fog-layer fog-layer-2"></div>
		<div class="fog-layer fog-layer-3"></div>
		<div class="fog-layer fog-layer-4"></div>
		<!-- Fog cloud emojis -->
		{#each Array(8) as _, i (i)}
			<div
				class="fog-cloud"
				style="left: {Math.random() * 120 - 10}%; top: {Math.random() * 60 +
					20}%; animation-delay: {i * 3}s;"
			>
				🌫️
			</div>
		{/each}
		<!-- Misty particles -->
		{#each Array(30) as _, i (i)}
			<div
				class="mist-particle"
				style="left: {Math.random() * 100}%; top: {Math.random() *
					100}%; animation-delay: {Math.random() * 8}s;"
			></div>
		{/each}
		<!-- Fog wisps -->
		{#each Array(12) as _, i (i)}
			<div
				class="fog-wisp"
				style="left: {Math.random() * 100}%; top: {Math.random() * 80 +
					10}%; animation-delay: {Math.random() * 10}s;"
			></div>
		{/each}
	</div>
{:else if weatherCondition === 'partly_cloudy' || weatherCondition === 'cloudy'}
	<div class="weather-container">
		{#each Array(20) as _, i (i)}
			<div
				class="cloud-particle"
				style="left: {Math.random() * 100}%; top: {Math.random() * 60 +
					10}%; animation-delay: {Math.random() * 8}s;"
			>
				☁️
			</div>
		{/each}
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
{:else if airQuality === 'poor' || airQuality === 'very_poor' || airQuality === 'high'}
	<div class="air-quality-container">
		{#each Array(40) as _, i (i)}
			<div
				class="air-particle air-poor"
				style="left: {Math.random() * 100}%; top: {Math.random() *
					100}%; animation-delay: {Math.random() * 6}s;"
			></div>
		{/each}
	</div>
{:else if airQuality === 'unhealthy' || airQuality === 'very high'}
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
	.rain-cloud {
		position: absolute;
		font-size: 30px;
		animation: rain-cloud-drift 15s ease-in-out infinite;
		text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
		z-index: 10;
	}

	.rain-drop {
		position: absolute;
		top: -10px;
		width: 3px;
		height: 18px;
		background: linear-gradient(
			to bottom,
			transparent 0%,
			rgba(74, 144, 226, 0.9) 40%,
			rgba(135, 206, 235, 1) 100%
		);
		border-radius: 0 0 3px 3px;
		animation: fall linear infinite;
		box-shadow: 0 0 3px rgba(74, 144, 226, 0.5);
	}

	.rain-splash {
		position: absolute;
		width: 8px;
		height: 8px;
		background: radial-gradient(circle, rgba(135, 206, 235, 0.8), transparent);
		border-radius: 50%;
		animation: rain-splash 2s ease-out infinite;
	}

	/* Snow */
	.snow-cloud {
		position: absolute;
		font-size: 25px;
		animation: snow-cloud-drift 20s ease-in-out infinite;
		text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
		opacity: 0.9;
	}

	.snowflake {
		position: absolute;
		top: -10px;
		color: white;
		font-size: 16px;
		animation: snow-fall linear infinite;
		text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.4);
	}

	.snowflake-alt {
		position: absolute;
		top: -10px;
		color: #f0f8ff;
		font-size: 12px;
		animation: snow-fall-alt linear infinite;
		text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.3);
	}

	.snow-pile {
		position: absolute;
		font-size: 20px;
		animation: snow-accumulate 8s ease-in-out infinite;
		text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
	}

	/* Wind */
	.wind-gust {
		position: absolute;
		left: -50px;
		font-size: 40px;
		animation: wind-gust-blow 3s ease-in-out infinite;
		text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
	}

	.wind-particle {
		position: absolute;
		width: 4px;
		height: 4px;
		background: radial-gradient(
			circle,
			rgba(144, 238, 144, 0.9),
			rgba(173, 216, 230, 0.6),
			transparent
		);
		border-radius: 50%;
		animation: wind-blow linear infinite;
	}

	.wind-leaf {
		position: absolute;
		font-size: 18px;
		animation: wind-leaf-swirl 4s ease-in-out infinite;
		text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
	}

	.wind-streak {
		position: absolute;
		left: -100px;
		width: 150px;
		height: 2px;
		background: linear-gradient(
			90deg,
			transparent 0%,
			rgba(173, 216, 230, 0.6) 30%,
			rgba(135, 206, 235, 0.8) 50%,
			rgba(173, 216, 230, 0.6) 70%,
			transparent 100%
		);
		animation: wind-streak-blow 2.5s ease-in-out infinite;
		border-radius: 1px;
	}

	/* Sun */
	.sun-ray {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 120px;
		height: 4px;
		background: linear-gradient(
			90deg,
			transparent 0%,
			rgba(255, 215, 0, 0.6) 20%,
			rgba(255, 255, 0, 0.8) 50%,
			rgba(255, 215, 0, 0.6) 80%,
			transparent 100%
		);
		transform-origin: 0 50%;
		animation: sun-rays 8s linear infinite;
		border-radius: 2px;
	}

	.sun-sparkle {
		position: absolute;
		width: 6px;
		height: 6px;
		background: radial-gradient(
			circle,
			rgba(255, 215, 0, 0.9),
			rgba(255, 255, 0, 0.6),
			transparent
		);
		border-radius: 50%;
		animation: sun-sparkle 4s ease-in-out infinite;
	}

	.sun-emoji {
		position: absolute;
		font-size: 24px;
		animation: sun-float 6s ease-in-out infinite;
		text-shadow: 2px 2px 4px rgba(255, 215, 0, 0.3);
		opacity: 0.8;
	}

	/* Storm */
	.storm-cloud {
		position: absolute;
		font-size: 35px;
		animation: storm-cloud-rumble 12s ease-in-out infinite;
		text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.4);
		z-index: 15;
	}

	.lightning-overlay {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(255, 255, 255, 0.1);
		animation: lightning 4s infinite;
	}

	.lightning-flash {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: radial-gradient(circle, rgba(255, 255, 0, 0.3), transparent);
		animation: lightning-flash 6s infinite;
	}

	.lightning-flash-1 {
		animation-delay: 1s;
	}

	.lightning-flash-2 {
		animation-delay: 3s;
		background: radial-gradient(circle, rgba(255, 255, 255, 0.2), transparent);
	}

	.thunder-emoji {
		position: absolute;
		font-size: 28px;
		animation: thunder-flash 3s ease-in-out infinite;
		text-shadow: 2px 2px 4px rgba(255, 255, 0, 0.5);
		z-index: 12;
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

	/* Cloud */
	.cloud-particle {
		position: absolute;
		font-size: 18px;
		animation: cloud-drift ease-in-out infinite;
		text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
		opacity: 0.8;
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

	.fog-layer-4 {
		animation-duration: 35s;
		animation-delay: -30s;
		opacity: 0.2;
		background: linear-gradient(90deg, transparent, rgba(245, 245, 245, 0.3), transparent);
	}

	.fog-cloud {
		position: absolute;
		font-size: 25px;
		animation: fog-cloud-drift 25s ease-in-out infinite;
		text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
		opacity: 0.7;
	}

	.mist-particle {
		position: absolute;
		width: 6px;
		height: 6px;
		background: radial-gradient(circle, rgba(220, 220, 220, 0.6), transparent);
		border-radius: 50%;
		animation: mist-float 8s ease-in-out infinite;
	}

	.fog-wisp {
		position: absolute;
		width: 40px;
		height: 8px;
		background: linear-gradient(
			90deg,
			transparent 0%,
			rgba(200, 200, 200, 0.4) 30%,
			rgba(220, 220, 220, 0.6) 50%,
			rgba(200, 200, 200, 0.4) 70%,
			transparent 100%
		);
		border-radius: 4px;
		animation: fog-wisp-drift 12s ease-in-out infinite;
		opacity: 0.5;
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

	@keyframes rain-cloud-drift {
		0%,
		100% {
			transform: translateX(0px) translateY(0px);
		}
		25% {
			transform: translateX(20px) translateY(-5px);
		}
		50% {
			transform: translateX(10px) translateY(-10px);
		}
		75% {
			transform: translateX(30px) translateY(-3px);
		}
	}

	@keyframes rain-splash {
		0% {
			transform: scale(0);
			opacity: 0;
		}
		20% {
			transform: scale(1.2);
			opacity: 0.8;
		}
		100% {
			transform: scale(0);
			opacity: 0;
		}
	}

	@keyframes snow-fall {
		to {
			transform: translateY(100vh) rotate(360deg);
		}
	}

	@keyframes snow-fall-alt {
		to {
			transform: translateY(100vh) rotate(-180deg);
		}
	}

	@keyframes snow-cloud-drift {
		0%,
		100% {
			transform: translateX(0px) translateY(0px);
		}
		33% {
			transform: translateX(15px) translateY(-8px);
		}
		66% {
			transform: translateX(-10px) translateY(-5px);
		}
	}

	@keyframes snow-accumulate {
		0%,
		100% {
			opacity: 0.3;
			transform: scale(0.8);
		}
		50% {
			opacity: 0.7;
			transform: scale(1.1);
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

	@keyframes wind-gust-blow {
		0% {
			transform: translateX(-50px);
			opacity: 0;
		}
		20% {
			opacity: 1;
		}
		80% {
			opacity: 1;
		}
		100% {
			transform: translateX(100vw);
			opacity: 0;
		}
	}

	@keyframes wind-leaf-swirl {
		0% {
			transform: translateX(0) translateY(0) rotate(0deg);
			opacity: 0.7;
		}
		25% {
			transform: translateX(50px) translateY(-30px) rotate(90deg);
			opacity: 1;
		}
		50% {
			transform: translateX(100px) translateY(-10px) rotate(180deg);
			opacity: 0.8;
		}
		75% {
			transform: translateX(150px) translateY(-40px) rotate(270deg);
			opacity: 0.9;
		}
		100% {
			transform: translateX(200px) translateY(-20px) rotate(360deg);
			opacity: 0;
		}
	}

	@keyframes wind-streak-blow {
		0% {
			transform: translateX(-100px);
			opacity: 0;
		}
		30% {
			opacity: 0.8;
		}
		70% {
			opacity: 0.8;
		}
		100% {
			transform: translateX(100vw);
			opacity: 0;
		}
	}

	@keyframes sun-rays {
		0% {
			transform: rotate(0deg);
			opacity: 0.6;
		}
		100% {
			transform: rotate(360deg);
			opacity: 0.6;
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
			transform: scale(1.2);
		}
	}

	@keyframes sun-float {
		0%,
		100% {
			transform: translateY(0px) rotate(0deg);
			opacity: 0.6;
		}
		25% {
			transform: translateY(-15px) rotate(90deg);
			opacity: 0.9;
		}
		50% {
			transform: translateY(-8px) rotate(180deg);
			opacity: 0.8;
		}
		75% {
			transform: translateY(-20px) rotate(270deg);
			opacity: 0.7;
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

	@keyframes lightning-flash {
		0%,
		85%,
		100% {
			opacity: 0;
		}
		86%,
		87% {
			opacity: 0.5;
		}
		88%,
		89% {
			opacity: 0;
		}
		90%,
		91% {
			opacity: 0.8;
		}
		92%,
		93% {
			opacity: 0;
		}
		94% {
			opacity: 0.6;
		}
	}

	@keyframes storm-cloud-rumble {
		0%,
		100% {
			transform: translateX(0px) translateY(0px);
		}
		20% {
			transform: translateX(-8px) translateY(-3px);
		}
		40% {
			transform: translateX(5px) translateY(-8px);
		}
		60% {
			transform: translateX(-3px) translateY(-5px);
		}
		80% {
			transform: translateX(10px) translateY(-2px);
		}
	}

	@keyframes thunder-flash {
		0%,
		70%,
		100% {
			opacity: 0.6;
			transform: scale(1);
		}
		75%,
		85% {
			opacity: 1;
			transform: scale(1.2);
			filter: brightness(1.5);
		}
		80% {
			opacity: 0.8;
			transform: scale(1.1);
		}
	}

	@keyframes cloud-drift {
		0%,
		100% {
			transform: translateX(0px) translateY(0px);
			opacity: 0.6;
		}
		25% {
			transform: translateX(15px) translateY(-5px);
			opacity: 0.9;
		}
		50% {
			transform: translateX(10px) translateY(-10px);
			opacity: 0.7;
		}
		75% {
			transform: translateX(25px) translateY(-2px);
			opacity: 0.8;
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

	@keyframes fog-cloud-drift {
		0%,
		100% {
			transform: translateX(0px) translateY(0px);
			opacity: 0.5;
		}
		25% {
			transform: translateX(30px) translateY(-10px);
			opacity: 0.8;
		}
		50% {
			transform: translateX(15px) translateY(-5px);
			opacity: 0.6;
		}
		75% {
			transform: translateX(40px) translateY(-15px);
			opacity: 0.7;
		}
	}

	@keyframes mist-float {
		0%,
		100% {
			transform: translateY(0px) translateX(0px);
			opacity: 0.3;
		}
		25% {
			transform: translateY(-20px) translateX(10px);
			opacity: 0.6;
		}
		50% {
			transform: translateY(-10px) translateX(-5px);
			opacity: 0.4;
		}
		75% {
			transform: translateY(-25px) translateX(15px);
			opacity: 0.7;
		}
	}

	@keyframes fog-wisp-drift {
		0% {
			transform: translateX(-40px);
			opacity: 0;
		}
		20% {
			opacity: 0.6;
		}
		80% {
			opacity: 0.6;
		}
		100% {
			transform: translateX(100vw);
			opacity: 0;
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

	.cloud-particle:nth-child(2n) {
		font-size: 22px;
		animation-duration: 12s;
	}
	.cloud-particle:nth-child(3n) {
		font-size: 16px;
		animation-duration: 15s;
		opacity: 0.6;
	}
	.cloud-particle:nth-child(4n) {
		animation-duration: 18s;
	}

	.sun-sparkle:nth-child(2n) {
		width: 8px;
		height: 8px;
		animation-duration: 3s;
	}
	.sun-sparkle:nth-child(3n) {
		width: 4px;
		height: 4px;
		animation-duration: 5s;
	}

	.sun-emoji:nth-child(2n) {
		font-size: 20px;
		animation-duration: 8s;
	}
	.sun-emoji:nth-child(3n) {
		font-size: 28px;
		animation-duration: 10s;
		opacity: 0.6;
	}

	.sun-ray:nth-child(2n) {
		height: 3px;
		width: 100px;
	}
	.sun-ray:nth-child(3n) {
		height: 5px;
		width: 140px;
	}
</style>
