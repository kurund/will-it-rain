import pandas as pd
import numpy as np


GWR = pd.read_csv("GlobalWeatherRepository.csv", parse_dates=["last_updated"])


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


def model(GWR, country, date_str, sigma_days=15):
    def gaussian_weights(dates, target_date, sigma_days=15):
        doy = dates.dt.dayofyear
        target = target_date.timetuple().tm_yday
        delta = np.abs(doy - target)
        delta = np.minimum(delta, 365 - delta)  # 年跨ぎを考慮
        return np.exp(-(delta**2) / (2 * sigma_days**2))

    def wtd_mean(x, w):
        x = np.asarray(x, dtype=float)
        w = np.asarray(w, dtype=float)
        mask = np.isfinite(x) & np.isfinite(w)
        if not np.any(mask):
            return np.nan
        return np.sum(w[mask] * x[mask]) / np.sum(w[mask])

    def wtd_quantiles(x, w, probs=[0.25, 0.75]):
        x = np.asarray(x, dtype=float)
        w = np.asarray(w, dtype=float)
        mask = np.isfinite(x) & np.isfinite(w)
        x = x[mask]
        w = w[mask]
        if len(x) == 0:
            return [np.nan] * len(probs)
        order = np.argsort(x)
        x = x[order]
        w = np.array(w)[order]
        cw = np.cumsum(w) / np.sum(w)
        return [x[np.searchsorted(cw, p)] for p in probs]

    # weighted mode for condition_text
    def weighted_mode(values, weights):
        dfm = pd.DataFrame({"v": values, "w": weights})
        if dfm.empty or dfm["w"].sum() == 0:
            return np.nan
        grp = dfm.groupby("v", dropna=False)["w"].sum()
        if grp.empty:
            return np.nan
        return grp.idxmax()

    # --- descriptive mappers ---
    def temp_class_c(t):
        if not np.isfinite(t):
            return np.nan
        if t <= 0:
            return "Freezing"
        if t <= 7:
            return "Cold"
        if t <= 15:
            return "Cool"
        if t <= 22:
            return "Mild"
        if t <= 28:
            return "Warm"
        return "Hot"

    def wind_class_kph(k):
        if not np.isfinite(k):
            return np.nan
        if k < 12:
            return "Calm/Light"
        if k < 20:
            return "Light Breeze"
        if k < 28:
            return "Breezy"
        if k < 39:
            return "Windy"
        if k < 55:
            return "Strong Breeze"
        return "Gale"

    def wet_class_mm(mm):
        if not np.isfinite(mm) or mm <= 0:
            return "Dry"
        if mm < 0.2:
            return "Drizzle"
        if mm < 1.0:
            return "Light Rain"
        if mm < 5.0:
            return "Moderate Rain"
        if mm < 20.0:
            return "Heavy Rain"
        return "Very Heavy Rain"

    def aq_class_defra(aqi):
        if not np.isfinite(aqi):
            return np.nan
        if 1 <= aqi <= 3:
            return "Low"
        if 4 <= aqi <= 6:
            return "Moderate"
        if 7 <= aqi <= 9:
            return "High"
        if aqi >= 10:
            return "Very High"
        return np.nan

    def cloud_desc(pct):
        if not np.isfinite(pct):
            return None
        if pct < 20:
            return "clear"
        if pct < 50:
            return "partly cloudy"
        if pct < 80:
            return "mostly cloudy"
        return "overcast"

    df = GWR[GWR["country"] == country].copy()
    if df.empty:
        raise ValueError("No historical data for that country.")

    df["date"] = pd.to_datetime(df["last_updated"])
    date = pd.to_datetime(date_str)

    w = gaussian_weights(df["date"], date, sigma_days)

    # --- Temperature ---
    temp = df["temperature_celsius"].values
    pred_temp_c = wtd_mean(temp, w)
    temp_p50 = wtd_quantiles(temp, w, [0.25, 0.75])
    temp_p90 = wtd_quantiles(temp, w, [0.05, 0.95])

    # --- Rain ---
    rain_ind = (df["precip_mm"] > 0).astype(int)
    prob_rain = wtd_mean(rain_ind, w)
    rain_mm = wtd_mean(df["precip_mm"].values, w)

    # --- Wind ---
    wind = df["wind_kph"].values
    prob_calm = wtd_mean((wind < 12).astype(int), w)
    prob_lightbreeze = wtd_mean(((wind >= 12) & (wind < 28)).astype(int), w)
    prob_windy = wtd_mean(((wind >= 28) & (wind < 55)).astype(int), w)
    prob_gale = wtd_mean((wind >= 55).astype(int), w)
    pred_wind_kph = wtd_mean(wind, w)

    # --- Air Quality ---
    aq = df["air_quality_gb-defra-index"].values
    prob_low = wtd_mean(((aq >= 1) & (aq <= 3)).astype(int), w)
    prob_moderate = wtd_mean(((aq >= 4) & (aq <= 6)).astype(int), w)
    prob_high = wtd_mean(((aq >= 7) & (aq <= 9)).astype(int), w)
    pred_aq_index = wtd_mean(aq, w)
    prob_very_high = wtd_mean((aq >= 10).astype(int), w)

    # --- Feels-like & Cloud (for descriptives) ---
    pred_feels_c = (
        wtd_mean(df["feels_like_celsius"].values, w)
        if "feels_like_celsius" in df.columns
        else np.nan
    )
    pred_cloud_pct = (
        wtd_mean(df["cloud"].values, w) if "cloud" in df.columns else np.nan
    )

    # --- Predicted condition_text via weighted mode ---
    pred_condition = (
        weighted_mode(df["condition_text"], w)
        if "condition_text" in df.columns
        else np.nan
    )

    # --- Classes & headline ---
    t_for_feel = pred_feels_c if np.isfinite(pred_feels_c) else pred_temp_c
    temp_cls = temp_class_c(t_for_feel)
    wind_cls = wind_class_kph(pred_wind_kph)
    wet_cls = wet_class_mm(rain_mm)
    aq_cls = aq_class_defra(pred_aq_index)
    cloud_phrase = cloud_desc(pred_cloud_pct)

    # Build a concise, human-friendly headline
    parts = []
    if temp_cls:
        parts.append(temp_cls)
    if wind_cls and wind_cls not in ["Calm/Light", None]:
        parts.append(wind_cls.lower())
    if wet_cls and wet_cls != "Dry":
        parts.append(wet_cls.lower())
    headline_core = ", ".join(parts) if parts else "Typical"
    aq_tail = f" — {aq_cls.lower()} air pollution" if isinstance(aq_cls, str) else ""
    cloud_tail = f". Likely: {cloud_phrase}" if isinstance(cloud_phrase, str) else ""
    cond_tail = f" ({pred_condition})" if isinstance(pred_condition, str) else ""

    pred_headline = f"{headline_core}{aq_tail}{cloud_tail}{cond_tail}"

    # Helper function to safely round values
    def safe_round(value, decimals):
        return None if not np.isfinite(value) else round(value, decimals)

    summary = {
        "Country": country,
        "Date": date.date().isoformat(),
        "Pred_Temp_C": safe_round(pred_temp_c, 1),
        "Temp_likely_min_C": safe_round(temp_p50[0], 1),
        "Temp_likely_max_C": safe_round(temp_p50[1], 1),
        "Temp_possible_min_C": safe_round(temp_p90[0], 1),
        "Temp_possible_max_C": safe_round(temp_p90[1], 1),
        "Prob_Rain_pct": safe_round(100 * prob_rain, 1),
        "Pred_Rain_mm": safe_round(rain_mm, 2),
        "Prob_Calm_pct": safe_round(100 * prob_calm, 1),
        "Prob_LightBreeze_pct": safe_round(100 * prob_lightbreeze, 1),
        "Prob_Windy_pct": safe_round(100 * prob_windy, 1),
        "Prob_Gale_pct": safe_round(100 * prob_gale, 1),
        "Pred_Wind_kph": safe_round(pred_wind_kph, 1),
        "AQ_Low_pct": safe_round(100 * prob_low, 1),
        "AQ_Moderate_pct": safe_round(100 * prob_moderate, 1),
        "AQ_High_pct": safe_round(100 * prob_high, 1),
        "AQ_VeryHigh_pct": safe_round(100 * prob_very_high, 1),
        "Pred_AQ_Index": safe_round(pred_aq_index, 1),
        "Pred_FeelsLike_C": safe_round(t_for_feel, 1),
        "Pred_Cloud_pct": safe_round(pred_cloud_pct, 0),
        "Pred_Condition": pred_condition if isinstance(pred_condition, str) else None,
        "Pred_Temp_Class": temp_cls if isinstance(temp_cls, str) else None,
        "Pred_Wind_Class": wind_cls if isinstance(wind_cls, str) else None,
        "Pred_Wet_Class": wet_cls if isinstance(wet_cls, str) else None,
        "Pred_AQ_Class": aq_cls if isinstance(aq_cls, str) else None,
        "Pred_Headline": pred_headline if isinstance(pred_headline, str) else None,
    }

    return summary

    # summary_wide = pd.DataFrame([summary])

    # summary_long = summary_wide.melt(id_vars=["Country", "Date"], var_name="Metric", value_name="Value")

    # return {
    #     "summary_wide": summary_wide,
    #     "summary_long": summary_long
    # }


# res = model(GWR, "United Kingdom", "2025-07-07")
# print(res["summary_wide"])
# print(res["summary_long"])


def get_prediction(country, date_str, sigma_days=15):
    return model(GWR, country, date_str, sigma_days)


if __name__ == "__main__":
    print("Example")
    # --- Example usage ---
    res = model(GWR, "Japan", "2024-07-07")
    print(res)
    # print(res["summary_wide"])
    # print(res["summary_long"])
