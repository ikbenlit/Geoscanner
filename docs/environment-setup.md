# Environment Setup - GEO Scanner v2.0

Dit document beschrijft alle benodigde environment variabelen voor GEO Scanner v2.0.

## Overzicht

GEO Scanner gebruikt verschillende services die configuratie vereisen:
- **Firebase Auth**: Voor gebruikersauthenticatie
- **Vercel Postgres**: Voor database opslag (optioneel in development)
- **Stripe**: Voor payment processing

## Development vs Production

### Development Mode (Mock Mode)
In development mode werkt de applicatie automatisch in "mock mode" wanneer:
- `NODE_ENV === 'development'`
- `POSTGRES_URL` is niet geconfigureerd

**Mock Mode Features**:
- ✅ Firebase Auth werkt volledig (email/password + anonymous)
- ✅ Mock database users (geen echte database vereist)
- ✅ Mock credit systeem
- ✅ Alle UI componenten functioneel
- ⚠️ Stripe vereist nog configuratie voor payment testing

### Production Mode
Voor productie zijn alle environment variabelen vereist.

## Environment Variabelen

> **⚠️ Opmerking voor AI Assistenten**: 
> Dit project heeft een `.env.local` bestand met alle benodigde environment variabelen correct geconfigureerd. 
> AI assistenten (zoals Claude in Cursor) kunnen dit bestand niet lezen vanwege standaard beveiligingsrestricties, 
> maar de configuratie is wel aanwezig en werkend voor de applicatie.

### Firebase Auth (Client-side - Public) ✅ GECONFIGUREERD
```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

### Firebase Admin (Server-side - Private) ⚠️ OPTIONEEL IN DEVELOPMENT
```bash
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your_project.iam.gserviceaccount.com
```

> **Development Note**: Firebase Admin SDK is niet vereist in mock mode. Auth sync werkt zonder server-side token verificatie.

### Database (Vercel Postgres) ⚠️ OPTIONEEL IN DEVELOPMENT
```bash
POSTGRES_URL=postgres://username:password@host:port/database
POSTGRES_PRISMA_URL=postgres://username:password@host:port/database?pgbouncer=true&connect_timeout=15
POSTGRES_URL_NON_POOLING=postgres://username:password@host:port/database
POSTGRES_USER=username
POSTGRES_HOST=host
POSTGRES_PASSWORD=password
POSTGRES_DATABASE=database
```

> **Development Note**: Zonder `POSTGRES_URL` werkt de app in mock mode met in-memory user data.

### Stripe Payment Processing ⚠️ VEREIST VOOR PAYMENTS
```bash
# Stripe API Keys
STRIPE_SECRET_KEY=sk_test_... # of sk_live_... voor productie
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_... # of pk_live_... voor productie

# Stripe Price IDs (maak deze aan in Stripe Dashboard)
STRIPE_STARTER_PRICE_ID=price_1234567890abcdef
STRIPE_PRO_PRICE_ID=price_0987654321fedcba
STRIPE_EXTRA_CREDIT_PRICE_ID=price_abcdef1234567890

# Stripe Webhook Secret (voor webhook endpoint verificatie)
STRIPE_WEBHOOK_SECRET=whsec_1234567890abcdef...

# App URLs (voor Stripe redirect)
NEXT_PUBLIC_APP_URL=http://localhost:3000 # of https://yourdomain.com voor productie
```

## Quick Start (Development)

### Minimale Setup voor Development
Voor development heb je alleen Firebase Auth nodig:

1. **Firebase Client Config** (vereist):
   ```bash
   NEXT_PUBLIC_FIREBASE_API_KEY=...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
   NEXT_PUBLIC_FIREBASE_APP_ID=...
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Test auth flow**:
   - Ga naar `http://localhost:3000/test-auth`
   - Registreer een account met email/password
   - Verificeer dat mock user data wordt getoond

### Volledige Setup voor Production

Voor productie configureer alle services zoals beschreven in de secties hieronder.

## Setup Instructies

### 1. Firebase Setup ✅ VOLTOOID

1. **Maak een Firebase project aan**:
   - Ga naar [Firebase Console](https://console.firebase.google.com/)
   - Maak een nieuw project aan
   - Schakel Authentication in
   - **✅ Email/Password provider ingeschakeld**
   - **✅ Anonymous provider ingeschakeld**

2. **Haal client configuratie op**:
   - Ga naar Project Settings > General
   - Scroll naar "Your apps" en klik "Add app" (Web)
   - **✅ Config waarden toegevoegd aan `.env.local`**

3. **Service account** (optioneel voor development):
   - Ga naar Project Settings > Service Accounts
   - Klik "Generate new private key"
   - Download het JSON bestand
   - Kopieer de waarden naar je `.env.local`

### 2. Database Setup ⚠️ OPTIONEEL

1. **Vercel Postgres** (voor productie):
   - Ga naar je Vercel dashboard
   - Maak een nieuwe Postgres database aan
   - Kopieer de connection strings naar je `.env.local`

2. **Run migraties** (wanneer database geconfigureerd):
   ```bash
   npm run db:migrate
   ```

### 3. Stripe Setup ⚠️ VOOR PAYMENTS

1. **Maak Stripe account aan**:
   - Ga naar [Stripe Dashboard](https://dashboard.stripe.com/)
   - Maak een account aan (gebruik test mode voor development)

2. **Haal API keys op**:
   - Ga naar Developers > API Keys
   - Kopieer Publishable key en Secret key

3. **Maak producten en prijzen aan**:
   ```bash
   # Starter Pack - €19.95
   # Pro Pack - €49.95  
   # Extra Credit - €9.95
   ```
   - Ga naar Products in Stripe Dashboard
   - Maak 3 producten aan met bovenstaande prijzen
   - Kopieer de Price IDs naar je environment variabelen

4. **Configureer webhook**:
   - Ga naar Developers > Webhooks
   - Maak een nieuwe webhook aan voor je app URL: `/api/stripe/webhook`
   - Selecteer events: `checkout.session.completed`, `payment_intent.succeeded`, `payment_intent.payment_failed`
   - Kopieer de webhook secret

## Huidige Status

### ✅ Werkend in Development
- **Firebase Auth**: Email/password registratie en login
- **Mock Database**: In-memory user data met credits
- **Auth Context**: Volledige state management
- **UI Components**: Auth modals, test pagina's
- **Auth Sync**: Automatische user synchronisatie

### ⚠️ Nog Te Configureren
- **Stripe Integration**: Voor credit purchases
- **Production Database**: Voor persistente data
- **Firebase Admin SDK**: Voor server-side token verificatie

### 🧪 Test Endpoints
- `/test-auth` - Auth flow testing
- `/dashboard` - Protected route testing
- `/api/auth/sync` - User synchronisation

## Verificatie

Test je setup met:

1. **Firebase Auth**: 
   ```bash
   # Ga naar http://localhost:3000/test-auth
   # Registreer account: test@example.com / password123
   # Verwacht: ✅ Auth Status: User ingelogd, authenticated
   ```

2. **Mock Database**: 
   ```bash
   # Check console logs voor:
   # ✅ Mock user created: { id: ..., email: test@example.com }
   ```

3. **Auth Sync**:
   ```bash
   # Check console logs voor:
   # ✅ Database user synced: { plan_type: 'free', credits_remaining: 1 }
   ```

## Console Logs Verificatie

De applicatie toont uitgebreide console logs voor debugging:

### Firebase Status
```bash
🔥 Firebase config geladen, API key aanwezig: true
🔥 Firebase app geïnitialiseerd: true
🔥 Firebase auth geïnitialiseerd: true
```

### Auth Sync Process
```bash
🔄 Syncing database user for: [firebase_uid]
📤 Sending sync request with data: { firebaseUid, email, displayName }
📥 Sync response status: 200
✅ Database user synced: { id, email, plan_type, credits_remaining }
```

### Mock Mode Indicators
```bash
🔧 MOCK MODE: Creating mock user for auth sync
✅ Mock user created: { id: [timestamp], firebase_uid, email, plan_type: 'free' }
```

## Troubleshooting

### Firebase Auth Errors
- **"operation-not-allowed"**: Email/password provider niet ingeschakeld in Firebase Console
- **"invalid-api-key"**: Controleer `NEXT_PUBLIC_FIREBASE_API_KEY`
- **Console check**: Zoek naar "🔥 Firebase" logs voor configuratie status

### Auth Sync Errors
- **"JSON parse error"**: ✅ Opgelost met betere error handling
- **"Invalid token"**: ✅ Opgelost door mock mode implementatie
- **Mock mode**: Werkt automatisch zonder database/Firebase Admin SDK

### Development vs Production
- **Development**: Mock mode actief, minimale configuratie vereist
- **Production**: Alle environment variabelen vereist
- **Transitie**: Voeg `POSTGRES_URL` toe om mock mode uit te schakelen

### AI Assistant Beperkingen
- **Cursor/Claude**: Kan `.env.local` bestanden niet lezen vanwege beveiligingsrestricties
- **Oplossing**: Environment variabelen zijn wel correct geconfigureerd in het project
- **Verificatie**: Check console logs voor configuratie status

Voor meer hulp, zie de individuele service documentatie. 