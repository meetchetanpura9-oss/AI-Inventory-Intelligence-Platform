from datetime import date, timedelta

FESTIVAL_DEFAULTS = [
    {
        "name": "New Year",
        "month": 1,
        "day": 1,
        "duration": 1,
        "category": "General",
        "increase": 1.25,
        "affected_categories": ["Beverages", "Snacks", "Chocolates", "Dairy"]
    },
    {
        "name": "Republic Day",
        "month": 1,
        "day": 26,
        "duration": 1,
        "category": "National",
        "increase": 1.10,
        "affected_categories": ["Snacks", "Beverages"]
    },
    {
        "name": "Holi",
        "month": 3,
        "day": 3, # March 3 for 2026
        "duration": 1,
        "category": "Religious",
        "increase": 1.50,
        "affected_categories": ["Sweets", "Snacks", "Dairy", "Colors"]
    },
    {
        "name": "Eid",
        "month": 3,
        "day": 20, # March 20 for 2026
        "duration": 2,
        "category": "Religious",
        "increase": 1.60,
        "affected_categories": ["Meat", "Dry Fruits", "Sweets", "Dairy"]
    },
    {
        "name": "Independence Day",
        "month": 8,
        "day": 15,
        "duration": 1,
        "category": "National",
        "increase": 1.10,
        "affected_categories": ["Snacks", "Beverages"]
    },
    {
        "name": "Raksha Bandhan",
        "month": 8,
        "day": 28, # Aug 28 for 2026
        "duration": 1,
        "category": "Religious",
        "increase": 1.45,
        "affected_categories": ["Sweets", "Dry Fruits", "Gift Boxes"]
    },
    {
        "name": "Janmashtami",
        "month": 9,
        "day": 3, # Sept 3 for 2026
        "duration": 1,
        "category": "Religious",
        "increase": 1.30,
        "affected_categories": ["Dairy", "Butter", "Sweets"]
    },
    {
        "name": "Ganesh Chaturthi",
        "month": 9,
        "day": 14, # Sept 14 for 2026
        "duration": 3,
        "category": "Religious",
        "increase": 1.55,
        "affected_categories": ["Sweets", "Decorations", "Flowers", "Oil"]
    },
    {
        "name": "Navratri",
        "month": 10,
        "day": 11, # Oct 11 to 19 for 2026
        "duration": 9,
        "category": "Religious",
        "increase": 1.40,
        "affected_categories": ["Fruits", "Dairy", "Oil", "Sweets"]
    },
    {
        "name": "Diwali",
        "month": 11,
        "day": 8, # Nov 8 for 2026
        "duration": 5,
        "category": "Religious",
        "increase": 2.80, # +180%
        "affected_categories": ["Dry Fruits", "Sweets", "Oil", "Decorations", "Lights", "Gift Boxes", "Dairy"]
    },
    {
        "name": "Christmas",
        "month": 12,
        "day": 25,
        "duration": 2,
        "category": "Religious",
        "increase": 1.40,
        "affected_categories": ["Bakery", "Sweets", "Chocolates", "Beverages"]
    }
]

def get_festivals_for_year(year: int) -> list:
    festivals = []
    for f in FESTIVAL_DEFAULTS:
        start_date = date(year, f["month"], f["day"])
        end_date = start_date + timedelta(days=f["duration"] - 1)
        festivals.append({
            "name": f["name"],
            "start_date": start_date,
            "end_date": end_date,
            "category": f["category"],
            "expected_increase": f["increase"],
            "affected_categories": f["affected_categories"]
        })
    return festivals
