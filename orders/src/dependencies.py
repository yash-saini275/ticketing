import jwt
from fastapi import Cookie, HTTPException
from typing import Optional
import os


def isAuthenticated(jwt_token: Optional[str] = Cookie(None)):
    try:
        decoded = jwt.decode(
            jwt_token, os.environ['JWT_KEY'], algorithms='HS256')
        return decoded
    except jwt.InvalidSignatureError:
        raise HTTPException(status_code=403, detail='Not Authorized.')
