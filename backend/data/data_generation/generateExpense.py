import random
from bson import ObjectId
import geonamescache
from datetime import datetime, timedelta
from operator import itemgetter
import numpy as np

def generate_expense(Groups):

    expenses = []
    kinds = ['Food', 'Transport', 'Accommodation', 'Recreation', 'Other']
    for i in range(len(Groups)):
        group_id = Groups[i]["_id"]["$oid"]
        for j in range(random.randint(2, 10)):
            amount = random.randint(0,999) + random.randint(0,99) / 100
            paid_by = Groups[i]["members"][random.randint(0, len(Groups[i]["members"]) - 1)]
            category = random.choice(kinds)
            date = (datetime.now() + timedelta(hours=random.randint(100,200))).isoformat()
            date = date[0:10]
            description = "Partial Expected Bill for " + category

            expense = {
                    "_id": {
      "$oid": ObjectId()
    },  
                "group_id": group_id,
                "paid_by": paid_by,
                "amount": amount,
                "category": category,
                "description": description,
                "date": date
            }

            expenses.append(expense)

    return expenses