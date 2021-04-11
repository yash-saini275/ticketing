# Orders Service
Orders service will create, reserve and delete the order.

# Endpoints
Prefix:- /api/orders

| Endpoint      | Methods Allowed |Required Parameters| Description                                               |
|:-------------:|:---------------:|:-----------------:|:---------------------------------------------------------:|
| /             | POST            |ticketid           |Creates the order and reserves the ticket with given id.   |
| /             | GET             |      -            |Returns all the reserved orders.                           |
| /:orderid     | GET             |orderid            |Returns the details of the order with the given id.        |
| /:orderid     | DELETE          |orderid            |Deletes the order with the given id.                       |

# Events
1. Listeners

|Event Name             | Description                                                                  |
|:---------------------:|:----------------------------------------------------------------------------:|
|expiration:complete    |Listen for expiration:completed event to expire the order and unreserve the ticket.|
|payment:created        |Listenes for payment:created event to confirm the payment of order.           |
|ticket:created         |Listenes for ticket:created event to create the ticket in the database.       |
|ticket:updated         |Listenes for ticket:updated event if the ticket is updated by ticket service and update inside orders database.|

2. Publisher

|Event Name          | Description                                                                   |
|:------------------:|:-----------------------------------------------------------------------------:|
|order:created       |Publishes the expiration:complete after the user presses the buy button to reserve the ticket.|
|order:cancelled     |Publishes the order:cancelled event if the user cancels the order or payment is not made with given time period.|