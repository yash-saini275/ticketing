# Ticketing
A backend API for booking tickets for events which is highly scalable and build on Microservices Architecture. The API follows the Restful pattern.

# Introduction
Ticketing application backend is build on Microservices Architecture that makes it highly scalable and can easily implement DevOps pipelines on this project.
The complete application is built in Typescript and uses MongoDB as database.
Their are total 6 services that work independently of each other:
1. **Auth**: - User and User's sesstion management.
2. **Expiration**: - Expires the ticket reservation after certain period if payment is not made on time.
3. **Orders**: - Manages the user's orders like creation, updation and deletion.
4. **Payments**: - Manages the payment of the order.
5. **Tickets**: - Manages the tickets like creation, updation and deletion.
6. **NATS Streaming Server**: - Manages data consistency across services.

# Deployment
All services [deployment](/infra/k8s) files will make sure that all the services are up and running on a kubernetes cluster.
