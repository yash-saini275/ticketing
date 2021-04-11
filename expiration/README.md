# Expiration Service
Expiration Services expires the order after certain time if the payment is not made within that time. It is necessary to unreserve the reserved ticket so that other users can place order for that ticket.

# Endpoints
It is not exposed to outer world. This service is used internally.

# Events
1. Listener

|Event Name          | Description                                                                  |
|:------------------:|:----------------------------------------------------------------------------:|
|order:created       |Listenes for order created event to start the expiration timer for that order.|

2. Publisher

|Event Name          | Description                                                                   |
|:------------------:|:-----------------------------------------------------------------------------:|
|expiration:complete |Publishes the expiration:complete after the reservation time period is elapsed.|
