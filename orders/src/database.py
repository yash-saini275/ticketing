import motor.motor_asyncio
import os

client = motor.motor_asyncio.AsyncIOMotorClient(os.environ['MONGO_URI'])

db = client.orders

orders_collection = db.orders

tickets_collection = db.tickets
