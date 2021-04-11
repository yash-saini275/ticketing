# Auth Service
Manages the User Profile and User's session.

# Endpoints
Prefix: - /api/users

| Endpoint      | Methods Allowed |Required Parameters| Description                                   |
|:-------------:|:---------------:|:-----------------:|:---------------------------------------------:|
| /currentUser  | GET             |        -          |To get the details of currently logged in user.|
| /signin       | POST            |email and password |To login to account.                           |
| /signout      | POST            |        -          |To logout the user.                            |
| /signup       | POST            |email and password |Create a new user account.                     |