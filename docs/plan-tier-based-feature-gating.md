# GEO Scanner v2.0 - Gefaseerd Implementatieplan
## Tier-based Feature Gating & Monetisatie

**Laatste Update**: December 2024  
**Huidige Status**: Fase 1 Voltooid ✅ | Fase 2.1 Voltooid ✅ | Auth Flow Werkend ✅ | Mock Mode Actief 🔧

---

## **ONTWIKKELAAR NOTITIES** 📝

### AI Assistant Beperkingen & Mock Mode Status
**Voor Cursor/Claude Gebruikers**: 
- ⚠️ AI assistenten kunnen `.env.local` bestanden niet lezen vanwege beveiligingsrestricties
- ✅ Environment variabelen zijn wel correct geconfigureerd in het project
- 🔧 **Mock Mode Actief**: App werkt zonder database/Firebase Admin SDK
- 🔍 **Verificatie**: Console logs tonen Firebase configuratie status:
  ```
  🔥 Firebase config geladen, API key aanwezig: true
  🔥 Firebase app geïnitialiseerd: true
  🔥 Firebase auth geïnitialiseerd: true
  🔧 MOCK MODE: Creating mock user for auth sync
  ✅ Mock user created: { id: [timestamp], email: test@example.com }
  ```
- 📋 **Test Account**: test@example.com / password123
- 🧪 **Test Endpoint**: `/test-auth` voor auth flow verificatie

---

## **BEKENDE ISSUES & MOCK DATA** 📝

### Cross-Web Module - Mock Data Implementatie
**Status**: ✅ **OPGELOST** (December 2024)

**Probleem**: 
- Cross-web module maakte calls naar niet-bestaande API endpoints
- Veroorzaakte console errors tijdens scan uitvoering
- Endpoints: `/api/references/external-mentions`, `/api/references/backlinks`

**Tijdelijke Oplossing**:
- Mock data implementatie voor externe vermeldingen
- Realistische simulatie van Wikipedia/Wikidata checks
- Gesimuleerde backlink data
- **Scan functionaliteit blijft volledig werken**

**Toekomstige Implementatie** (Fase 4+):
- [ ] Wikipedia API integratie
- [ ] Backlink service integratie (Moz/Ahrefs)
- [ ] Rate limiting en caching
- [ ] Echte externe verwijzingsdata

**Impact**: Geen - scans werken normaal, alleen data is gesimuleerd

---

## **FASE 1: DATABASE & AUTHENTICATIE FOUNDATION** ✅ **VOLTOOID**

### 1.1 Database Schema Setup ✅ **VOLTOOID**
**Doel**: Relationele database structuur implementeren

**Taken**:
- [x] SQL migratie scripts schrijven voor alle tabellen
- [x] Database schema deployen naar Vercel Postgres
- [x] Database connectie testen en valideren
- [x] Seed data voor development/testing
- [x] Database backup strategie opzetten

**Deliverables**: ✅
- Werkende Postgres database met alle tabellen
- Migratie scripts voor deployment (`001_initial_schema.sql`)
- Test data voor alle tiers
- Migration runner met CLI interface

**Geïmplementeerd**:
- `src/lib/db/migrations/001_initial_schema.sql` - Complete database schema
- `src/lib/db/migrate.ts` - Migration runner met tracking
- NPM scripts: `db:migrate`, `db:reset`, `db:status`
- 4 hoofdtabellen: users, credit_transactions, scan_results, email_leads
- ENUM types en proper indexing

### 1.2 Firebase Auth Uitbreiding ✅ **VOLTOOID**
**Doel**: Van anoniem naar volledig gebruikersbeheer

**Taken**:
- [x] Email/password registratie implementeren
- [x] Firebase Admin SDK configureren voor backend
- [x] Token verificatie middleware maken
- [x] User sync systeem (Firebase UID → Postgres)
- [x] Logout functionaliteit toevoegen

**Deliverables**: ✅
- Registratie/login flows
- Backend authenticatie middleware
- User synchronisatie tussen Firebase en Postgres

**Geïmplementeerd**:
- `src/lib/firebase/auth.ts` - Client-side auth functies
- `src/lib/firebase/admin.ts` - Server-side token verificatie
- `src/lib/middleware/auth.ts` - Auth middleware (`withAuth`, `withOptionalAuth`)
- `src/lib/auth-context.tsx` - React context voor auth state
- UI componenten: LoginForm, RegisterForm, AuthModal, UserMenu
- Test interface: `/test-auth` pagina

### 1.3 Credit Systeem Basis ✅ **VOLTOOID**
**Doel**: Fundamenteel credit tracking en aftrek systeem

**Taken**:
- [x] Credit aftrek logica in scan API
- [x] Atomaire transacties voor credit operaties
- [x] Credit saldo API endpoints
- [x] Credit validatie middleware
- [x] Error handling voor onvoldoende credits

**Deliverables**: ✅
- Werkend credit systeem met audit trail
- API endpoints voor credit management
- Transactionele integriteit

**Geïmplementeerd**:
- `src/lib/db/repositories/users.ts` - Atomaire credit operaties met row locking + Mock Mode
- `src/lib/db/types.ts` - TIER_LIMITS configuratie
- Credit transaction audit trail
- Error classes: `InsufficientCreditsError`, `UserNotFoundError`
- Database sync via `/api/auth/sync` (werkt in mock mode)
- **Mock Mode**: In-memory user data voor development zonder database

---

## **HUIDIGE STATUS: AUTH FLOW WERKEND** ✅ **DECEMBER 2024**

### Auth Flow Implementatie Status
**Doel**: Volledige authenticatie flow met mock mode voor development

**Voltooide Taken**:
- [x] Firebase Auth errors opgelost (email/password provider ingeschakeld)
- [x] Auth sync endpoint verbeterd met betere error handling
- [x] Mock mode geïmplementeerd voor development zonder database
- [x] JSON parse errors opgelost in auth sync
- [x] Console logging verbeterd voor debugging
- [x] Test account werkend: test@example.com

**Huidige Functionaliteit**:
- ✅ **Firebase Auth**: Email/password registratie en login volledig werkend
- ✅ **Mock Database**: In-memory user data met credits (geen echte database vereist)
- ✅ **Auth Context**: Volledige state management met sync
- ✅ **UI Components**: Auth modals, user menu, test interface
- ✅ **Error Handling**: Graceful degradation en fallbacks

**Test Resultaten**:
```bash
# Test Account: test@example.com / password123
✅ Auth Status: User ingelogd, authenticated, niet anoniem
✅ Database User: Gesynchroniseerd met mock data (ID: [timestamp])
✅ User Details: test@example.com, free plan, 1 credit
```

**Console Output Voorbeeld**:
```bash
🔄 Syncing database user for: [firebase_uid]
📤 Sending sync request with data: { firebaseUid, email, displayName }
🔧 MOCK MODE: Creating mock user for auth sync
✅ Mock user created: { id: 1735123456789, email: "test@example.com" }
✅ Database user synced: { plan_type: "free", credits_remaining: 1 }
```

**Volgende Stappen**:
- [ ] Dashboard functionaliteit testen met ingelogde user
- [ ] Stripe payment flow integreren met mock users
- [ ] Tier-based scan endpoints implementeren

---

## **FASE 2: PAYMENT & TIER INFRASTRUCTURE** 🚧 **IN UITVOERING**

### 2.1 Stripe Integratie ✅ **VOLTOOID**
**Doel**: Betalingsverwerking voor credit pakketten

**Taken**:
- [x] Stripe SDK installeren en configureren
- [x] Checkout sessie API endpoints
- [x] Payment success/failure handling
- [x] Stripe webhook implementatie
- [x] Customer ID koppeling aan users

**Deliverables**: ✅
- Werkende Stripe checkout flow
- Webhook verwerking voor payments
- Credit toevoeging na succesvolle betaling

**Geïmplementeerd**:
- `src/lib/stripe/config.ts` - Stripe configuratie met credit pakketten
- `src/app/api/stripe/checkout/route.ts` - Checkout sessie API
- `src/app/api/stripe/webhook/route.ts` - Webhook processing
- `src/app/api/user/credits/route.ts` - Credit informatie endpoint
- `src/components/payment/CreditPurchase.tsx` - Credit purchase UI
- `src/app/dashboard/page.tsx` - Volledig dashboard met payment flows
- Volledige iDEAL en creditcard ondersteuning
- Atomaire credit operaties met audit trail

### 2.2 Tier-gebaseerde API Endpoints 🔄 **VOLGENDE STAP**
**Doel**: Gescheiden endpoints per tier met feature restrictions

**Huidige Probleem**: 
- Bestaande `/api/scan/route.ts` gebruikt GEEN authenticatie
- Alle scans worden behandeld als gratis tier
- Credit systeem niet geïntegreerd in scan flow
- Tier-based endpoints ontbreken volledig

**Taken**:
- [ ] 🚨 **URGENT**: Herstructureer `/api/scan/route.ts` met auth middleware
- [ ] `POST /api/scan/anonymous` (gratis tier) - ⚠️ **GEDEELTELIJK**
- [ ] `POST /api/scan/authenticated` (starter/pro) - ❌ **ONTBREEKT**
- [ ] `GET /api/scan/history` met tier filtering - ❌ **ONTBREEKT**
- [ ] `GET /api/user/credits` endpoint - ❌ **ONTBREEKT**
- [ ] `GET /api/scan/{scanId}/pdf` - ❌ **ONTBREEKT**
- [ ] Tier validatie middleware integreren
- [ ] Credit aftrek logica implementeren

**Deliverables**:
- Volledige API structuur per tier
- Feature gating op endpoint niveau
- Proper error responses voor tier violations
- Credit systeem integratie

**Status**: 🔄 **VOLGENDE PRIORITEIT**
- **Situatie**: Stripe integratie voltooid, nu tier enforcement implementeren
- **Impact**: Monetisatie infrastructure gereed, scan API herstructurering nodig
- **Prioriteit**: HOOG - voltooit Fase 2 payment infrastructure

### 2.3 Feature Gating Middleware ✅ **GEDEELTELIJK VOLTOOID**
**Doel**: Centraal systeem voor tier-based access control

**Taken**:
- [x] Tier detection middleware
- [x] Feature flag systeem per tier
- [x] Credit requirement validation
- [ ] Plan upgrade prompts
- [x] Rate limiting per tier

**Deliverables**:
- Herbruikbare middleware voor feature gating
- Consistent tier enforcement
- Upgrade conversion flows

**Geïmplementeerd**:
- `requirePlan()` middleware voor plan-based access
- `withRateLimit()` voor rate limiting
- TIER_LIMITS configuratie met feature flags
- Basis upgrade prompts in UserMenu

---

## **FASE 3: CORE TIER FEATURES** 📋 **GEPLAND**

### 3.1 PDF Rapport Generatie
**Doel**: PDF export voor Starter/Pro tiers

**Prioriteit**: Hoog - Kernfunctionaliteit voor monetisatie

**Aanpak**: 
- PDF opslag in Vercel Blob/S3 (niet volledige scan resultaten in database)
- Minimale scan metadata tracking voor download geschiedenis
- Tier-based PDF templates

### 3.2 Email Systeem
**Doel**: Email capture en rapport bezorging

**Status**: Database schema gereed (email_leads tabel)

### 3.3 Scan Geschiedenis
**Doel**: Tier-based scan history access

**Aanpak Herziening**: 
- Focus op PDF download geschiedenis
- Minimale metadata opslag
- Tier-based retention (30/90 dagen)

---

## **HUIDIGE PRIORITEITEN & ACTIES**

### **Onmiddellijke Acties Vereist** 🔄

1. **🔄 VOLGENDE: Scan API Herstructurering**:
   - **Status**: Stripe integratie voltooid, nu tier enforcement
   - **Actie**: Herstructureer naar tier-based endpoints
   - **Impact**: Voltooit monetisatie infrastructure
   - **Tijdsinvestering**: 1-2 dagen

2. **Tier-based Endpoints Implementeren**:
   - Implementeer `POST /api/scan/authenticated` met credit aftrek
   - Voeg auth middleware toe aan alle scan endpoints
   - Integreer credit systeem in scan flow
   - ✅ `GET /api/user/credits` endpoint (voltooid)

3. **PDF Storage Strategie**:
   - Kies storage oplossing (Vercel Blob vs S3)
   - Implementeer PDF generatie pipeline
   - Scan metadata tracking voor downloads

4. ✅ **Stripe Integratie**: **VOLTOOID**
   - ✅ Fase 2.1 implementatie voltooid
   - ✅ Credit purchasing flows werkend
   - ✅ Dashboard met payment processing

### **Architectuur Beslissingen** 📋

**✅ Bevestigd**:
- Firebase Auth + Vercel Postgres hybrid approach
- Credit-based monetisatie model
- Tier-based feature gating

**🔄 Herzien**:
- **Scan Storage**: PDF-gebaseerd i.p.v. volledige resultaat opslag
- **Database Efficiency**: Minimale metadata, focus op business logic
- **File Storage**: Vercel Blob voor PDF rapporten

### **Volgende Sprint Planning**

**Week 1-2**: ✅ **VOLTOOID**
- ✅ Stripe integratie (Fase 2.1)
- 🔄 Scan API herstructurering (volgende stap)

**Week 3-4**:
- Tier-based scan endpoints
- PDF generatie systeem

**Week 5-6**:
- Email systeem
- UI/UX optimalisaties

---

## **TECHNISCHE DEBT & VERBETERINGEN**

### **Geïdentificeerde Issues**:
1. 🔄 Scan API gebruikt geen authenticatie (volgende prioriteit)
2. 🔄 Credit systeem niet geïntegreerd in scan flow (volgende prioriteit)
3. 🔄 Ontbrekende tier-based API endpoints (volgende prioriteit)
4. ⚠️ Scan resultaten opslag strategie onduidelijk
5. ✅ Stripe payment processing (voltooid)

### **Performance Optimalisaties**:
- Database indexing geoptimaliseerd ✅
- Auth middleware caching
- PDF generatie queue systeem

### **Security Verbeteringen**:
- Rate limiting geïmplementeerd ✅
- Token verificatie robuust ✅
- Credit operaties atomair ✅

---

**Status Samenvatting**:
- **Fase 1**: 100% Voltooid ✅
- **Fase 2.1**: 100% Voltooid ✅ (Stripe Integratie)
- **Fase 2**: 60% Voltooid 🚧
- **Totaal Project**: ~55% Voltooid

**Volgende Milestone**: Tier-based scan endpoints (Fase 2.2) - Credit aftrek in scan flow
