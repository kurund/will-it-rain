import datetime
import json
import random
from typing import Union

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return json.dumps({"message": "Weather API"})


cache = {}

weather_categories = [
    "rainy",
    "cloudy",
    "snow",
    "sunny",
]


def get_result(date: str):
    request_date = datetime.datetime.now().date().isoformat()
    cache_key = f"{request_date}_{date}"

    if cache_key in cache.keys():
        return json.loads(cache[cache_key])

    result = {
        "date": date,
        "weather": weather_categories[random.randint(0, len(weather_categories) - 1)],
        "probability": round(random.random() * 100, 1),
    }

    cache[cache_key] = json.dumps(result)

    return result


@app.get("/weather")
def get_weather(location: Union[str, None] = None, date: Union[str, None] = None):
    if not location or not date:
        raise HTTPException(status_code=400, detail="Bad request")

    try:
        d = datetime.date.fromisoformat(date)
    except:
        raise HTTPException(status_code=400, detail="Bad date")

    data = get_result(date)
    return json.dumps(data)
