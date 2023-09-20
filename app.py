import json
import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")
DB_NAME = 'coverland_data_edited'
COLLECTION_NAME = 'product_lists'

def insert_data_into_mongodb(data):
    """Insert data into MongoDB."""
    client = MongoClient(MONGODB_URI)
    try:
        db = client[DB_NAME]
        collection = db[COLLECTION_NAME]
        # Insert each object in the array as separate documents in the collection
        collection.insert_many(data)
        print('Data inserted successfully!')
    except Exception as insert_error:
        print('Error inserting data:', insert_error)
    finally:
        client.close()

if __name__ == "__main__":
    with open('./json/mini_data_set.json', 'r') as file:
        try:
            data = json.load(file)
            insert_data_into_mongodb(data)
            print("ARRAY LENGTH:", len(data))
        except json.JSONDecodeError as json_error:
            print('Error parsing JSON:', json_error)
        except Exception as file_error:
            print('Error reading the file:', file_error)
