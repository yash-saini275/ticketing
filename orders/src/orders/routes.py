from fastapi import APIRouter, Depends, Body, Cookie
from typing import Optional
from ..dependencies import isAuthenticated
from .services import create_order_service
from .models import OrderModelIn

orderRouter = APIRouter(
    tags=['orders'],
    dependencies=[Depends(isAuthenticated)]
)


@orderRouter.post('/api/orders')
async def create_order(
        order: OrderModelIn = Body(...),
        jwt_token: Optional[str] = Cookie(None)
):
    userId = isAuthenticated(jwt_token=jwt_token)
    await create_order_service(order, userId['id'])
    return 'Order Reserved Successfully'
