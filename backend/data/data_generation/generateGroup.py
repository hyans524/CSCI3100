import random
from bson import ObjectId
from allcities import cities

def generate_group(num, users_oid):

    group_id = [i for i in range(1, num + 1)]
    group_name = ["Team " + str(group_id)]

    member_count = [random.randint(1,5) for i in range(num)]

    members = []
    for i in range(num):
        members.append(random.sample(users_oid, member_count[i]))

    