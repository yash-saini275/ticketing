from ..database import orders_collection
from .models import OrderModelIn
from datetime import datetime, timedelta


async def create_order_service(order: OrderModelIn, userId: str):
    newOrder = {}
    newOrder['ticketId'] = order.ticketId
    newOrder['status'] = 'pending'
    newOrder['expiresAt'] = datetime.now() + timedelta(minutes=15)
    newOrder['userId'] = userId
    result = await orders_collection.insert_one(newOrder)
    return result
