import bcrypt
import random
from bson import ObjectId

def generate_user(num):

    language_list = ["English",
                 "Chinese",
                 "French",
                 "Spanish",
                 "Arabic",
                 "Korean",
                 "Cantonese",
                 "Japanese",
                 "Russian",
                 "German"]

    lowercase = "abcdefghijklmnopqrstuvwxyz"

    gender_list = ["Male", "Female"]

    is_Admin_distribution = [False for i in range(9)]
    is_Admin_distribution.append(True)

    user_id = [i for i in range(1, num + 1)]

    username = [random.choice(lowercase) + str(id) for id in user_id]
    password = [str(id).encode('ASCII') for id in user_id]
    password = [bcrypt.hashpw(pw, bcrypt.gensalt(10)) for pw in password]

    age = [random.randint(18, 70) for i in range(num)]

    email = [(username[i] + "@abc.com") for i in range(num)]

    phone = ["+852 "+(str(random.randint(0, 99999999)).zfill(8)) for id in user_id]

    language = [random.choice(language_list) for id in user_id]

    gender = [random.choice(gender_list) for id in user_id]

    is_Admin = [random.choice(is_Admin_distribution) for id in user_id]
    users = []
    for i in range(num):
        user = {
    "_id": {
      "$oid": ObjectId()
    },  
    "user_id": user_id[i],
    "username": username[i],
    "email": email[i],
    "password": password[i].decode(),
    "age": age[i],
    "gender": gender[i],
    "language": language[i],
    "phone": phone[i],
    "isAdmin": is_Admin[i]
        }
        users.append(user)

    return users

def extract_user_oid(users):

    oid = []
    for i in range(len(users)):
        oid.append(users[i]["_id"]["$oid"])

    return oid

