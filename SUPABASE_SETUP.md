# 🗄️ Supabase Integration Setup

## ✅ What's Done:

1. ✅ **Supabase Client** - Created at `src/lib/supabase.ts`
2. ✅ **useIncidents Hook** - Real-time data fetching with fallback
3. ✅ **Dashboard Integration** - Auto-loads from Supabase or uses demo data
4. ✅ **Demo Mode Indicator** - Shows when using simulated data
5. ✅ **Real-time Subscriptions** - Auto-updates when data changes

## 🚀 How to Connect Supabase:

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign in / Sign up (free tier available)
3. Click **"New Project"**
4. Fill in:
   - **Project Name**: raksha-ai (or any name)
   - **Database Password**: Create a strong password
   - **Region**: Choose closest to Nepal (Singapore recommended)
5. Click **"Create new project"**
6. Wait 1-2 minutes for project creation

### Step 2: Get Your Credentials

1. In Supabase Dashboard, go to **Settings** → **API**
2. You'll see:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **Project API keys**:
     - `anon` `public` key (this is safe for frontend)

### Step 3: Update `.env.local`

Replace placeholders in `.env.local`:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_public_key_here
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.your-project.supabase.co:5432/postgres
```

**Get DATABASE_URL:**
- Settings → Database → Connection string → URI
- Copy and replace `[YOUR-PASSWORD]` with your database password

### Step 4: Run Database Migrations

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to Supabase
npx prisma db push

# (Optional) Seed initial data
npx prisma db seed
```

### Step 5: Restart Servers

```bash
# Stop current servers (Ctrl+C)
# Start fresh
npm run dev
```

## 🎯 Features:

### Automatic Fallback:
- ✅ If Supabase credentials missing → Uses demo data
- ✅ If Supabase connection fails → Falls back to demo data
- ✅ Demo mode indicator shows in UI

### Real-time Updates:
- ✅ Any database changes auto-sync to dashboard
- ✅ Multiple users see updates instantly
- ✅ No manual refresh needed

### Data Management:
```typescript
const { 
  incidents,        // Current incidents array
  loading,          // Loading state
  error,           // Error message if any
  isUsingDemoData, // true if using seed data
  addIncident,     // Add new incident
  updateIncident,  // Update existing incident
  setIncidents     // Direct state update (demo mode)
} = useIncidents();
```

## 📊 Database Schema:

Already configured in `prisma/schema.prisma`:

- **Call** - Phone call records
- **Transcript** - Call transcripts
- **Incident** - Emergency incidents
- **IncidentEvidence** - AI-extracted facts
- **Responder** - Emergency response teams
- **Assignment** - Team assignments
- **IncidentUpdate** - Status updates

## 🧪 Testing:

### Test Demo Mode (No Supabase):
```bash
# Don't add VITE_SUPABASE_* to .env.local
npm run dev
```
You'll see: **"⚠ DEMO MODE - Using simulated data"** in header

### Test Supabase Mode:
```bash
# Add correct credentials to .env.local
npm run dev
```
Header won't show demo warning, loads data from database

## 🔄 Data Flow:

```
┌─────────────────────────────────────┐
│  Dashboard Component                │
│  ↓                                  │
│  useIncidents() Hook                │
│  ↓                                  │
│  Check: Supabase Configured?        │
│  ↓                                  │
├─ YES → Fetch from Supabase         │
│         ├─ Success → Use DB data    │
│         └─ Error → Fallback to seed │
│                                      │
└─ NO → Use seed data (demo mode)     │
```

## 🗄️ Supabase Dashboard Tables:

After `prisma db push`, you'll see these tables in Supabase:

1. **Call** - Stores call metadata
2. **Transcript** - Call transcriptions
3. **Incident** - Emergency records
4. **IncidentEvidence** - AI-extracted facts
5. **Responder** - Response teams
6. **Assignment** - Team-to-incident mapping
7. **IncidentUpdate** - Status history

## 📝 Example: Add Incident via Supabase

```typescript
const { addIncident } = useIncidents();

await addIncident({
  phoneMasked: "+977****1234",
  status: "NEW",
  peopleCount: 5,
  trapped: true,
  location: {
    rawText: "Kathmandu",
    latitude: 27.7172,
    longitude: 85.3240,
    district: "Kathmandu",
    accuracy: "APPROXIMATE"
  },
  summary: "5 people trapped in flood",
  // ... other fields
});
```

## 🔐 Security Notes:

- ✅ **VITE_SUPABASE_ANON_KEY** is safe for frontend (anon/public key)
- ✅ **DATABASE_URL** should only be in `.env.local` (server-side)
- ⚠️ Never commit `.env.local` to git
- ✅ Supabase Row Level Security (RLS) should be configured for production

## ⚡ Real-time Subscription:

The hook automatically subscribes to database changes:

```typescript
supabase
  .channel('incidents')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'Incident' }, 
    () => {
      // Refetch incidents when data changes
    }
  )
  .subscribe();
```

## 🐛 Troubleshooting:

### "Demo Mode" shows even with credentials:
- Check `.env.local` has correct `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Restart dev server: `Ctrl+C` then `npm run dev`
- Check browser console for errors

### Database connection fails:
- Verify `DATABASE_URL` is correct
- Check database password
- Ensure Supabase project is active

### Prisma errors:
```bash
# Regenerate client
npx prisma generate

# Reset if needed (⚠️ deletes all data!)
npx prisma migrate reset
```

## 📦 Current Status:

✅ Supabase client installed
✅ Hooks created
✅ Dashboard integrated
✅ Demo mode fallback working
✅ Real-time subscriptions ready
⏳ **Awaiting Supabase credentials**

## 🎊 Next Steps:

1. Create Supabase project
2. Add credentials to `.env.local`
3. Run `npx prisma db push`
4. Restart server
5. Test with real data!

**Current Behavior:** Using demo data with 6 simulated incidents. Add Supabase credentials to use real database! 🚀
