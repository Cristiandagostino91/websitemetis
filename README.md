# Centro Metis - E-commerce & Gestionale

E-commerce completo per studio nutrizionale con sistema di prenotazioni, vendita integratori e gestionale amministrativo.

## 🚀 Tecnologie

- **Frontend**: React 19 + Tailwind CSS + shadcn/ui
- **Backend**: FastAPI (Python)
- **Database**: MongoDB
- **State Management**: React Context API
- **UI Components**: shadcn/ui

## 📋 Funzionalità

### Frontend Cliente
- 🏠 Homepage con hero section e sezioni dinamiche
- 🛍️ Catalogo prodotti con filtro ricerca
- 🏥 Servizi nutrizionali con prenotazione online
- 📅 Sistema prenotazioni con calendario e slot orari
- 🛒 Carrello acquisti con localStorage
- 💳 Checkout e gestione ordini
- 📝 Blog con articoli
- 📞 Form contatti
- 📱 Design responsive

### Backend Gestionale
- 📊 Dashboard con statistiche real-time
- 📦 Gestione CRUD prodotti (nome, prezzo, foto, disponibilità, featured)
- 🏥 Gestione CRUD servizi
- 📋 Gestione ordini con cambio stati
- 📅 Gestione prenotazioni con conferma/annulla
- ✍️ Gestione blog con editor
- 💬 Gestione messaggi contatti
- 🔍 Query MongoDB ottimizzate con paginazione

## 🛠️ Installazione

### Prerequisiti
- Node.js 18+
- Python 3.10+
- MongoDB 6.0+
- Yarn

### 1. Clone Repository
```bash
git clone https://github.com/Cristiandagostino91/websitemetis.git
cd websitemetis
```

### 2. Setup Backend

```bash
cd backend

# Crea virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
# oppure
venv\Scripts\activate  # Windows

# Installa dipendenze
pip install -r requirements.txt

# Configura .env
cp .env.example .env
# Modifica .env con i tuoi valori:
# MONGO_URL="mongodb://localhost:27017"
# DB_NAME="centro_metis"
# CORS_ORIGINS="http://localhost:3000"

# Popola database con dati iniziali
python seed_db.py

# Avvia backend
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

### 3. Setup Frontend

```bash
cd frontend

# Installa dipendenze
yarn install

# Configura .env
cp .env.example .env
# Modifica .env:
# REACT_APP_BACKEND_URL=http://localhost:8001

# Avvia frontend
yarn start
```

### 4. Accedi all'applicazione

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8001
- **API Docs**: http://localhost:8001/docs
- **Admin Panel**: http://localhost:3000/admin

## 📁 Struttura Progetto

```
websitemetis/
├── frontend/                # React Application
│   ├── src/
│   │   ├── components/     # Componenti riutilizzabili
│   │   ├── pages/          # Pagine dell'app
│   │   ├── context/        # React Context
│   │   ├── services/       # API calls
│   │   └── App.js
│   ├── package.json
│   └── .env
│
├── backend/                 # FastAPI Application
│   ├── server.py           # Main API server
│   ├── models.py           # Pydantic models
│   ├── seed_db.py          # Database seeding
│   ├── requirements.txt    # Python dependencies
│   └── .env
│
└── README.md              # This file
```

## 🔌 API Endpoints

### Products
- `GET /api/products` - Lista prodotti
- `POST /api/products` - Crea prodotto
- `PUT /api/products/{id}` - Aggiorna prodotto
- `DELETE /api/products/{id}` - Elimina prodotto

### Services
- `GET /api/services` - Lista servizi
- `POST /api/services` - Crea servizio
- `PUT /api/services/{id}` - Aggiorna servizio
- `DELETE /api/services/{id}` - Elimina servizio

### Orders
- `GET /api/orders` - Lista ordini
- `POST /api/orders` - Crea ordine
- `PUT /api/orders/{id}` - Aggiorna stato ordine
- `GET /api/orders-stats` - Statistiche ordini

### Bookings
- `GET /api/bookings` - Lista prenotazioni
- `POST /api/bookings` - Crea prenotazione
- `PUT /api/bookings/{id}` - Aggiorna stato
- `GET /api/bookings-available/{date}` - Slot disponibili

### Blog
- `GET /api/blog` - Lista articoli
- `POST /api/blog` - Crea articolo
- `PUT /api/blog/{id}` - Aggiorna articolo
- `DELETE /api/blog/{id}` - Elimina articolo

## 🚀 Deployment Produzione

### Build Frontend
```bash
cd frontend
yarn build
```

### Deploy su hosting
- Carica build React su hosting statico
- Configura backend su VPS/cloud
- Usa MongoDB Atlas per database
- Configura CORS e environment variables

## 📞 Supporto

**Centro Metis**
- Email: info@centrometis.it
- Tel: +39 0828 52615

---

**Versione**: 1.0.0  
**Sviluppato con**: Emergent AI
