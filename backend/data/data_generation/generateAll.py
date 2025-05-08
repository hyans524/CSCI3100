import json
from bson import ObjectId

from generateUser import generate_user, extract_user_oid
from generateLicense import generate_license_entries

def json_serializer(obj):
    if isinstance(obj, ObjectId):
        return str(obj)
    raise TypeError(f"Object of type {obj.__class__.__name__} is not JSON serializable")

users = generate_user(10)
user_oid = extract_user_oid(users)

with open('./backend/data/initial_data/user.json', 'w') as f:
    json.dump(users, f, default=json_serializer, indent=4)

licenses = generate_license_entries(1000)

with open('./backend/data/initial_data/license.json', 'w') as f:
    json.dump(licenses, f, default=json_serializer, indent=4)