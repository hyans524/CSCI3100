#!/usr/bin/env python3
import json
import random
import os
from datetime import datetime, timedelta
from bson import ObjectId

# --- Configuration paths ---
HERE     = os.path.dirname(__file__)
DATA_DIR = os.path.abspath(os.path.join(HERE, os.pardir, "dummy_data")) + os.sep
UPLOADS  = os.path.abspath(os.path.join(HERE, os.pardir, os.pardir, "uploads")) + os.sep

# --- Pools for randomization ---
ADJECTIVES = [
    "vibrant", "breathtaking", "serene", "adventurous", "unforgettable",
    "scenic", "cultural", "immersive", "picturesque", "lively",
    "tranquil", "thrilling", "historic", "exotic", "luxurious"
]

POST_TEMPLATES = [
    "What an {adjective} journey to {destination}!",
    "Just had a {adjective} time exploring {destination}.",
    "{destination} was more {adjective} than I ever imagined!",
    "My trip to {destination} was truly {adjective}.",
    "If you love {adjective} adventures, you need to visit {destination}.",
    "Feeling so {adjective} after my stay in {destination}.",
    "{destination} delivered one {adjective} experience after another.",
    "Can't forget the {adjective} views in {destination}.",
    "From start to finish, {destination} was {adjective}.",
    "Exploring {destination} was a {adjective} delight!",
    "Dreaming of those {adjective} moments in {destination}.",
    "Truly {adjective} memories made at {destination}.",
    "{destination} exceeded all expectations—what a {adjective} trip!",
    "Who knew {destination} could be so {adjective}?",
    "Packing my bags for another {adjective} adventure in {destination}!"
]

COMMENT_POOL = [
    "That sounds amazing!",
    "Wow, I need to add that to my bucket list.",
    "How did you find the local food?",
    "I’ve heard great things about that place!",
    "Absolutely stunning—thanks for sharing.",
    "What was your favorite part?",
    "I can’t believe how {adjective} that must have been!",
    "Did you try any hidden gems there?",
    "Those photos must look incredible.",
    "Sounds like a dream getaway.",
    "How long did you stay?",
    "Did you meet any interesting people?",
    "I’m so jealous—tell me more!",
    "What time of year did you go?",
    "Would love to see your full itinerary."
]

def choose_adj():
    return random.choice(ADJECTIVES)

def pick_template(dest):
    tpl = random.choice(POST_TEMPLATES)
    return tpl.format(adjective=choose_adj(), destination=dest)

def iso_date(dt: datetime):
    return dt.date().isoformat()

# --- Load fixtures ---
with open(os.path.join(DATA_DIR, "user.json")) as f:
    users = json.load(f)
with open(os.path.join(DATA_DIR, "group.json")) as f:
    groups = json.load(f)
with open(os.path.join(DATA_DIR, "trip.json")) as f:
    trips = json.load(f)

# flatten user IDs
user_ids = [u["_id"]["$oid"] for u in users]

# map group_id → member list
group_members = {
    g["group_id"]: [m["$oid"] if isinstance(m, dict) else str(m) for m in g["members"]]
    for g in groups
}

posts = []
for trip in trips:
    # pick an author
    members = group_members.get(trip["group_id"], user_ids)
    author  = random.choice(members)

    # parse dates or fallback
    try:
        start = datetime.fromisoformat(trip["start_date"])
        end   = datetime.fromisoformat(trip["end_date"])
    except:
        start = datetime.now() - timedelta(days=random.randint(10, 365))
        end   = start + timedelta(days=random.randint(3, 14))

    # likes & comments
    likers = [u for u in user_ids if u != author]
    likes  = random.sample(likers, k=random.randint(1, min(3, len(likers))))
    comments = []
    for _ in range(random.randint(0,2)):
        cuser = random.choice([u for u in user_ids if u != author])
        cdate = start + timedelta(days=random.randint(0, max((end-start).days,1)))
        tpl   = random.choice(COMMENT_POOL)
        text  = tpl.format(adjective=choose_adj()) if "{adjective}" in tpl else tpl
        comments.append({"user_id": cuser, "text": text, "date": cdate.isoformat()})

    # budget normalization
    raw_bud = trip.get("budget", 1000)
    if isinstance(raw_bud, str) and raw_bud in ['0-1000','1001-2000','2001-3000','3001+']:
        budget_lbl = raw_bud
    else:
        budget_lbl = next(lab for lo,hi,lab in [
            (0,1000,"0-1000"),
            (1001,2000,"1001-2000"),
            (2001,3000,"2001-3000"),
            (3001,float("inf"),"3001+")
        ] if lo <= int(raw_bud) <= hi)

    # image path
    img_name = f"dummy_{trip['destination']}.jpeg"
    img_path = os.path.join(UPLOADS, img_name)
    if os.path.isfile(img_path):
        image_field = f"/uploads/{img_name}"
    else:
        image_field = None


    # build post record
    post = {
        "_id":        {"$oid": str(ObjectId())},
        "user_id":    author,
        "trip_oid":   trip["_id"]["$oid"],
        "text":       pick_template(trip["destination"]),
    }
    if image_field:
        post["image"] = image_field
    post.update({
        "location":   trip["destination"],
        "budget":     budget_lbl,
        "activities": trip.get("activity", []) or trip.get("activities", []),
        "start_date": iso_date(start),
        "end_date":   iso_date(end),
        "likes":      likes,
        "comments":   comments
    })

    posts.append(post) 

# write out
output_path = os.path.join(DATA_DIR, "post.json")
with open(output_path, "w") as f:
    json.dump(posts, f, indent=2)
print(f"Wrote {len(posts)} posts to {output_path}")