import bcrypt
import random


password = b'123'
hashed_password = bcrypt.hashpw(password, bcrypt.gensalt(10))

print(hashed_password)