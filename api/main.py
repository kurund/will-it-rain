import datetime
import json
from typing import Union

from fastapi import FastAPI, HTTPException

app = FastAPI()


@app.get("/")
def read_root():
    return json.dumps({"message": "Weather API"})


@app.get("/weather")
def get_weather(location: Union[str, None] = None, date: Union[str, None] = None):
    if not location or not date:
        raise HTTPException(status_code=400, detail="Bad request")

    try:
        d = datetime.date.fromisoformat(date)
    except:
        raise HTTPException(status_code=400, detail="Bad date")

    data = {
        "date": d.isoformat(),
        "precipitation": 4,
        "temperature": 17,
    }
    return json.dumps(data)
