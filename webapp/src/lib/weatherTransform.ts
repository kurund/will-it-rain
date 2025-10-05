// Weather API response transformation utilities

export interface RawWeatherResponse {
	Country: string;
	Date: string;
	Pred_Temp_C: number;
	Temp_likely_min_C: number;
	Temp_likely_max_C: number;
	Temp_possible_min_C: number;
	Temp_possible_max_C: number;
	Prob_Rain_pct: number;
	Pred_Rain_mm: number;
	Prob_Calm_pct: number;
	Prob_LightBreeze_pct: number;
	Prob_Windy_pct: number;
	Prob_Gale_pct: number;
	Pred_Wind_kph: number;
	AQ_Low_pct: number;
	AQ_Moderate_pct: number;
	AQ_High_pct: number;
	AQ_VeryHigh_pct: number;
	Pred_AQ_Index: number;
	Pred_FeelsLike_C: number;
	Pred_Cloud_pct: number;
	Pred_Condition: string;
	Pred_Temp_Class: string;
	Pred_Wind_Class: string;
	Pred_Wet_Class: string;
	Pred_AQ_Class: string;
	Pred_Headline: string;
}

export interface TransformedWeatherData {
	location: {
		country: string;
		date: string;
	};
	forecast: {
		temperature: {
			predicted: number;
			feelsLike: number;
			class: string;
			range: {
				likely: { min: number; max: number };
				possible: { min: number; max: number };
			};
		};
		rain: {
			probability: number;
			expectedAmount: number;
			class: string;
			description: string;
		};
		wind: {
			speed: number;
			class: string;
			conditions: Array<{ type: string; probability: number }>;
			description: string;
		};
		clouds: {
			coverage: number;
			description: string;
		};
	};
	airQuality: {
		index: number;
		level: string;
		class: string;
		description: string;
		breakdown: Array<{ level: string; percentage: number }>;
	};
	summary: {
		weather: string;
		condition: string;
		emoji: string;
		headline: string;
	};
}

function getAirQualityLevel(index: number): { level: string; description: string } {
	if (index <= 3) return { level: 'Low', description: 'Air quality is considered satisfactory' };
	if (index <= 6)
		return { level: 'Moderate', description: 'Air quality is acceptable for most people' };
	if (index <= 9)
		return {
			level: 'High',
			description: 'Members of sensitive groups may experience health effects'
		};
	return { level: 'Very High', description: 'Health warnings of emergency conditions' };
}

function getRainDescription(probability: number, amount: number): string {
	if (probability < 20) return 'Very unlikely to rain';
	if (probability < 40) return 'Low chance of rain';
	if (probability < 60) return 'Moderate chance of rain';
	if (probability < 80) return 'High chance of rain';
	return 'Very likely to rain';
}

function getWindDescription(conditions: Array<{ type: string; probability: number }>): string {
	const dominant = conditions.reduce((max, current) =>
		current.probability > max.probability ? current : max
	);

	if (dominant.probability > 50) {
		return `Expect ${dominant.type.toLowerCase()} conditions`;
	}
	return 'Variable wind conditions expected';
}

function getWeatherCondition(predCondition: string): {
	weather: string;
	condition: string;
	emoji: string;
} {
	const condition = predCondition.toLowerCase();

	if (condition.includes('storm') || condition.includes('thunder')) {
		return { weather: 'stormy', condition: predCondition, emoji: '⛈️' };
	}

	if (condition.includes('rain') || condition.includes('shower')) {
		return { weather: 'rainy', condition: predCondition, emoji: '🌧️' };
	}

	if (condition.includes('partly cloudy') || condition.includes('partial')) {
		return { weather: 'partly_cloudy', condition: predCondition, emoji: '⛅' };
	}

	if (condition.includes('cloudy') || condition.includes('overcast')) {
		return { weather: 'cloudy', condition: predCondition, emoji: '☁️' };
	}

	if (condition.includes('fog')) {
		return { weather: 'foggy', condition: predCondition, emoji: '🌫️' };
	}

	if (condition.includes('snow')) {
		return { weather: 'snowy', condition: predCondition, emoji: '❄️' };
	}

	if (condition.includes('wind')) {
		return { weather: 'windy', condition: predCondition, emoji: '💨' };
	}

	if (condition.includes('clear') || condition.includes('sunny')) {
		return { weather: 'sunny', condition: predCondition, emoji: '☀️' };
	}

	// Default fallback
	return { weather: 'partly_cloudy', condition: predCondition, emoji: '🌤️' };
}

function getCloudsDescription(coverage: number): string {
	if (coverage < 20) return 'Clear skies';
	if (coverage < 40) return 'Few clouds';
	if (coverage < 60) return 'Partly cloudy';
	if (coverage < 80) return 'Mostly cloudy';
	return 'Overcast';
}

export function transformWeatherData(raw: RawWeatherResponse): TransformedWeatherData {
	const windConditions = [
		{ type: 'Calm', probability: raw.Prob_Calm_pct },
		{ type: 'Light Breeze', probability: raw.Prob_LightBreeze_pct },
		{ type: 'Windy', probability: raw.Prob_Windy_pct },
		{ type: 'Gale', probability: raw.Prob_Gale_pct }
	].filter((w) => w.probability > 0);

	const airQualityLevel = getAirQualityLevel(raw.Pred_AQ_Index);
	const rainDescription = getRainDescription(raw.Prob_Rain_pct, raw.Pred_Rain_mm);
	const windDescription = getWindDescription(windConditions);
	const weatherCondition = getWeatherCondition(raw.Pred_Condition);
	const cloudsDescription = getCloudsDescription(raw.Pred_Cloud_pct);

	return {
		location: {
			country: raw.Country,
			date: raw.Date
		},
		forecast: {
			temperature: {
				predicted: Math.round(raw.Pred_Temp_C),
				feelsLike: Math.round(raw.Pred_FeelsLike_C),
				class: raw.Pred_Temp_Class,
				range: {
					likely: {
						min: Math.round(raw.Temp_likely_min_C),
						max: Math.round(raw.Temp_likely_max_C)
					},
					possible: {
						min: Math.round(raw.Temp_possible_min_C),
						max: Math.round(raw.Temp_possible_max_C)
					}
				}
			},
			rain: {
				probability: Math.round(raw.Prob_Rain_pct),
				expectedAmount: Math.round(raw.Pred_Rain_mm * 10) / 10,
				class: raw.Pred_Wet_Class,
				description: rainDescription
			},
			wind: {
				speed: Math.round(raw.Pred_Wind_kph),
				class: raw.Pred_Wind_Class,
				conditions: windConditions,
				description: windDescription
			},
			clouds: {
				coverage: Math.round(raw.Pred_Cloud_pct),
				description: cloudsDescription
			}
		},
		airQuality: {
			index: Math.round(raw.Pred_AQ_Index * 10) / 10,
			level: airQualityLevel.level,
			class: raw.Pred_AQ_Class,
			description: airQualityLevel.description,
			breakdown: [
				{ level: 'Low', percentage: Math.round(raw.AQ_Low_pct) },
				{ level: 'Moderate', percentage: Math.round(raw.AQ_Moderate_pct) },
				{ level: 'High', percentage: Math.round(raw.AQ_High_pct) },
				{ level: 'Very High', percentage: Math.round(raw.AQ_VeryHigh_pct) }
			].filter((aq) => aq.percentage > 0)
		},
		summary: {
			...weatherCondition,
			headline: raw.Pred_Headline
		}
	};
}
