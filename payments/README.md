# Payments Service
Paymenta service makes the payment for the created orders.

# Endpoints
Prefix:- /api/payments

| Endpoint      | Methods Allowed |Required Parameters| Description                                               |
|:-------------:|:---------------:|:-----------------:|:---------------------------------------------------------:|
| /             | POST            |token and orderid  |Makes the payment for the order with given id.             |


# Events
1. Listeners

|Event Name             | Description                                                                  |
|:---------------------:|:----------------------------------------------------------------------------:|
|order:created          |Listen for order:created to create the payment for that order.|
|order:cancelled        |Listenes for order:cancelled event to cancel the payment for the order.           |

2. Publisher

|Event Name          | Description                                                                   |
|:------------------:|:-----------------------------------------------------------------------------:|
|payment:created     |Publishes the payment:created after the user successfully makes the payment.   |