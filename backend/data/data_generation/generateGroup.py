import random
from bson import ObjectId
import geonamescache
from datetime import datetime, timedelta
from operator import itemgetter
import numpy as np
def generate_group(num, users_oid):

    gc = geonamescache.GeonamesCache()
    country_list = gc.get_countries()
    country_list = [country_list[i]["name"] for i in country_list]

    group_id = [i for i in range(1, num + 1)]
    group_name = ["Team " + str(group_id[i]) for i in range(num)]

    member_count = [random.randint(1,5) for i in range(num)]

    members = []
    for i in range(num):
        members.append(random.sample(users_oid, member_count[i]))

    trip_summary = ["Trip to " + random.choice(country_list) for i in range(num)]

    messagess = []

    texts = ["Greetings","Hello","Hi",":)","Look forward to our trip"]
    for i in range(num):
        messages = []
        for j in range(member_count[i] // 2):
            message = {
            "user_oid": random.choice(users_oid),
            "text": random.choice(texts),
            "timestamp": (datetime.now() - timedelta(hours=random.randint(1,100))).isoformat()}

            messages.append(message)
        messages = sorted(messages, key=itemgetter('timestamp'), reverse=True)
        messagess.append(messages)

    groups = []
    for i in range(num):
        group = {
    "_id": {
      "$oid": ObjectId()
    },  
    "group_id": group_id[i],
    "group_name": group_name[i],
    "members": members[i],
    "trip_summary": trip_summary[i],
    "messages": messagess[i],
        }
        groups.append(group)

    return groups
