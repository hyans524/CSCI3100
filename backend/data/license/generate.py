import json
import random
import string

def generate_license_key():
    characters = string.ascii_uppercase + string.digits
    segments = [
        ''.join(random.choice(characters) for _ in range(4))
        for _ in range(4)
    ]
    return '-'.join(segments)

license_keys = [generate_license_key() for _ in range(1000)]

with open('license_keys.json', 'w') as f:
    json.dump(license_keys, f, indent=4)
