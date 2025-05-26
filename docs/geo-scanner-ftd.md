## GEO Scanner v2.0 – Functioneel & Technisch Ontwerp (FTD) – Afgerond

### 1. Overzicht

Dit document beschrijft de geoptimaliseerde functionele en technische specificaties voor de betaalde versie van GEO Scanner, met focus op de drie abonnements­tiern **Gratis**, **Starter** en **Pro**. Het doel is helderheid en overzichtelijkheid: wat valt onder welke tier, en welke endpoints, UI-flows en data­modellen zijn nodig.

---

### 2. Service­tiers & Feature Gating

| Feature                         | Gratis Tier                | Starter Tier (€19,95) | Pro Tier (€49,95)        |
| ------------------------------- | -------------------------- | --------------------- | ------------------------ |
| **Credits**                     | 1 scan, onbeperkt houdbaar | 2 scans               | 5 scans                  |
| **Aanmelding**                  | Anoniem                    | Account verplicht     | Account verplicht        |
| **Module Score Breakdown**      | Basis (overall + top3)     | Volledige 8 modules   | Volledige 8 modules + AI |
| **PDF Rapport**                 | ❌                          | ✅                     | ✅                        |
| **Email Rapport**               | ✅ (na email capture)       | ✅                     | ✅                        |
| **Scan Geschiedenis**           | ❌                          | 30 dagen              | 90 dagen                 |
| **Implementatie Suggesties**    | ❌                          | Basisregels           | AI-aangedreven roadmap   |
| **Code Snippets**               | ❌                          | ❌                     | ✅                        |
| **Impact Voorspellingen**       | ❌                          | ❌                     | ✅                        |
| **Concurrentie Benchmarking**   | ❌                          | ❌                     | ✅                        |
| **Dagelijkse re-scan + alerts** | ❌                          | ❌                     | ✅                        |

---

### 3. Functionaliteiten per Tier

#### 3.1 Gratis Tier

* **Scope**: snelle, anonieme website-check
* **Endpoint**: `POST /api/scan/anonymous`
* **Response**:

  * `overall_score` (0–100)
  * `top_issues[3]`
* **Flow**:

  1. URL invoer
  2. Validatie & bijhouden e-mailadres (optioneel)
  3. Uitvoeren basis­scan
  4. On-screen resultaten + e-mail opt-in voor PDF

#### 3.2 Starter Tier

* **Scope**: alle gratis­features + uitgebreid rapport
* **Endpoints**:

  * `POST /api/scan/authenticated` (verbruikt 1 credit)
  * `GET  /api/scan/history` (laatste 30 dagen)
  * `GET  /api/scan/{scanId}/pdf`
* **Response Extensions**:

  * `module_scores` (per module)
  * `suggestions_basic`
* **Flow**:

  1. Login/registratie
  2. Credit check & aftrek
  3. Diepgaande scan (8 modules)
  4. PDF-download + e-mail verzending
  5. Geschiedenisweergave 30 dagen

#### 3.3 Pro Tier

* **Scope**: volledige functionaliteit voor geavanceerde optimalisatie
* **Endpoints**:

  * Alle Starter endpoints
  * `POST /api/scan/{scanId}/ai-guide` (genereert implementatie roadmap)
  * `POST /api/scan/{scanId}/benchmark` (concurrentieanalyse)
  * `POST /api/subscriptions/rescan` (dagelijkse re-scan + alerts)
* **Response Extensions**:

  * `ai_suggestions` (LLM‑gegenereerde stappen)
  * `code_snippets`
  * `impact_predictions`
  * `benchmark_data`
* **Flow**:

  1. Login/registratie
  2. Credit check & aftrek
  3. AI‑enhanced scan
  4. AI‑roadmap + code
  5. Benchmarking over branche
  6. Dagelijkse monitoring + notificaties

---

### 4. Technische Architectuur & Data­modellen

#### 4.1 Authenticatie & Database Stack

**Authenticatie**: Firebase Auth
* Anonieme login voor gratis tier
* Email/password registratie voor betaalde tiers
* Firebase UID als primaire gebruikersidentificatie

**Database**: Hybrid Approach (Firebase Auth + Vercel Postgres)
* **Firebase Auth**: Gebruikersbeheer en authenticatie
* **Vercel Postgres**: Business data (credits, scans, transacties)
* **Koppeling**: Firebase UID als foreign key in Postgres tabellen

**Rationale**: 
* Firebase Auth biedt uitstekende authenticatie features
* Postgres nodig voor relationele integriteit van credit systeem
* ACID transacties vereist voor payment processing
* Complexe queries nodig voor rapportage en analytics

#### 4.2 Database Schema (Vercel Postgres)

```sql
-- Gebruikersbeheer
users (
  id SERIAL PRIMARY KEY,
  firebase_uid VARCHAR UNIQUE NOT NULL,
  email VARCHAR NOT NULL,
  plan_type ENUM('free','starter','pro') DEFAULT 'free',
  credits_remaining INTEGER DEFAULT 1,
  stripe_customer_id VARCHAR,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Credit Transacties (audit trail)
credit_transactions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  transaction_type ENUM('purchase','scan','refund') NOT NULL,
  credits_change INTEGER NOT NULL,
  stripe_payment_id VARCHAR,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Scan Resultaten
scan_results (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  url VARCHAR NOT NULL,
  overall_score INTEGER,
  module_scores JSON,
  ai_suggestions JSON,
  benchmark_data JSON,
  scan_tier VARCHAR NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP
);

-- Email Capture (gratis gebruikers)
email_leads (
  id SERIAL PRIMARY KEY,
  email VARCHAR NOT NULL,
  scan_id INTEGER REFERENCES scan_results(id),
  converted_to_paid BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  last_contacted TIMESTAMP
);
```

#### 4.3 Data Integriteit & Transacties

**Credit Operaties** (atomair):
```sql
BEGIN;
  UPDATE users SET credits_remaining = credits_remaining - 1 
  WHERE firebase_uid = $1 AND credits_remaining > 0;
  
  INSERT INTO credit_transactions (user_id, transaction_type, credits_change)
  VALUES ((SELECT id FROM users WHERE firebase_uid = $1), 'scan', -1);
COMMIT;
```

**Payment Processing** (webhook handling):
```sql
BEGIN;
  UPDATE users SET credits_remaining = credits_remaining + $credits
  WHERE stripe_customer_id = $customer_id;
  
  INSERT INTO credit_transactions (user_id, transaction_type, credits_change, stripe_payment_id)
  VALUES (...);
COMMIT;
```

---

### 5. API Endpoints & Auth

1. **Anonymous Scan**

   ```http
   POST /api/scan/anonymous
   Body: { url }
   ```
2. **Authenticated Scan**

   ```http
   POST /api/scan/authenticated
   Headers: Authorization: Bearer <token>
   Body: { url, tier }
   ```
3. **AI Guide (Pro)**

   ```http
   POST /api/scan/{scanId}/ai-guide
   ```
4. **Subscription & Monitoring (Pro)**

   ```http
   POST /api/subscriptions/rescan
   Body: { scanId, schedule: 'daily' }
   ```
5. **History & Exports**

   ```http
   GET /api/scan/history?days=30|90
   GET /api/scan/{scanId}/pdf
   ```

**Authenticatie**: Firebase Auth JWT tokens
* Frontend: Firebase Auth SDK voor login/logout
* Backend: Firebase Admin SDK voor token verificatie
* Autorisatie: Op basis van `plan_type` uit Postgres users tabel
* Session management: Firebase Auth state persistence

**API Authenticatie Flow**:
```typescript
// Backend middleware
const token = req.headers.authorization?.replace('Bearer ', '');
const decodedToken = await admin.auth().verifyIdToken(token);
const firebaseUid = decodedToken.uid;

// Haal gebruiker op uit Postgres
const user = await query('SELECT * FROM users WHERE firebase_uid = $1', [firebaseUid]);
```

---

### 6. UI Flow & Componenten

* **Homepage**: URL invoer + tier-select (aanmelding verplicht voor Starter/Pro)
* **Dashboard**: credit saldo, laatste scans, upgrade-aanbeveling
* **Scan Resultaat**:

  * Gratis: cirkelscore + top3
  * Starter: radar chart + module panels
  * Pro: radar chart + AI-roadmap tab + benchmark tab + notificatie setup
* **Settings**: beheer plan, credits bijkopen, monitoring toggles

---

### 7. Implementatie Prioriteiten

#### 7.1 Fase 1: Database & Auth Foundation
1. **Database schema implementatie** (Postgres migraties)
2. **Firebase Auth uitbreiding** (email/password naast anoniem)
3. **User sync systeem** (Firebase UID → Postgres users tabel)
4. **Credit systeem basis** (aftrek logica + transacties)

#### 7.2 Fase 2: Payment & Tier System  
1. **Stripe integratie** (checkout + webhooks)
2. **Tier-gebaseerde API endpoints** (anonymous vs authenticated)
3. **Feature gating middleware** (credit checks + plan validatie)
4. **PDF rapport generatie** (Starter/Pro tier)

#### 7.3 Fase 3: AI & Advanced Features
1. **OpenAI integratie** (Pro tier AI suggesties)
2. **Email systeem** (rapport bezorging + marketing)
3. **Monitoring & benchmarking** (Pro tier features)
4. **Dashboard UI** (credit saldo + scan geschiedenis)

#### 7.4 Technische Overwegingen
* **Firebase Admin SDK** nodig voor backend token verificatie
* **Database migraties** voor schema deployment
* **Error handling** voor payment failures en credit conflicts
* **Rate limiting** per tier (gratis: 1/dag, betaald: meer flexibel)

Met deze bijgewerkte FTD kun je direct aan de slag met de Firebase Auth + Postgres hybrid implementatie.
