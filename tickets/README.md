# Tickets Service
Tickets service will create, modify and reserve the tickets.

# Endpoints
Prefix:- /api/tickets

| Endpoint      | Methods Allowed |Required Parameters| Description                                               |
|:-------------:|:---------------:|:-----------------:|:---------------------------------------------------------:|
| /             | POST            |title and price    |Create a new ticket.                                       |
| /             | GET             | -                 |Get all the tickets.                                       |
| /:id          | GET             |id                 |Get the ticket with given id.                              |
| /:id          | PUT             |id, title and price|Update the tickets title and price with given id.          |


# Events
1. Listeners

|Event Name             | Description                                                                  |
|:---------------------:|:----------------------------------------------------------------------------:|
|order:created          |Listen for order:created to create the payment for that order.|
|order:cancelled        |Listenes for order:cancelled event to cancel the payment for the order.           |

2. Publisher

|Event Name          | Description                                                                   |
|:------------------:|:-----------------------------------------------------------------------------:|
|ticket:created      |Publishes the ticket:created when a new ticket is created.                     |
|ticket:updated      |Publishes the ticket:updated when a new ticket is updated.                     |