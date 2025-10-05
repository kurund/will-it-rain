suppressPackageStartupMessages({
    library(dplyr)
    library(lubridate)
    library(tidyr)
    library(tibble)
})

# --- Load & prep (keep as you had) ---
GWR <- read.csv("GlobalWeatherRepository.csv")

GWR <- GWR %>%
    mutate(
        last_updated = as.Date(last_updated),
        month = month(last_updated),
        season = case_when(
            month %in% c(12, 1, 2)  ~ "Winter",
            month %in% c(3, 4, 5)   ~ "Spring",
            month %in% c(6, 7, 8)   ~ "Summer",
            month %in% c(9, 10, 11) ~ "Autumn",
            TRUE ~ NA_character_
        ),
        season = factor(season, levels = c("Winter","Spring","Summer","Autumn"))
    )

# --- Main wrapper (note argument order: GWR, country, date) ---
model <- function(GWR, country, date) {
    # ---------- helpers ----------
    gaussian_weights <- function(dates, target_date, sigma_days = 15) {
        doy    <- yday(as.Date(dates))
        target <- yday(as.Date(target_date))
        delta  <- abs(doy - target)
        delta  <- pmin(delta, 365 - delta)
        exp(-(delta^2) / (2 * sigma_days^2))
    }
    wtd_mean <- function(x, w) {
        ok <- is.finite(x) & is.finite(w)
        if (!any(ok)) return(NA_real_)
        sum(w[ok] * x[ok]) / sum(w[ok])
    }
    wtd_quantiles <- function(x, w, probs = c(0.25, 0.75)) {
        ok <- is.finite(x) & is.finite(w)
        x  <- x[ok]; w <- w[ok]
        if (!length(x)) return(rep(NA_real_, length(probs)))
        o  <- order(x); x <- x[o]; w <- w[o]
        cw <- cumsum(w) / sum(w)
        sapply(probs, function(p) {
            idx <- which(cw >= p)[1]
            if (is.na(idx)) return(NA_real_)
            x[idx]
        })
    }
    
    # ---------- core ----------
    predict_weather_summary <- function(GWR, country, date, sigma_days = 15) {
        df <- GWR %>%
            dplyr::filter(country == !!country) %>%
            mutate(date = as.Date(last_updated))
        
        if (nrow(df) == 0) stop("No historical data for that country.")
        
        w <- gaussian_weights(df$date, as.Date(date), sigma_days)
        
        # Temperature
        temp <- df$temperature_celsius
        pred_temp_c <- wtd_mean(temp, w)
        temp_p50 <- wtd_quantiles(temp, w, c(0.25, 0.75))
        temp_p90 <- wtd_quantiles(temp, w, c(0.05, 0.95))
        
        # Rain
        rain_ind  <- as.numeric(df$precip_mm > 0)
        prob_rain <- wtd_mean(rain_ind, w)
        rain_mm   <- wtd_mean(df$precip_mm, w)
        
        # Wind categories
        wind <- df$wind_kph
        prob_calm        <- wtd_mean(as.numeric(wind < 12), w)
        prob_lightbreeze <- wtd_mean(as.numeric(wind >= 12 & wind < 28), w)
        prob_windy       <- wtd_mean(as.numeric(wind >= 28 & wind < 55), w)
        prob_gale        <- wtd_mean(as.numeric(wind >= 55), w)
        
        # AQ (DEFRA categories)
        aq <- df$air_quality_gb.defra.index
        prob_low       <- wtd_mean(as.numeric(aq >= 1  & aq <= 3), w)
        prob_moderate  <- wtd_mean(as.numeric(aq >= 4  & aq <= 6), w)
        prob_high      <- wtd_mean(as.numeric(aq >= 7  & aq <= 9), w)
        prob_veryhigh  <- wtd_mean(as.numeric(aq >= 10), w)
        pred_aq_index  <- wtd_mean(aq, w)
        
        tibble(
            Country = country,
            Date = as.Date(date),
            Pred_Temp_C           = round(pred_temp_c, 1),
            Temp_likely_min_C     = round(temp_p50[1], 1),
            Temp_likely_max_C     = round(temp_p50[2], 1),
            Temp_possible_min_C   = round(temp_p90[1], 1),
            Temp_possible_max_C   = round(temp_p90[2], 1),
            
            Prob_Rain_pct         = round(100 * prob_rain, 1),
            Pred_Rain_mm          = round(rain_mm, 2),
            
            Prob_Calm_pct         = round(100 * prob_calm, 1),
            Prob_LightBreeze_pct  = round(100 * prob_lightbreeze, 1),
            Prob_Windy_pct        = round(100 * prob_windy, 1),
            Prob_Gale_pct         = round(100 * prob_gale, 1),
            
            AQ_Low_pct            = round(100 * prob_low, 1),
            AQ_Moderate_pct       = round(100 * prob_moderate, 1),
            AQ_High_pct           = round(100 * prob_high, 1),
            AQ_VeryHigh_pct       = round(100 * prob_veryhigh, 1),
            Pred_AQ_Index         = round(pred_aq_index, 1)
        )
    }
    
    out <- predict_weather_summary(GWR, country, as.Date(date))
    
    summary_long <- out %>%
        pivot_longer(
            cols = -c(Country, Date),
            names_to = "Metric",
            values_to = "Value"
        )
    
    # Return both
    return(list(
        summary_wide = out,
        summary_long = summary_long
    ))
}

# --- Example: your call now works ---
# res <- model(GWR, "Japan", "2024-07-07")
# res$summary_wide
# res$summary_long
