# Centro Metis - E-commerce Clone PRD

## Original Problem Statement
Creare una replica modernizzata e auto-gestibile del sito web `https://www.centrometis.com`. Requisiti chiave:
- Sistema e-commerce completo funzionante
- "Gestionale" (pannello admin) per gestire prodotti, servizi, prezzi, offerte, foto e articoli blog
- Assistenza per download progetto e push su GitHub personale
- Integrazione immagini originali dal sito scraping

## User Personas
- **Admin/Owner**: Proprietario del centro che gestisce contenuti, prezzi, ordini e prenotazioni
- **Customer**: Cliente che naviga, acquista prodotti e prenota servizi

## Tech Stack
- **Frontend**: React 18, React Router, TailwindCSS, Shadcn/UI
- **Backend**: FastAPI, Python
- **Database**: MongoDB (motor async driver)
- **Auth**: JWT (python-jose, passlib/bcrypt)

## Core Requirements

### ✅ Completed Features

#### Public Website (100% Complete)
- Homepage con hero, prodotti in evidenza, servizi
- Pagina Chi Siamo
- Catalogo Prodotti con filtri per categoria
- Catalogo Servizi
- Blog con articoli
- Pagina Contatti con form
- Carrello (localStorage)
- Checkout completo
- Sistema prenotazioni servizi

#### Admin Panel - "Gestionale" (100% Complete)
- [x] Sistema autenticazione JWT
- [x] Login admin sicuro (admin@centrometis.com / CentroMetis@2024!Admin)
- [x] Dashboard con statistiche: fatturato, ordini, prenotazioni, prodotti, servizi, blog
- [x] Gestione Prodotti: CRUD completo (lista, crea, modifica, elimina)
- [x] Gestione Servizi: CRUD completo
- [x] Gestione Blog: CRUD completo con stato pubblicato/bozza
- [x] Gestione Ordini: visualizzazione e cambio stato
- [x] Gestione Prenotazioni: visualizzazione e cambio stato
- [x] Upload immagini per prodotti/servizi/blog
- [x] Layout admin separato (senza navbar/footer del sito)

#### Backend APIs (100% Complete)
- `/api/auth/login` - Autenticazione admin
- `/api/auth/verify` - Verifica token
- `/api/auth/me` - Info utente corrente
- `/api/upload` - Upload file immagini
- `/api/products` - CRUD prodotti
- `/api/services` - CRUD servizi
- `/api/blog` - CRUD articoli blog
- `/api/orders` - Gestione ordini
- `/api/bookings` - Gestione prenotazioni
- `/api/contact` - Messaggi contatto
- `/api/orders-stats` - Statistiche dashboard

## Pending Tasks

### P1 - Alta Priorità
- [ ] Push codice su repository GitHub utente (richiede Personal Access Token)
- [ ] Scraping e integrazione immagini originali da centrometis.com

### P2 - Media Priorità
- [ ] Gestione messaggi contatto nell'admin
- [ ] Email notifiche per ordini e prenotazioni

### P3 - Bassa Priorità / Future
- [ ] Ottimizzazioni SEO
- [ ] Sistema notifiche push
- [ ] Report e analytics avanzati
- [ ] Integrazione pagamenti (Stripe/PayPal)

## Database Schema

```
products: {id, name, category, price, image, description, inStock, featured, createdAt, updatedAt}
services: {id, title, category, price, duration, description, image, createdAt, updatedAt}
orders: {id, orderNumber, items[], customer{}, shipping{}, total, status, createdAt, updatedAt}
bookings: {id, bookingNumber, serviceId, serviceName, servicePrice, date, time, customer{}, notes, status, createdAt, updatedAt}
blog_posts: {id, title, excerpt, content, author, date, image, category, published, createdAt, updatedAt}
contact_messages: {id, name, email, phone, message, status, createdAt}
```

## File Structure

```
/app
├── backend/
│   ├── auth.py          # JWT authentication
│   ├── models.py        # Pydantic models
│   ├── server.py        # FastAPI endpoints
│   ├── seed_db.py       # Database seeding
│   ├── uploads/         # Uploaded images
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── App.js
│   │   ├── components/
│   │   │   ├── ui/      # Shadcn components
│   │   │   ├── Navbar.jsx
│   │   │   └── Footer.jsx
│   │   ├── pages/
│   │   │   ├── Admin.jsx           # Main admin container
│   │   │   ├── admin/
│   │   │   │   ├── AdminLogin.jsx
│   │   │   │   ├── AdminDashboard.jsx
│   │   │   │   ├── ProductManager.jsx
│   │   │   │   ├── ServiceManager.jsx
│   │   │   │   ├── BlogManager.jsx
│   │   │   │   ├── OrderManager.jsx
│   │   │   │   └── BookingManager.jsx
│   │   │   └── [other pages]
│   │   └── services/api.js
│   └── package.json
└── memory/
    └── PRD.md
```

## Admin Credentials
- **Email**: admin@centrometis.com
- **Password**: CentroMetis@2024!Admin

## Test Coverage
- Backend: 100% (31/31 tests passed)
- Frontend: 100% (all CRUD operations tested)

---
*Last Updated: December 2025*
