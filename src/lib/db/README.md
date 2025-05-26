# GEO Scanner Database Setup

Deze directory bevat alle database-gerelateerde code voor GEO Scanner v2.0, inclusief schema migraties, TypeScript types, en repository functies.

## 🗄️ Database Architectuur

**Stack**: Firebase Auth + Vercel Postgres
- **Firebase Auth**: Gebruikersauthenticatie (anoniem + email/password)
- **Vercel Postgres**: Business data (credits, scans, transacties)
- **Koppeling**: Firebase UID als foreign key in Postgres

## 📋 Database Schema

### Tabellen

1. **`users`** - Gebruikersbeheer
   - Gekoppeld aan Firebase Auth via `firebase_uid`
   - Plan types: free, starter, pro
   - Credit tracking

2. **`credit_transactions`** - Audit trail voor credits
   - Alle credit operaties (purchase, scan, refund)
   - Stripe payment ID tracking

3. **`scan_results`** - Website scan data
   - JSON opslag voor module scores, AI suggesties, benchmark data
   - Tier-based features (anonymous, starter, pro)

4. **`email_leads`** - Email capture van anonieme gebruikers
   - Conversie tracking naar betaalde accounts

## 🚀 Setup & Migraties

### Vereisten

1. **Vercel Postgres database** geconfigureerd
2. **Environment variabelen**:
   ```bash
   POSTGRES_URL="postgresql://..."
   ```

### Database Migraties Uitvoeren

```bash
# Installeer dependencies
npm install

# Voer alle pending migraties uit
npm run db:migrate

# Check migratie status
npm run db:status

# Reset database (development only)
npm run db:reset
```

### Nieuwe Migratie Toevoegen

1. Maak een nieuw SQL bestand in `migrations/`:
   ```
   002_add_new_feature.sql
   ```

2. Voer migratie uit:
   ```bash
   npm run db:migrate
   ```

## 💻 Gebruik in Code

### Repository Functies

```typescript
import { 
  UserRepository, 
  ScanRepository, 
  EmailLeadRepository 
} from '@/lib/db';

// Gebruiker operaties
const user = await UserRepository.findUserByFirebaseUid(firebaseUid);
const result = await UserRepository.deductCredits(firebaseUid, 1);

// Scan operaties
const scan = await ScanRepository.createScanResult({
  user_id: user.id,
  url: 'https://example.com',
  scan_tier: 'starter'
});

// Email lead operaties
await EmailLeadRepository.createEmailLead({
  email: 'user@example.com',
  scan_id: scan.id
});
```

### Direct Database Queries

```typescript
import { query, transaction } from '@/lib/db';

// Eenvoudige query
const result = await query('SELECT * FROM users WHERE id = $1', [userId]);

// Transactie
const result = await transaction(async (client) => {
  await client.query('UPDATE users SET credits = credits - 1 WHERE id = $1', [userId]);
  await client.query('INSERT INTO credit_transactions ...');
  return { success: true };
});
```

## 🔒 Security & Best Practices

### Credit Operaties
- **Altijd atomair**: Gebruik transacties voor credit wijzigingen
- **Row locking**: `FOR UPDATE` bij credit checks
- **Audit trail**: Alle operaties worden gelogd

### Error Handling
```typescript
import { 
  InsufficientCreditsError, 
  UserNotFoundError, 
  DatabaseError 
} from '@/lib/db';

try {
  await UserRepository.deductCredits(firebaseUid, 1);
} catch (error) {
  if (error instanceof InsufficientCreditsError) {
    // Handle insufficient credits
  } else if (error instanceof UserNotFoundError) {
    // Handle user not found
  }
}
```

### Rate Limiting
```typescript
// Check scan count voor rate limiting
const scanCount = await ScanRepository.getUserScanCount(userId, 24); // laatste 24 uur
if (scanCount >= TIER_LIMITS[user.plan_type].daily_limit) {
  throw new Error('Rate limit exceeded');
}
```

## 📊 Tier-based Features

### Feature Gating
```typescript
import { TIER_LIMITS } from '@/lib/db';

const userTier = user.plan_type;
const features = TIER_LIMITS[userTier].features;

if (features.ai_suggestions) {
  // Generate AI suggestions voor Pro tier
}

if (features.pdf_reports) {
  // Generate PDF voor Starter/Pro tier
}
```

### Scan History Access
```typescript
// Automatische filtering op basis van tier
const history = await ScanRepository.getUserScanHistory(
  user.id, 
  user.plan_type
); // Free: [], Starter: 30 dagen, Pro: 90 dagen
```

## 🧪 Testing

### Test Data
De initial migration bevat test gebruikers:
- `test-free-user` (free tier, 1 credit)
- `test-starter-user` (starter tier, 2 credits)  
- `test-pro-user` (pro tier, 5 credits)

### Development Reset
```bash
# Reset database en herlaad test data
npm run db:reset
```

## 📈 Monitoring & Analytics

### Scan Statistieken
```typescript
const stats = await ScanRepository.getScanStatistics(30); // laatste 30 dagen
// { total_scans, scans_by_tier, average_score, unique_users }
```

### Email Lead Tracking
```typescript
const leadStats = await EmailLeadRepository.getEmailLeadStatistics(30);
// { total_leads, converted_leads, conversion_rate, recent_leads }
```

## 🔧 Maintenance

### Cleanup Jobs
```typescript
// Verwijder verlopen scans
await ScanRepository.deleteExpiredScans();

// Verwijder oude email leads (GDPR compliance)
await EmailLeadRepository.deleteOldLeads(365); // 1 jaar
```

### Backup Strategy
- Vercel Postgres heeft automatische backups
- Voor kritieke operaties: manual snapshots voor deployment

## 🚨 Troubleshooting

### Veelvoorkomende Problemen

1. **Migration fails**:
   ```bash
   # Check database connectie
   npm run db:status
   
   # Reset en probeer opnieuw
   npm run db:reset
   ```

2. **Credit conflicts**:
   - Transacties zorgen voor atomiciteit
   - Row locking voorkomt race conditions

3. **Performance issues**:
   - Alle belangrijke velden hebben indexes
   - JSON queries zijn geoptimaliseerd

### Debug Queries
```sql
-- Check migratie status
SELECT * FROM migrations ORDER BY executed_at;

-- Check user credits
SELECT firebase_uid, email, plan_type, credits_remaining FROM users;

-- Check recent transactions
SELECT * FROM credit_transactions ORDER BY created_at DESC LIMIT 10;
``` 