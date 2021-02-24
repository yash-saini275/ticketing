from pydantic import BaseModel
from datetime import datetime


class OrderModel(BaseModel):
    userId: str
    status: str
    expiresAt: datetime
    ticketId: str


class TicketModel(BaseModel):
    title: str
    price: str
    version: int


class OrderModelIn(BaseModel):
    status: str
    ticketId: str
