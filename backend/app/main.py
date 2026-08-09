from fastapi import FastAPI

app = FastAPI(title="HealthOS API")


@app.get("/")
def root():
    return {"message": "HealthOS API is running"}