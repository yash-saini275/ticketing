# infra/k8s
Their are all the kubernetes deployment files that makes sure that all the services are up and running.

# Deployments
1. **auth-depl**:- Deploys the authentication service.
2. **expiration-depl**:- Deploys the expiration service.
3. **expiration-redis-depl**:- Deploys the redis server for expiration service.
4. **ingress-srv**:- Nginx reverse proxy that send the requests to their respective services for processing.
5. **mongo-depl**:- Mongo Database deployment.
6. **nats-depl**:- NATS Streaming server to maintain data consistency across services.
7. **orders-depl**:- Deploys the orders service.
8. **payments-depl**:- Deploys the payments service.