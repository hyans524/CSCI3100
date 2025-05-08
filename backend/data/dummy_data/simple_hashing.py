import bcrypt

password = 123
hashed_password = bcrypt.hashpw(password, 10)

print(hashed_password)