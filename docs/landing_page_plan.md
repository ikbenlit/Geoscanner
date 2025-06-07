# Cursor Opdracht: V0 Landingspagina Integratie

Op basis van de bijgevoegde HTML gaan we de landingspagina opnieuw stylen. Maak een gefaseerd plan waarin we de Tailwind config uitbreiden, de CSS variabelen in globals.css bijwerken, de componenten updaten op basis van deze styling, en vervolgens een nieuwe page.tsx maken.

## Bijgevoegde HTML
docs\landing_page_v0.html

## Gewenste Fasering

### Fase 1: Tailwind Config Uitbreiden
- Analyseer de kleuren in de HTML (#2E9BDA, #F5B041, #E74C3C, #1a1a1a)
- Voeg deze toe aan tailwind.config.ts als nieuwe color tokens
- Behoud bestaande shadcn/ui configuratie
- Maak logische namen: v0-blue, v0-orange, v0-red, v0-dark

**Status: ✅ Voltooid**
- Nieuwe kleuren toegevoegd aan tailwind.config.ts
- Bestaande configuratie behouden
- Logische namen geïmplementeerd

### Fase 2: CSS Variables in globals.css
- Voeg CSS custom properties toe voor de nieuwe kleuren
- Converteer hex naar HSL values voor consistentie
- Creëer utility classes voor vaak gebruikte kombinaties
- Behoud bestaande shadcn/ui styling

**Status: ✅ Voltooid**
- CSS custom properties toegevoegd voor v0 kleuren
- Hex kleuren geconverteerd naar HSL waarden
- Utility classes toegevoegd voor background en text kleuren
- Dark mode varianten toegevoegd
- Bestaande shadcn/ui styling behouden

### Fase 3: Component Analysis & Updates
- Identificeer welke bestaande UI components (Button, Input, Card, Badge) hergebruikt kunnen worden
- Update deze components om de nieuwe kleurenschema te ondersteunen
- Maak nieuwe variants waar nodig (bijvoorbeeld Button met v0-blue styling)

**Status: ✅ Voltooid**
- Button component uitgebreid met v0 varianten en groottes
- Input component uitgebreid met v0 styling
- Card component uitgebreid met v0 varianten en hover effecten
- Badge component uitgebreid met v0 kleuren en status varianten
- Alle componenten behouden backward compatibility

### Fase 4: Nieuwe Landingspagina Component
- Converteer de HTML naar een React/TypeScript component
- Gebruik de nieuwe Tailwind tokens ipv hardcoded hex waardes
- Implementeer state management voor form inputs
- Zorg voor proper accessibility (ARIA labels, semantic HTML)
- Integreer met bestaande routing (/scan route)

**Status: ✅ Voltooid**
- Nieuwe LandingPage component gemaakt
- Alle secties geïmplementeerd (Hero, Features, CTA)
- State management voor URL input
- Gebruik van nieuwe v0 componenten en styling
- Responsive design met Tailwind classes
- SVG iconen geïntegreerd
- Form handling voorbereid voor scan functionaliteit

### Fase 5: Page.tsx Updates
- Vervang de huidige inhoud met de nieuwe LandingPage component
- Behoud de bestaande scan functionaliteit
- Zorg voor een soepele overgang tussen landing page en scan resultaten
- Verwijder overbodige code en imports

**Status: ✅ Voltooid**
- LandingPage component geïntegreerd in page.tsx
- Scan functionaliteit behouden via onScanComplete callback
- State management voor scan resultaten geïmplementeerd
- Code opgeschoond en vereenvoudigd
- TypeScript types toegevoegd voor betere type checking

### Fase 6: Component Refactoring
- Splits de LandingPage component op in kleinere, herbruikbare componenten
- Maak nieuwe componenten voor elke sectie:
  - `Header` component met navigatie
  - `HeroSection` component met scan formulier
  - `FeaturesSection` component met feature cards
  - `PricingSection` component met prijsplannen
  - `Footer` component met links en social media
- Implementeer proper prop types voor elke component
- Zorg voor consistente styling tussen componenten
- Voeg unit tests toe voor nieuwe componenten

**Status: 🚧 In Progress**
- Nieuwe component structuur:
  ```
  src/
    components/
      landing/
        Header.tsx
        HeroSection.tsx
        FeaturesSection.tsx
        PricingSection.tsx
        Footer.tsx
        index.ts
  ```
- LandingPage component wordt een container die de secties samenvoegt
- Elke sectie krijgt eigen state management waar nodig
- Componenten zijn herbruikbaar en onafhankelijk testbaar
- Styling wordt gedeeld via Tailwind classes en CSS variabelen

## Technische Vereisten
- TypeScript strict mode compliance
- Tailwind CSS classes (geen inline styles)
- Hergebruik van bestaande shadcn/ui components waar mogelijk
- Mobile-first responsive design
- SEO-vriendelijke semantische HTML structuur
- Performance optimized (geen onnodige re-renders)

## Bestaande Projectstructuur Respecteren
- Behoud huidige folder structuur: src/app/, src/components/, src/lib/
- Gebruik bestaande import paths (@/components/ui/*)
- Integreer met bestaande auth en database functies
- Geen breaking changes aan API routes

## Output Verwachting
Lever per fase de volgende bestanden op:
1. **tailwind.config.ts** - uitgebreide configuratie
2. **src/app/globals.css** - bijgewerkte CSS variabelen  
3. **src/components/NewLandingPage.tsx** - hoofdcomponent
4. **src/app/page.tsx** - bijgewerkte homepage
5. **Migratieplan** - stappen om veilig uit te rollen

Zorg ervoor dat elke fase afzonderlijk testbaar is zodat we incrementeel kunnen deployen zonder de bestaande functionaliteit te breken.