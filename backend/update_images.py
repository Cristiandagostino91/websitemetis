"""
Script per aggiornare il database con le immagini originali scaricate da centrometis.com
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os

# MongoDB connection
MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
DB_NAME = os.environ.get('DB_NAME', 'test_database')

# Base URL for scraped images
BASE_URL = os.environ.get('BASE_URL', 'https://admin-dashboard-919.preview.emergentagent.com')
IMAGES_PATH = "/api/uploads/scraped"

# Image mappings
PRODUCT_IMAGES = {
    "Omega 3 Premium": f"{BASE_URL}{IMAGES_PATH}/omega3.jpg",
    "Sali Minerali Complex": f"{BASE_URL}{IMAGES_PATH}/sali-minerali.jpg",
    "Vitamina D3": f"{BASE_URL}{IMAGES_PATH}/vitamina-d.jpg",
}

BLOG_IMAGES = {
    "Dieta chetogenica e fertilità": f"{BASE_URL}{IMAGES_PATH}/dieta-chetogenica.jpg",
    "Alimentazione sostenibile: il modello della dieta mediterranea": f"{BASE_URL}{IMAGES_PATH}/dieta-mediterranea.png",
    "La nutrizione per la fibromialgia": f"{BASE_URL}{IMAGES_PATH}/fibromialgia.jpg",
}

SERVICE_IMAGES = {
    "Consulenza Nutrizionale": f"{BASE_URL}{IMAGES_PATH}/dieta.jpg",
    "Bioterapia Nutrizionale": f"{BASE_URL}{IMAGES_PATH}/pesce-griglia.jpg",
    "Dieta Chetogenica": f"{BASE_URL}{IMAGES_PATH}/alimenti-grassi.jpg",
}

async def update_images():
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    
    print("Aggiornamento immagini prodotti...")
    for name, image_url in PRODUCT_IMAGES.items():
        result = await db.products.update_many(
            {"name": {"$regex": name, "$options": "i"}},
            {"$set": {"image": image_url}}
        )
        if result.modified_count > 0:
            print(f"  ✓ {name}: {result.modified_count} prodotti aggiornati")
    
    print("\nAggiornamento immagini blog...")
    for title, image_url in BLOG_IMAGES.items():
        result = await db.blog_posts.update_many(
            {"title": {"$regex": title[:30], "$options": "i"}},
            {"$set": {"image": image_url}}
        )
        if result.modified_count > 0:
            print(f"  ✓ {title[:40]}...: {result.modified_count} articoli aggiornati")
    
    print("\nAggiornamento immagini servizi...")
    for title, image_url in SERVICE_IMAGES.items():
        result = await db.services.update_many(
            {"title": {"$regex": title, "$options": "i"}},
            {"$set": {"image": image_url}}
        )
        if result.modified_count > 0:
            print(f"  ✓ {title}: {result.modified_count} servizi aggiornati")
    
    # Add some additional products with real images
    print("\nAggiunta/aggiornamento prodotti con immagini reali...")
    
    # Update existing products or add new ones
    products_to_update = [
        {
            "filter": {"name": {"$regex": "Omega", "$options": "i"}},
            "update": {
                "$set": {
                    "image": f"{BASE_URL}{IMAGES_PATH}/omega3.jpg",
                    "description": "Integratore alimentare a base di EPA e DHA. Contribuisce alla normale funzione cardiaca e al mantenimento della capacità visiva."
                }
            }
        },
        {
            "filter": {"name": {"$regex": "Sali", "$options": "i"}},
            "update": {
                "$set": {
                    "image": f"{BASE_URL}{IMAGES_PATH}/sali-minerali.jpg",
                    "description": "Integratore a base di Magnesio e Potassio. Contribuisce alla riduzione della stanchezza e dell'affaticamento."
                }
            }
        },
        {
            "filter": {"name": {"$regex": "Vitamina", "$options": "i"}},
            "update": {
                "$set": {
                    "image": f"{BASE_URL}{IMAGES_PATH}/vitamina-d.jpg",
                    "description": "Vitamina D3 in soluzione oleosa. Contribuisce al normale assorbimento del calcio e alla funzione del sistema immunitario."
                }
            }
        }
    ]
    
    for item in products_to_update:
        result = await db.products.update_many(item["filter"], item["update"])
        print(f"  Aggiornati {result.modified_count} prodotti")
    
    client.close()
    print("\n✅ Aggiornamento completato!")

if __name__ == "__main__":
    asyncio.run(update_images())
