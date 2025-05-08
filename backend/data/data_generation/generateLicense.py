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

def generate_license_entries(num_entries):
    existing_keys = set()
    entries = []

    for _ in range(num_entries):
        key = generate_unique_license_key(existing_keys)
        existing_keys.add(key)
        
        entry = {
            '_id': ObjectId(),
            'key': key,
        }
        entries.append(entry)
    return entries


