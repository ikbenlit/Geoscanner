# GEO Scanner v2.0

Een geavanceerde SEO analyse tool met tier-based feature gating en monetisatie.

## 🚀 Quick Start (Development)

### Minimale Setup
Voor development heb je alleen Firebase Auth nodig:

```bash
# 1. Clone en installeer dependencies
git clone <repository>
cd 06-geoscanner
npm install

# 2. Start development server
npm run dev

# 3. Test auth flow
# Ga naar: http://localhost:3000/test-auth
# Registreer account: test@example.com / password123
```

### ✅ Wat Werkt Nu (Mock Mode)
- **Firebase Auth**: Email/password registratie en login
- **Mock Database**: In-memory user data met credits
- **Auth Context**: Volledige state management
- **UI Components**: Auth modals, user menu, test interface
- **Credit System**: Mock credits (1 credit per user)

### 🔧 Mock Mode
De applicatie werkt automatisch in mock mode wanneer:
- `NODE_ENV === 'development'`
- `POSTGRES_URL` is niet geconfigureerd

**Console Output**:
```bash
🔥 Firebase config geladen, API key aanwezig: true
🔧 MOCK MODE: Creating mock user for auth sync
✅ Mock user created: { id: 1735123456789, email: "test@example.com" }
```

## 📋 Project Status

### ✅ Voltooid (Fase 1 & 2.1)
- **Database Schema**: Complete Postgres migraties
- **Firebase Auth**: Email/password + anonymous auth
- **Credit System**: Atomaire transacties met audit trail
- **Stripe Integration**: Volledige payment processing
- **Auth Middleware**: Server-side token verificatie
- **Mock Mode**: Development zonder database

### 🚧 In Ontwikkeling (Fase 2.2)
- **Tier-based Endpoints**: Gescheiden API's per tier
- **Feature Gating**: Plan-based access control
- **Dashboard**: Credit management interface

### 📁 Project Structuur

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API endpoints
│   │   ├── auth/sync/     # User synchronisation
│   │   ├── stripe/        # Payment processing
│   │   └── scan/          # Scan endpoints
│   ├── dashboard/         # Protected dashboard
│   └── test-auth/         # Auth testing interface
├── components/            # React components
│   ├── auth/             # Auth modals en forms
│   ├── payment/          # Stripe integration
│   └── ui/               # Shadcn/ui components
├── lib/                  # Core libraries
│   ├── auth-context.tsx  # Auth state management
│   ├── db/               # Database layer
│   ├── firebase/         # Firebase config
│   ├── middleware/       # Auth middleware
│   └── stripe/           # Payment processing
└── styles/               # Tailwind CSS
```

## 🧪 Testing

### Auth Flow Testing
```bash
# 1. Ga naar test interface
http://localhost:3000/test-auth

# 2. Registreer test account
Email: test@example.com
Password: password123

# 3. Verwachte output
✅ Auth Status: User ingelogd, authenticated
✅ Database User: Gesynchroniseerd met mock data
✅ User Details: test@example.com, free plan, 1 credit
```

### API Testing
```bash
# Test authenticated endpoint
curl -H "Authorization: Bearer <firebase_token>" \
     http://localhost:3000/api/test-auth

# Test auth sync
curl -X POST \
     -H "Content-Type: application/json" \
     -d '{"firebaseUid":"test","email":"test@example.com"}' \
     http://localhost:3000/api/auth/sync
```

## 🔧 Environment Setup

### Development (Minimaal)
Alleen Firebase client configuratie vereist:

```bash
# .env.local
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

### Production (Volledig)
Alle services vereist:
- Firebase Auth + Admin SDK
- Vercel Postgres database
- Stripe payment processing

Zie `docs/environment-setup.md` voor volledige configuratie.

## 📚 Documentatie

- **[Environment Setup](docs/environment-setup.md)** - Configuratie instructies
- **[Implementation Plan](docs/plan-tier-based-feature-gating.md)** - Gefaseerd ontwikkelplan
- **[Database Schema](src/lib/db/README.md)** - Database documentatie

## 🛠️ Development Commands

```bash
# Development server
npm run dev

# Database migraties (wanneer geconfigureerd)
npm run db:migrate
npm run db:status
npm run db:reset

# Type checking
npm run type-check

# Linting
npm run lint
```

## 🔍 Troubleshooting

### Firebase Auth Errors
- **"operation-not-allowed"**: Email/password provider niet ingeschakeld in Firebase Console
- **"invalid-api-key"**: Controleer `NEXT_PUBLIC_FIREBASE_API_KEY`

### Console Logs
Zoek naar deze indicators:
```bash
🔥 Firebase config geladen, API key aanwezig: true
🔧 MOCK MODE: Creating mock user for auth sync
✅ Database user synced: { plan_type: "free" }
```

### AI Assistant Beperkingen
- **Cursor/Claude**: Kan `.env.local` niet lezen vanwege beveiligingsrestricties
- **Oplossing**: Environment variabelen zijn wel correct geconfigureerd
- **Verificatie**: Check console logs voor configuratie status

## 📈 Roadmap

### Volgende Stappen (Fase 2.2)
1. **Dashboard Testing**: Ingelogde user functionaliteit
2. **Stripe Integration**: Payment flow met mock users
3. **Tier Endpoints**: Plan-based API access
4. **Feature Gating**: Complete tier enforcement

### Toekomstige Fasen
- **Fase 3**: Advanced scan features
- **Fase 4**: External API integrations
- **Fase 5**: Analytics en reporting

---

**Status**: Auth Flow Werkend ✅ | Mock Mode Actief 🔧 | Ready for Tier Implementation 🚀 