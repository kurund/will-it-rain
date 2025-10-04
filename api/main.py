import json
from typing import Union

from fastapi import FastAPI

app = FastAPI()


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/weather")
def get_weather(location: Union[str, None] = None, date: Union[str, None] = None):
    data = {
        "precipitation": 4,
        "temperature": 17,
    }
    return json.dumps(data)
