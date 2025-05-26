# GEO Scanner - Product Requirements Document (PRD)

## 📋 Samenvatting

**Product**: GEO Scanner - AI-Gereedheid Website Analyse Tool  
**Versie**: 2.0 (Gemonetiseerd)  
**Beoogde Launch**: 6-8 weken vanaf startdatum  
**Missie**: Websiteeigenaren in staat stellen hun content te optimaliseren voor AI-zoekmachines en LLM-zichtbaarheid

### Belangrijkste Waardeproposities
1. **Eerste op de markt** AI website analyse tool
2. **Credit-gebaseerde prijsstelling** zonder vervaldatum
3. **AI-aangedreven implementatiegidsen** voor concrete oplossingen
4. **Progressieve waardeladder** van gratis tot professionele tier

---

## 🎯 Productvisie & Doelen

### Visie Statement
*"Elke website vindbaar en geoptimaliseerd maken voor de AI-gedreven toekomst van zoeken, door uitvoerbare inzichten te bieden die de kloof overbruggen tussen traditionele SEO en AI-zichtbaarheid."*

### Primaire Doelen
- **Omzet**: €10K MRR binnen 6 maanden
- **Gebruikers**: 1000 betalende klanten in eerste kwartaal
- **Marktpositie**: Leidende AI-gereedheid analyse tool
- **Retentie**: 70% klanttevredenheid met Pro tier

### Succes Indicatoren
- **Conversieratio**: 15% van gratis naar betaald
- **Gemiddelde Besteding**: €35 (gemengd over tiers)
- **Klantwaarde Levensduur**: €80+ 
- **Net Promoter Score**: 60+

---

## 👥 Doelgroep

### Primaire Persona's

#### 1. SEO Specialisten & Digital Marketeers
- **Demografie**: 25-45, bureau of inhouse
- **Pijnpunten**: Onduidelijk hoe te optimaliseren voor AI-zoeken, traditionele SEO tools dekken AI niet
- **Waarde Drivers**: Concurrentievoordeel, klant deliverables, voorop lopen met trends
- **Budget**: €20-100 voor tools per project

#### 2. Websiteeigenaren & MKB Ondernemers  
- **Demografie**: 30-55, MKB eigenaren, freelancers
- **Pijnpunten**: Willen relevant blijven terwijl zoeken evolueert, gebrek aan technische expertise
- **Waarde Drivers**: Toekomstbestendig maken business, duidelijke actie-items, ROI zichtbaarheid
- **Budget**: €20-50 voor eenmalige optimalisaties

#### 3. Web Developers & Bureaus
- **Demografie**: 25-40, technische implementers
- **Pijnpunten**: Klanten vragen naar AI optimalisatie, hebben concrete technische begeleiding nodig
- **Waarde Drivers**: Implementatie roadmaps, code snippets, klant educatie
- **Budget**: €50-100 per klantproject

---

## 💰 Prijsstrategie & Businessmodel

### Credit-Gebaseerde Prijsstructuur

#### 🆓 **Gratis Tier**
- **Credits**: 1 scan (geen vervaldatum)
- **Features**: 
  - Anoniem scannen
  - On-screen basis analyse
  - Overall AI-gereedheid score
  - Top 3 verbetergebieden
  - Email rapport optie (met email capture)
- **Beperkingen**: Geen implementatiegidsen, geen PDF export
- **Doel**: Lead generatie & product demonstratie

#### 💎 **Starter Pakket - €19,95**
- **Credits**: 2 scans (geen vervaldatum)
- **Features**:
  - Alle Gratis tier features
  - Account vereist
  - Uitgebreide 8-module breakdown
  - PDF rapport generatie
  - Email bezorging
  - Scan geschiedenis (30 dagen)
  - Basis implementatie suggesties
- **Doelgroep**: Kleine bedrijven, freelancers, eenmalige projecten

#### 🚀 **Pro Pakket - €49,95**
- **Credits**: 5 scans (geen vervaldatum)
- **Features**:
  - Alle Starter tier features
  - AI-aangedreven implementatiegidsen (OpenAI integratie)
  - Ready-to-use code snippets
  - Impact voorspellingen per fix
  - Prioriteit ranking algoritme
  - Concurrentie benchmarking
  - Uitgebreide scan geschiedenis (90 dagen)
- **Doelgroep**: Bureaus, consultants, serieuze optimizers

### Omzet Projecties
- **Gemiddelde verkoopprijs**: €35 (gewogen gemiddelde)
- **Maandelijks target**: 300 transacties = €10.500 MRR
- **Kostenstructuur**: 
  - OpenAI API: ~€0,25 per Pro scan
  - Infrastructuur: ~€200/maand (Vercel + databases)
  - Bruto marge: 95%+

---

## 🛠️ Technische Vereisten

### Huidige Technische Stack
- **Frontend**: Next.js 14, React, Tailwind CSS
- **Backend**: Vercel Serverless Functions, tRPC
- **Database**: Vercel Postgres
- **Cache**: Upstash Redis
- **Auth**: Clerk
- **Betalingen**: Stripe
- **AI**: OpenAI API (GPT-4)
- **Opslag**: Vercel Blob Storage

### Systeemarchitectuur Vereisten

#### Database Schema Uitbreidingen
```sql
-- Gebruikersbeheer
users (
  id, clerk_id, email, plan_type, credits_remaining, 
  stripe_customer_id, created_at, updated_at
)

-- Credit Transacties
credit_transactions (
  id, user_id, transaction_type, credits_amount, 
  stripe_payment_id, created_at
)

-- Scan Resultaten
scan_results (
  id, user_id, url, overall_score, module_scores, 
  ai_suggestions, scan_tier, created_at, expires_at
)

-- Email Capture (Gratis gebruikers)
email_leads (
  id, email, scan_id, converted_to_paid, 
  created_at, last_contacted
)
```

#### API Endpoints
```
GET  /api/user/credits - Krijg gebruiker credit saldo
POST /api/checkout/create-session - Stripe checkout
POST /api/scan - Uitgebreid met credit aftrekking
POST /api/scan/anonymous - Gratis tier scanning
GET  /api/scan/history - Gebruiker scan geschiedenis
POST /api/email/report - Stuur email rapport
```

### Performance Vereisten
- **Scan voltooiingstijd**: < 30 seconden voor standaard websites
- **PDF generatie**: < 10 seconden  
- **API response tijd**: < 2 seconden voor gebruikersoperaties
- **Uptime**: 99,5% beschikbaarheid
- **Gelijktijdige gebruikers**: Ondersteuning 100 simultane scans

### Beveiligingsvereisten
- **Betalingsbeveiliging**: PCI DSS compliance via Stripe
- **Gegevensbescherming**: GDPR compliant data handling
- **API beveiliging**: Rate limiting, authenticatie
- **Audit trail**: Alle credit transacties gelogd

---

## 📱 Gebruikerservaring Design

### Gebruikersreis Mapping

#### **Reis 1: Gratis Gebruiker Conversie**
1. **Ontdekking**: Land op homepage via SEO/verwijzing
2. **Trial**: Voer URL in voor gratis scan
3. **Waarde demonstratie**: Zie basis resultaten on-screen
4. **Email capture**: Bied gedetailleerd rapport via email aan
5. **Upgrade prompt**: Toon Starter/Pro voordelen tijdens email aanmelding
6. **Follow-up**: Email sequence met tips + upgrade aanbiedingen

#### **Reis 2: Directe Aankoop**
1. **Ontdekking**: Land op homepage met intentie om te kopen
2. **Prijzen bekijken**: Vergelijk tiers op pricing pagina
3. **Aankoop**: Selecteer tier en voltooi Stripe checkout
4. **Onboarding**: Account setup + eerste scan walkthrough
5. **Gebruik**: Voer scans uit met volledige feature toegang
6. **Retentie**: Credit gebruik notificaties + upsell naar hogere tier

#### **Reis 3: Pro Gebruiker Succes**
1. **Scan uitvoering**: Voer URL in voor uitgebreide analyse
2. **Resultaten review**: Overall score + module breakdown
3. **AI inzichten**: Bekijk AI-gegenereerde implementatiegidsen
4. **Implementatie**: Gebruik meegeleverde code snippets
5. **Voortgang tracking**: Re-scan om verbeteringen te meten
6. **Advocacy**: Deel resultaten of beveel tool aan

### Belangrijkste UX Principes
- **Progressieve onthulling**: Toon waarde voordat je om commitment vraagt
- **Duidelijke waarde hiërarchie**: Duidelijke verschillen tussen tiers
- **Implementatie focus**: Geef altijd uitvoerbare volgende stappen
- **Vertrouwen opbouwen**: Professioneel design + duidelijke databronnen
- **Mobiel responsive**: Functioneel op alle apparaatgroottes

---

## 🚀 Ontwikkelingsroadmap

### **Fase 1: Fundament (Week 1-2)**
**Doel**: Implementeer gebruikersbeheer en credit systeem

**Week 1 Taken**:
- [ ] Uitbreiden database schema voor gebruikers en credits
- [ ] Implementeer Clerk authenticatie flow
- [ ] Creëer gebruikersprofiel en credit saldo tracking
- [ ] Bouw credit aftreklogica in scan API
- [ ] Ontwerp en ontwikkel pricing pagina

**Week 2 Taken**:
- [ ] Integreer Stripe checkout voor credit pakketten
- [ ] Implementeer betaling succes/falen handling
- [ ] Creëer webhook voor betaling bevestiging
- [ ] Bouw basis gebruikersdashboard
- [ ] Test betaalflow end-to-end

**Succes Criteria**:
- Gebruikers kunnen registreren en credits kopen
- Credit saldo neemt correct af met scans
- Betalingssysteem handelt edge cases netjes af

### **Fase 2: Feature Differentiatie (Week 3-4)**
**Doel**: Implementeer tier-gebaseerde features en email systeem

**Week 3 Taken**:
- [ ] Verbeter scan API met tier-gebaseerde feature gating
- [ ] Implementeer PDF rapport generatie
- [ ] Bouw email rapport bezorgsysteem
- [ ] Creëer anonieme scan behoud voor gratis tier
- [ ] Ontwerp upgrade prompts en conversie flows

**Week 4 Taken**:
- [ ] Ontwikkel verbeterde analyse features voor betaalde tiers
- [ ] Creëer scan geschiedenis interface
- [ ] Implementeer email capture voor gratis gebruikers
- [ ] Bouw email sequence templates
- [ ] Voeg usage analytics en tracking toe

**Succes Criteria**:
- Duidelijke feature verschillen tussen tiers
- Email rapporten betrouwbaar bezorgd
- Upgrade conversieratio >10%

### **Fase 3: AI Verbetering (Week 5-6)**
**Doel**: Implementeer AI-aangedreven features voor Pro tier

**Week 5 Taken**:
- [ ] Integreer OpenAI API voor analyse verbetering
- [ ] Ontwikkel prompt engineering voor consistente outputs
- [ ] Creëer AI suggestie parsing en weergave
- [ ] Implementeer impact voorspelling algoritmes
- [ ] Bouw prioriteit ranking systeem

**Week 6 Taken**:
- [ ] Voeg concurrentie benchmarking features toe
- [ ] Creëer code snippet generatie en formatting
- [ ] Implementeer geavanceerde Pro tier UI componenten
- [ ] Optimaliseer AI call kosten en response tijden
- [ ] Uitgebreide testing van AI features

**Succes Criteria**:
- AI suggesties zijn accuraat en uitvoerbaar
- Pro tier toont duidelijke waarde over Starter
- AI API kosten blijven onder 5% van omzet

### **Fase 4: Launch Voorbereiding (Week 7-8)**
**Doel**: Polish, testen, en launch voorbereiding

**Week 7 Taken**:
- [ ] Uitgebreide QA testing over alle gebruikersflows
- [ ] Performance optimalisatie en load testing
- [ ] Content creatie voor marketing launch
- [ ] Zet analytics en monitoring op
- [ ] Creëer customer support documentatie

**Week 8 Taken**:
- [ ] Soft launch met beta gebruikers
- [ ] Verzamel feedback en implementeer kritieke fixes
- [ ] Bereid marketing materialen en launch sequence voor
- [ ] Zet customer support processen op
- [ ] Publieke launch uitvoering

**Succes Criteria**:
- Alle kritieke bugs opgelost
- Positieve feedback van beta gebruikers
- Launch infrastructuur klaar voor verkeer pieken

---

## 📊 Feature Specificaties

### Core Scanning Engine Verbeteringen

#### Anoniem Scannen (Gratis Tier)
- **Input**: URL indiening zonder registratie
- **Processing**: Standaard 8-module analyse
- **Output**: 
  - Overall AI-gereedheid score (0-100)
  - Korte module status (✓ Goed, ⚠ Aandacht Nodig, ❌ Kritiek)
  - Top 3 prioriteit issues
  - Generieke verbeteringssuggesties
- **Beperkingen**: Geen gedetailleerde breakdowns, geen implementatiegidsen

#### Verbeterde Analyse (Starter Tier)
- **Input**: URL indiening met account vereist
- **Processing**: Volledige 8-module diepe analyse
- **Output**:
  - Gedetailleerde module breakdowns
  - PDF rapport generatie
  - Basis implementatie suggesties
  - Score uitleg en context
- **Features**: 
  - Scan geschiedenis opslag
  - Email bezorging
  - Voortgang tracking

#### AI-Aangedreven Analyse (Pro Tier)
- **Input**: URL indiening met Pro account
- **Processing**: Volledige analyse + OpenAI verbetering
- **Output**:
  - Alle Starter features plus:
  - AI-gegenereerde implementatie roadmap
  - Ready-to-use code snippets
  - Impact voorspellingen per fix
  - Prioriteit ranking gebaseerd op inspanning vs. impact
  - Concurrentie benchmarking
- **AI Integratie**:
  ```json
  {
    "prompt_template": "Analyseer deze website scan en geef implementatie stappen...",
    "model": "gpt-4",
    "max_tokens": 2000,
    "temperature": 0.3
  }
  ```

### Betaling en Credit Management

#### Credit Systeem
- **Aankoop flow**: Stripe Checkout met meerdere pakket opties
- **Credit opslag**: Database tracking met audit trail
- **Gebruik tracking**: Automatische aftrekking per scan met bevestiging
- **Saldo weergave**: Real-time credit telling in gebruikersdashboard
- **Vervaldatum beleid**: Credits verlopen nooit (met service wijziging clausule)

#### Upgrade Prompts
- **Gratis naar betaald**: Na email capture voor rapport bezorging
- **Starter naar Pro**: Bij bekijken implementatie secties
- **Credit uitputting**: Wanneer saldo 1 overgebleven credit bereikt
- **Waarde demonstratie**: Voor tonen vergrendelde features

### Email Marketing Integratie

#### Gratis Gebruiker Email Capture
- **Trigger**: Gebruiker vraagt gedetailleerd rapport
- **Data verzameling**: Email adres + scan resultaten
- **Directe bezorging**: Uitgebreid PDF rapport
- **Follow-up sequence**:
  - Dag 1: Welkom + upgrade aanbod
  - Dag 3: SEO tips + case study
  - Dag 7: Beperkte tijd korting
  - Dag 14: Finale upgrade herinnering

#### Transactionele Emails
- **Aankoop bevestiging**: Credit pakket details
- **Scan voltooiing**: Resultaten klaar notificatie
- **Credit uitputting waarschuwing**: Wanneer 1 credit overblijft
- **Account updates**: Plan wijzigingen of terugbetalingen

---

## 🎨 Design Vereisten

### Visueel Design Systeem

#### Brand Identiteit
- **Primaire kleuren**: 
  - Deep Blue (#0F45C5) - Vertrouwen, technologie
  - Purple (#7C3AED) - Innovatie, AI
  - Success Green (#10B981) - Goede scores
  - Warning Orange (#F59E0B) - Aandacht nodig
  - Danger Red (#EF4444) - Kritieke issues

#### Typografie
- **Headers**: Instrument Sans (display font)
- **Body**: Inter (leesbaar, technisch)
- **Code**: Fira Code (monospace voor snippets)

#### Component Standaarden
- **Cards**: Witte achtergrond, subtiele schaduwen, afgeronde hoeken
- **Buttons**: Gradiënt primaire acties, duidelijke hiërarchie
- **Progress indicatoren**: Kleurgecodeerd door performance
- **Status badges**: Consistent met scoring systeem

### Responsive Design
- **Mobile-first**: Core functionaliteit op alle schermgroottes
- **Breakpoints**: 
  - Mobiel: 320px - 639px
  - Tablet: 640px - 1023px  
  - Desktop: 1024px+
- **Touch optimalisatie**: 44px minimum touch targets
- **Performance**: Snel laden op mobiele netwerken

### Toegankelijkheidsstandaarden
- **WCAG 2.1 AA compliance**: Kleurcontrast, toetsenbordnavigatie
- **Screen reader ondersteuning**: Juiste ARIA labels
- **Alternatieve tekst**: Alle informatieve graphics
- **Focus management**: Duidelijke navigatie patronen

---

## 🔄 Integratie Vereisten

### Derde Partij Services

#### Stripe Betaalverwerking
- **Checkout Sessions**: Eenmalige betalingen voor credit pakketten
- **Webhooks**: Betaling bevestiging en falen handling
- **Customer Portal**: Basis abonnement management
- **Beveiliging**: PCI DSS compliance via Stripe

#### OpenAI API Integratie
- **Model**: GPT-4 voor hoogste kwaliteit analyse
- **Rate limiting**: Voorkom API misbruik en kosten overschrijding
- **Error handling**: Elegante fallbacks wanneer AI niet beschikbaar
- **Kosten monitoring**: Track API gebruik per klant

#### Email Service Provider
- **Transactionele emails**: Postmark of SendGrid voor betrouwbaarheid
- **Marketing automatisering**: Integratie met email sequences
- **Template management**: HTML email templates
- **Analytics**: Open rates, click tracking

### Analytics en Monitoring
- **Gebruikersgedrag**: Posthog of Google Analytics 4
- **Error tracking**: Sentry voor bug monitoring
- **Performance monitoring**: Vercel Analytics
- **Business metrics**: Custom dashboard voor KPIs

---

## ⚖️ Juridisch en Compliance

### Algemene Voorwaarden
- **Credit beleid**: Geen vervaldatum maar service wijziging rechten
- **Terugbetaal beleid**: 7-dagen geld-terug garantie
- **Gebruik beperkingen**: Voorkom misbruik en doorverkoop
- **Intellectueel eigendom**: Gebruikersdata eigendom en onze tool rechten

### Privacy Beleid
- **Data verzameling**: Minimaal noodzakelijke data alleen
- **Data opslag**: Veilige handling en retentie beleid
- **Gebruikersrechten**: Toegang, correctie, verwijdering onder GDPR
- **Derde partij delen**: Beperkt tot essentiële service providers

### Service Level Agreement
- **Uptime commitment**: 99,5% beschikbaarheid
- **Support response**: 24-uur response voor betaalde gebruikers
- **Data backup**: Reguliere backups en disaster recovery
- **Service wijzigingen**: 30-dagen notice voor grote wijzigingen

---

## 📈 Marketing en Groei Strategie

### Launch Strategie

#### Pre-Launch (Week 1-6)
- **Beta testing**: 50 geselecteerde gebruikers uit netwerk
- **Content creatie**: Blog posts over AI zoektrends
- **SEO fundament**: Target keywords rond "AI website optimalisatie"
- **Partnership outreach**: SEO tool integraties

#### Launch Week
- **Product Hunt**: Coördineer launch dag
- **Community outreach**: Reddit, LinkedIn, Twitter aankondigingen
- **PR outreach**: SEO en marketing publicaties
- **Influencer partnerships**: SEO experts en consultants

#### Post-Launch (Maand 2-3)
- **Content marketing**: Wekelijkse blog posts en tutorials
- **Webinar series**: "Voorbereiden op AI Zoeken" educatieve content
- **Case studies**: Klant succes verhalen
- **Affiliate programma**: Commissie structuur voor verwijzingen

### Klant Acquisitie Kanalen
1. **Organisch zoeken**: Target "AI SEO" en gerelateerde keywords
2. **Content marketing**: Educatieve blog posts en gidsen
3. **Social media**: LinkedIn en Twitter voor B2B publiek
4. **Partnership**: Integratie met bestaande SEO tools
5. **Verwijzingsprogramma**: Stimuleer gebruiker aanbevelingen

### Retentie Strategie
- **Email educatie**: Wekelijkse tips en industrie updates
- **Feature updates**: Reguliere product verbeteringen
- **Community building**: Gebruikersforum of Slack groep
- **Succes tracking**: Help gebruikers verbeteringen meten

---

## 🎯 Succes Metrics en KPIs

### Business Metrics
- **Maandelijkse Terugkerende Omzet**: Target €10K tegen maand 6
- **Klant Acquisitie Kosten**: <€15 gemengd over kanalen
- **Levensduur Waarde**: >€80 gemiddelde klantwaarde
- **Bruto marge**: >95% (exclusief klant acquisitie)

### Product Metrics
- **Conversieratio**: 15% van gratis naar betaald
- **Feature adoptie**: 80% van Pro gebruikers gebruikt AI features
- **Scan voltooiingsratio**: 95% van gestarte scans eindigt
- **Credit benutting**: Gemiddeld 90% van gekochte credits gebruikt

### Gebruikerservaring Metrics
- **Net Promoter Score**: Target 60+
- **Klanttevredenheid**: 4,5+ sterren gemiddelde rating
- **Support ticket volume**: <5% van gebruikers contact support
- **Churn rate**: <10% maandelijks voor betaalde gebruikers

### Technische Metrics
- **API response tijd**: <2 seconden gemiddeld
- **Scan nauwkeurigheid**: >95% succesvolle analyse voltooiing
- **Uptime**: 99,5% beschikbaarheid
- **Error rate**: <1% van totale requests

---

## 🔮 Toekomstige Roadmap (Na MVP)

### Kwartaal 2 Verbeteringen
- **Concurrentie analyse**: Multi-site vergelijking features
- **White-label opties**: Bureau-branded rapporten
- **API toegang**: Developer integraties
- **Bulk scanning**: Upload meerdere URLs tegelijk

### Kwartaal 3 Uitbreidingen
- **WordPress plugin**: Directe integratie met WordPress admin
- **Monitoring service**: Doorlopende website gezondheid tracking
- **Team samenwerking**: Meerdere gebruikers per account
- **Geavanceerde AI features**: Custom AI modellen en prompts

### Kwartaal 4 Schaal
- **Enterprise tier**: Custom pricing voor grote organisaties
- **Internationale expansie**: Meertalige ondersteuning
- **Marketplace integraties**: Shopify, Webflow, etc.
- **Geavanceerde analytics**: Trend analyse en forecasting

---

## 📝 Bijlagen

### A. Technische Specificatie Details
*[Gedetailleerde API documentatie, database schemas, en integratie specs]*

### B. Design Mockups en Wireframes  
*[UI/UX designs voor alle belangrijke gebruikersflows en componenten]*

### C. Marktonderzoek en Concurrentie Analyse
*[Analyse van bestaande SEO tools en AI optimalisatie landschap]*

### D. Financiële Projecties en Businessmodel
*[Gedetailleerde omzet projecties, kosten analyse, en groei scenario's]*

---

**Document Versie**: 1.0  
**Laatst Bijgewerkt**: December 2024  
**Volgende Review**: Januari 2025  
**Eigenaar**: Colin (Product Owner)  
**Bijdragers**: Ontwikkelteam, Design Team