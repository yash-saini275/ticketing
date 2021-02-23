from typing import Optional

from fastapi import FastAPI

app = FastAPI()


@app.get("/api/orders")
def read_root():
    return {"Orders": "Service"}


@app.get("/api/orders/{item_id}")
def read_item(item_id: int, q: Optional[str] = None):
    return {"item_id": item_id, "q": q}
