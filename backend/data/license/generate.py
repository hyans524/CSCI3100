import json
import random
import string
from bson import ObjectId

def generate_unique_license_key(existing_keys):
    while True:
        characters = string.ascii_uppercase + string.digits
        segments = [
            ''.join(random.choice(characters) for _ in range(4))
            for _ in range(4)
        ]
        key = '-'.join(segments)
        if key not in existing_keys:
            return key

def generate_license_entries(num_entries, user_object_ids):
    existing_keys = set()
    entries = []
    
    status_options = ['active', 'used', 'expired']
    
    for _ in range(num_entries):
        key = generate_unique_license_key(existing_keys)
        existing_keys.add(key)
        
        status = random.choice(status_options)
        issued_to = None
        if status == "used":
            issued_to = random.choice(user_object_ids)

        entry = {
            '_id': ObjectId(),
            'key': key,
            'status': status,
            'issued_to': issued_to
        }
        entries.append(entry)
    return entries

if __name__ == "__main__":
    user_ids = [
        ObjectId("67fba7d7cc439d8b22e006c6"),
        ObjectId("67fba7d7cc439d8b22e006c7"),
        ObjectId("67fba7d7cc439d8b22e006c8"),
        ObjectId("67fba7d7cc439d8b22e006c9"),
        ObjectId("67fba7d7cc439d8b22e006ca"),
        ObjectId("67fba7d7cc439d8b22e006cb"),
        ObjectId("67fba7d7cc439d8b22e006cc"),
        ObjectId("67fba7d7cc439d8b22e006cd"),
        ObjectId("67fba7d7cc439d8b22e006ce"),
        ObjectId("67fba7d7cc439d8b22e006cf")
    ]
    
    licenses = generate_license_entries(1000, user_ids)
    
    def json_serializer(obj):
        if isinstance(obj, ObjectId):
            return str(obj)
        raise TypeError(f"Object of type {obj.__class__.__name__} is not JSON serializable")
    
    with open('license_keys.json', 'w') as f:
        json.dump(licenses, f, default=json_serializer, indent=4)
