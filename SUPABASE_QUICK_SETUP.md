# 🚀 Supabase Quick Setup (5 Minutes)

## ✅ Credentials Already Added to `.env.local`

```env
VITE_SUPABASE_URL=https://ezekbjgjukbhfjzbecxk.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
```

## 📝 Step 1: Run SQL Schema (IMPORTANT!)

1. Open Supabase Dashboard: https://ezekbjgjukbhfjzbecxk.supabase.co
2. Go to **SQL Editor** (left sidebar)
3. Click **"+ New Query"**
4. Copy **ALL content** from `supabase-schema.sql` file
5. Paste into SQL Editor
6. Click **"Run"** button (or Ctrl+Enter)
7. Wait for success message: "Success. No rows returned"

This creates:
- ✅ All tables (calls, incidents, responders, etc.)
- ✅ Sample data (1 incident + 6 responders)
- ✅ Real-time subscriptions enabled
- ✅ Indexes for performance

## 🔄 Step 2: Restart Server

```bash
# Stop current server (Ctrl+C in terminal)
npm run dev
```

## ✅ Step 3: Test

Open browser: `http://localhost:5175`

**If schema was run successfully:**
- ✅ NO "⚠ DEMO MODE" warning
- ✅ Loads data from Supabase
- ✅ Real-time updates work
- ✅ Console shows: "✅ Fetched from Supabase: X incidents"

**If schema NOT run yet:**
- ⚠️ Shows "⚠ DEMO MODE - Using simulated data"
- Uses 6 seed incidents
- Console shows: "📊 Using seed data"

## 📊 Verify Data in Supabase

1. Go to **Table Editor** in Supabase Dashboard
2. Click **"incidents"** table
3. You should see 1 row (ID: 1042, Lalitpur incident)
4. Click **"responders"** table
5. You should see 6 rows (rescue teams)

## 🔔 Real-time Updates Test

1. Open dashboard in browser
2. In Supabase Dashboard, go to **Table Editor** → **incidents**
3. Click on the incident row
4. Edit any field (e.g., change status)
5. Click **Save**
6. **Dashboard auto-updates!** (no refresh needed)

## 🐛 Troubleshooting

### Still shows "DEMO MODE" after running SQL:
1. Check browser console for errors
2. Verify `.env.local` has correct credentials
3. Restart server: `Ctrl+C` then `npm run dev`
4. Hard refresh browser: `Ctrl+Shift+R`

### SQL errors when running schema:
- Make sure you copied **entire** SQL file
- Run sections one by one if needed
- Check if tables already exist (drop them first if needed)

### "permission denied" errors:
- You're logged into correct Supabase project
- Using correct credentials in `.env.local`

## 📦 What Happens:

```
Browser Opens
    ↓
useIncidents Hook
    ↓
Check: Supabase configured?
    ↓
YES → Fetch from "incidents" table
    ↓
Transform data to Incident type
    ↓
Display on dashboard
    ↓
Subscribe to real-time updates
```

## 🎯 Expected Console Output:

```
🔄 Fetching incidents from Supabase...
✅ Fetched from Supabase: 1 incidents
🔔 Subscribing to real-time incident updates...
```

## ✨ Next Steps:

1. **Add more incidents** via Supabase Table Editor
2. **Test Twilio integration** to create incidents from calls
3. **Configure responders** in responders table
4. **Enable RLS** (Row Level Security) for production

---

**Current Status:**
- ✅ Credentials configured
- ⏳ Awaiting SQL schema execution
- ⏳ Awaiting server restart

**Run the SQL now!** 🚀
