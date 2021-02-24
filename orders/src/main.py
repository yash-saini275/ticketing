from fastapi import FastAPI

from .orders import routes

app = FastAPI()

app.include_router(routes.orderRouter)
