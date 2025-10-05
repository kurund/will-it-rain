// Weather API response transformation utilities

export interface RawWeatherResponse {
	AQ_High_pct: number;
	AQ_Low_pct: number;
	AQ_Moderate_pct: number;
	AQ_VeryHigh_pct: number;
	Country: string;
	Date: string;
	Pred_AQ_Index: number;
	Pred_Rain_mm: number;
	Pred_Temp_C: number;
	Prob_Calm_pct: number;
	Prob_Gale_pct: number;
	Prob_LightBreeze_pct: number;
	Prob_Rain_pct: number;
	Prob_Windy_pct: number;
	Temp_likely_max_C: number;
	Temp_likely_min_C: number;
	Temp_possible_max_C: number;
	Temp_possible_min_C: number;
}

export interface TransformedWeatherData {
	location: {
		country: string;
		date: string;
	};
	forecast: {
		temperature: {
			predicted: number;
			range: {
				likely: { min: number; max: number };
				possible: { min: number; max: number };
			};
		};
		rain: {
			probability: number;
			expectedAmount: number;
			description: string;
		};
		wind: {
			conditions: Array<{ type: string; probability: number }>;
			description: string;
		};
	};
	airQuality: {
		index: number;
		level: string;
		description: string;
		breakdown: Array<{ level: string; percentage: number }>;
	};
	summary: {
		weather: string;
		condition: string;
		emoji: string;
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

function getWeatherCondition(
	rainProb: number,
	windConditions: Array<{ type: string; probability: number }>
): { weather: string; condition: string; emoji: string } {
	const strongWind = windConditions.find((w) => w.type === 'Gale' && w.probability > 30);

	if (strongWind) {
		return { weather: 'stormy', condition: 'Stormy', emoji: '⛈️' };
	}

	if (rainProb > 60) {
		return { weather: 'rainy', condition: 'Rainy', emoji: '🌧️' };
	}

	if (rainProb > 30) {
		return { weather: 'partly_cloudy', condition: 'Partly Cloudy', emoji: '⛅' };
	}

	const windy = windConditions.find((w) => w.type === 'Windy' && w.probability > 40);
	if (windy) {
		return { weather: 'windy', condition: 'Windy', emoji: '💨' };
	}

	return { weather: 'sunny', condition: 'Clear', emoji: '☀️' };
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
	const weatherCondition = getWeatherCondition(raw.Prob_Rain_pct, windConditions);

	return {
		location: {
			country: raw.Country,
			date: raw.Date
		},
		forecast: {
			temperature: {
				predicted: Math.round(raw.Pred_Temp_C),
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
				expectedAmount: Math.round(raw.Pred_Rain_mm * 10) / 10, // Round to 1 decimal
				description: rainDescription
			},
			wind: {
				conditions: windConditions,
				description: windDescription
			}
		},
		airQuality: {
			index: Math.round(raw.Pred_AQ_Index * 10) / 10, // Round to 1 decimal
			level: airQualityLevel.level,
			description: airQualityLevel.description,
			breakdown: [
				{ level: 'Low', percentage: Math.round(raw.AQ_Low_pct) },
				{ level: 'Moderate', percentage: Math.round(raw.AQ_Moderate_pct) },
				{ level: 'High', percentage: Math.round(raw.AQ_High_pct) },
				{ level: 'Very High', percentage: Math.round(raw.AQ_VeryHigh_pct) }
			].filter((aq) => aq.percentage > 0)
		},
		summary: weatherCondition
	};
}
