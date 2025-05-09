import random
from bson import ObjectId
import geonamescache
from datetime import datetime, timedelta
from operator import itemgetter
import numpy as np


def generate_trip(Groups):

    trips = []
    num = len(Groups)
    activities = ["Hiking",
                  "Visit Temple",
                  "Visit Museum",
                  "Dining",
                  "Biking",
                  "Sightseeing",
                  "Diving",
                  "Swimming",
                  "Staying in Resort"]

    destinations = [] 
    start_date = []
    end_date = []
    budget = []
    activity = []
    group_id = []
    for i in range(num):
        destinations.append(Groups[i]["trip_summary"][8:])
        group_id.append(Groups[i]["group_id"])
        budget.append(random.randrange(1000, 10000, step=100))
        activity.append(random.sample(activities, len(Groups[i]["members"]) // 2 + 1))

        start_time = (datetime.now() + timedelta(hours=random.randint(1,1000)))
        start_date.append(start_time.isoformat())
        end_date.append((start_time + timedelta(hours=random.randint(20, 200))).isoformat())

        trip = {
                "_id": {
      "$oid": ObjectId()
    },  
    "destination": destinations[i],
    "group_id": group_id[i],
    "budget": budget[i],
    "activity": activity[i],
    "start_date": start_date[i],
    "end_date": end_date[i],
        }
        
        trips.append(trip)
    
    return trips

