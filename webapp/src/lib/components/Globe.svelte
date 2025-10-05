<script lang="ts">
	import { browser } from '$app/environment';

	interface Props {
		targetLocation?: { lat: number; lng: number; name: string };
		onLocationReached?: () => void;
	}

	let { targetLocation, onLocationReached }: Props = $props();

	let globeContainer: HTMLDivElement;
	let globeInstance: any;
	let webglSupported = $state(true);
	let globeError = $state('');

	$effect(() => {
		if (!browser || !globeContainer) return;

		// Dynamically import globe.gl only on the client side
		import('globe.gl')
			.then(({ default: Globe }) => {
				try {
					// Check WebGL support
					const canvas = document.createElement('canvas');
					const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
					if (!gl) {
						webglSupported = false;
						// Auto-proceed immediately to weather data if 3D isn't supported
						if (onLocationReached) {
							onLocationReached();
						}
						return;
					}

					// Initialize the globe
					globeInstance = Globe()
						.globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
						.backgroundColor('rgba(0,0,0,0)') // Transparent background
						.showGlobe(true)
						.showAtmosphere(true)
						.atmosphereColor('lightskyblue')
						.atmosphereAltitude(0.15)
						.width(globeContainer.clientWidth)
						.height(globeContainer.clientHeight);

					// Mount to container - globe.gl automatically creates and appends the canvas
					globeInstance(globeContainer);

					// Auto-rotate the globe
					globeInstance.controls().autoRotate = true;
					globeInstance.controls().autoRotateSpeed = 0.5;

					// If we have a target location, zoom to it after a brief delay
					if (targetLocation) {
						setTimeout(() => {
							zoomToLocation(targetLocation);
						}, 1000);
					}

					// Handle resize
					const handleResize = () => {
						if (globeInstance) {
							globeInstance.width(globeContainer.clientWidth).height(globeContainer.clientHeight);
						}
					};

					window.addEventListener('resize', handleResize);

					// Cleanup
					return () => {
						window.removeEventListener('resize', handleResize);
						if (globeContainer && globeInstance) {
							globeContainer.innerHTML = '';
						}
					};
				} catch (error) {
					console.error('Globe initialization error:', error);
					globeError = error instanceof Error ? error.message : 'Failed to initialize globe';
					webglSupported = false;
					// Auto-proceed immediately to weather data on error
					if (onLocationReached) {
						onLocationReached();
					}
				}
			})
			.catch((error) => {
				console.error('Failed to load globe.gl:', error);
				globeError = 'Failed to load 3D globe library';
				webglSupported = false;
				// Auto-proceed immediately to weather data on error
				if (onLocationReached) {
					onLocationReached();
				}
			});
	});

	function zoomToLocation(location: { lat: number; lng: number; name: string }) {
		if (!globeInstance) return;

		// Stop auto-rotation
		globeInstance.controls().autoRotate = false;

		// Add a marker for the location
		globeInstance.pointsData([
			{
				lat: location.lat,
				lng: location.lng,
				name: location.name,
				color: '#ff6b6b',
				size: 1.2
			}
		]);

		// Zoom in close to the location and stay there
		globeInstance.pointOfView(
			{
				lat: location.lat,
				lng: location.lng,
				altitude: 0.8 // Very close zoom
			},
			3000 // 3 second animation
		);

		// Start fade transition after zoom completes
		if (onLocationReached) {
			setTimeout(onLocationReached, 3500); // Allow zoom to complete + brief pause
		}
	}

	// Export function for external control
	export function focusLocation(location: { lat: number; lng: number; name: string }) {
		zoomToLocation(location);
	}
</script>

<div
	bind:this={globeContainer}
	class="globe-container h-full w-full"
	style="min-height: 400px;"
></div>

<style>
	.globe-container {
		position: relative;
		overflow: hidden;
	}

	:global(.globe-container canvas) {
		display: block !important;
	}
</style>
