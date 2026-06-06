from fastapi import FastAPI
from .database import engine, Base
from .routers import tasks
import redis
import os

app = FastAPI()

Base.metadata.create_all(bind=engine)

redis_client = redis.Redis(
    host=os.getenv("REDIS_HOST"),
    password=os.getenv("REDIS_PASSWORD"),
    decode_responses=True
)

@app.get("/health")


def health():
    return {"status": "ok"}


app.include_router(tasks.router)
