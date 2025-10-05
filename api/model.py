import pandas as pd
import numpy as np
from datetime import datetime
from scipy.stats import norm

# --- Load and prepare data ---
GWR = pd.read_csv("GlobalWeatherRepository.csv", parse_dates=["last_updated"])


# Add month and season columns
def get_season(month):
    if month in [12, 1, 2]:
        return "Winter"
    elif month in [3, 4, 5]:
        return "Spring"
    elif month in [6, 7, 8]:
        return "Summer"
    elif month in [9, 10, 11]:
        return "Autumn"
    else:
        return np.nan


GWR["month"] = GWR["last_updated"].dt.month
GWR["season"] = GWR["month"].apply(get_season)
GWR["season"] = pd.Categorical(
    GWR["season"], categories=["Winter", "Spring", "Summer", "Autumn"], ordered=True
)


# --- Define model function ---
def model(GWR, country, date_str, sigma_days=15):
    from datetime import timedelta

    def gaussian_weights(dates, target_date, sigma_days=15):
        doy = dates.dt.dayofyear
        target = target_date.timetuple().tm_yday
        delta = np.abs(doy - target)
        delta = np.minimum(delta, 365 - delta)
        return np.exp(-(delta**2) / (2 * sigma_days**2))

    def weighted_mean(x, w):
        mask = np.isfinite(x) & np.isfinite(w)
        if not np.any(mask):
            return np.nan
        return np.sum(w[mask] * x[mask]) / np.sum(w[mask])

    def weighted_quantiles(x, w, probs=[0.25, 0.75]):
        mask = np.isfinite(x) & np.isfinite(w)
        x = x[mask]
        w = w[mask]
        if len(x) == 0:
            return [np.nan] * len(probs)
        order = np.argsort(x)
        x = x[order]
        w = np.array(w)[order]
        cumulative_weights = np.cumsum(w) / np.sum(w)
        return [x[np.searchsorted(cumulative_weights, p)] for p in probs]

    df = GWR[GWR["country"] == country].copy()
    if df.empty:
        raise ValueError("No historical data for that country.")

    df["date"] = pd.to_datetime(df["last_updated"])
    date = pd.to_datetime(date_str)

    w = gaussian_weights(df["date"], date, sigma_days)

    # Temperature
    temp = df["temperature_celsius"].values
    pred_temp_c = weighted_mean(temp, w)
    temp_p50 = weighted_quantiles(temp, w, [0.25, 0.75])
    temp_p90 = weighted_quantiles(temp, w, [0.05, 0.95])

    # Rain
    rain_ind = (df["precip_mm"] > 0).astype(int)
    prob_rain = weighted_mean(rain_ind, w)
    rain_mm = weighted_mean(df["precip_mm"].values, w)

    # Wind
    wind = df["wind_kph"]
    prob_calm = weighted_mean((wind < 12).astype(int), w)
    prob_light_breeze = weighted_mean(((wind >= 12) & (wind < 28)).astype(int), w)
    prob_windy = weighted_mean(((wind >= 28) & (wind < 55)).astype(int), w)
    prob_gale = weighted_mean((wind >= 55).astype(int), w)

    # Air Quality
    aq = df["air_quality_gb-defra-index"]
    prob_low = weighted_mean(((aq >= 1) & (aq <= 3)).astype(int), w)
    prob_moderate = weighted_mean(((aq >= 4) & (aq <= 6)).astype(int), w)
    prob_high = weighted_mean(((aq >= 7) & (aq <= 9)).astype(int), w)
    prob_very_high = weighted_mean((aq >= 10).astype(int), w)
    pred_aq_index = weighted_mean(aq.values, w)

    summary = {
        "Country": country,
        "Date": date.date().isoformat(),
        "Pred_Temp_C": round(pred_temp_c, 1),
        "Temp_likely_min_C": round(temp_p50[0], 1),
        "Temp_likely_max_C": round(temp_p50[1], 1),
        "Temp_possible_min_C": round(temp_p90[0], 1),
        "Temp_possible_max_C": round(temp_p90[1], 1),
        "Prob_Rain_pct": round(100 * prob_rain, 1),
        "Pred_Rain_mm": round(rain_mm, 2),
        "Prob_Calm_pct": round(100 * prob_calm, 1),
        "Prob_LightBreeze_pct": round(100 * prob_light_breeze, 1),
        "Prob_Windy_pct": round(100 * prob_windy, 1),
        "Prob_Gale_pct": round(100 * prob_gale, 1),
        "AQ_Low_pct": round(100 * prob_low, 1),
        "AQ_Moderate_pct": round(100 * prob_moderate, 1),
        "AQ_High_pct": round(100 * prob_high, 1),
        "AQ_VeryHigh_pct": round(100 * prob_very_high, 1),
        "Pred_AQ_Index": round(pred_aq_index, 1),
    }

    # summary_wide = pd.DataFrame([summary])

    # summary_long = summary_wide.melt(
    #     id_vars=["Country", "Date"], var_name="Metric", value_name="Value"
    # )

    # return {"summary_wide": summary_wide, "summary_long": summary_long}
    return summary


def get_prediction(country, date_str, sigma_days=15):
    return model(GWR, country, date_str, sigma_days)


if __name__ == "__main__":
    print("Example")
    # --- Example usage ---
    res = model(GWR, "Japan", "2024-07-07")
    print(res)
    # print(res["summary_wide"])
    # print(res["summary_long"])
