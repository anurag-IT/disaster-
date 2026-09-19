# 🐛 Debug Guide - Data Not Loading

## Step 1: Check Browser Console

1. Open browser: `http://localhost:5175`
2. Press **F12** (or Right-click → Inspect)
3. Go to **Console** tab
4. Look for these messages:

### ✅ Good Signs (Supabase Working):
```
🔧 Supabase Config Check:
  URL: ✅ Found
  Key: ✅ Found
✅ Supabase configured successfully!
🔄 Fetching incidents from Supabase...
✅ Fetched from Supabase: X incidents
🔔 Subscribing to real-time incident updates...
```

### ❌ Bad Signs (Problems):
```
⚠️ Supabase credentials not found. Using demo mode
📊 Using seed data (Supabase not configured)
```

## Step 2: Check Environment Variables

### Test in Browser Console:
```javascript
console.log(import.meta.env.VITE_SUPABASE_URL);
console.log(import.meta.env.VITE_SUPABASE_ANON_KEY);
```

**Should show:**
```
https://ezekbjgjukbhfjzbecxk.supabase.co
eyJhbGciOiJIUzI1NiIs...
```

**If shows `undefined`:**
- ❌ Environment variables not loaded
- **FIX:** Restart dev server completely

## Step 3: Restart Server Properly

```bash
# 1. Stop ALL running processes (Ctrl+C multiple times)
# 2. Kill all node processes (if needed)
taskkill /F /IM node.exe

# 3. Start fresh
npm run dev
```

## Step 4: Hard Refresh Browser

After server restart:
- **Windows/Linux:** `Ctrl + Shift + R`
- **Mac:** `Cmd + Shift + R`

Or clear cache:
- Press `F12` → `Application` tab → `Clear site data`

## Step 5: Test Supabase Direct Connection

Open this file in browser:
```
file:///D:/project%20jivan/raksha-ai/test-supabase.html
```

Click **"Fetch Incidents"** button.

**Should show:**
```json
{
  "status": "SUCCESS",
  "count": 1,
  "incidents": [...]
}
```

**If shows error:**
- Check Supabase SQL was run
- Check table name is correct ("incidents" not "Incident")
- Check RLS (Row Level Security) is disabled

## Step 6: Check Supabase Tables

1. Go to Supabase Dashboard
2. Click **Table Editor** (left sidebar)
3. Check these tables exist:
   - ✅ calls
   - ✅ incidents  
   - ✅ responders
   - ✅ transcripts
   - ✅ incident_evidence
   - ✅ assignments

4. Click **incidents** table
5. Should see at least 1 row

**If no tables:**
- SQL schema wasn't run
- Run `supabase-schema.sql` in SQL Editor

## Step 7: Check Network Tab

1. Press **F12** → **Network** tab
2. Refresh page
3. Look for requests to `ezekbjgjukbhfjzbecxk.supabase.co`

**Should see:**
- POST request to `/rest/v1/incidents`
- Status: 200 OK
- Response: JSON with incident data

**If no requests:**
- Supabase client not initialized
- Check environment variables

**If 401 Unauthorized:**
- Wrong anon key
- Check `.env.local` has correct key

**If 404 Not Found:**
- Table doesn't exist
- Run SQL schema

## Common Issues & Fixes:

### Issue 1: "Demo Mode" Shows
**Cause:** Environment variables not loaded  
**Fix:** 
```bash
# Stop server completely
Ctrl+C (multiple times)

# Restart
npm run dev

# Hard refresh browser
Ctrl+Shift+R
```

### Issue 2: Tables Don't Exist
**Cause:** SQL schema not run  
**Fix:**
1. Open Supabase SQL Editor
2. Copy entire `supabase-schema.sql`
3. Run it
4. Check Table Editor

### Issue 3: Empty Response
**Cause:** No data in database  
**Fix:**
1. Check `incidents` table has rows
2. Or insert manually:
```sql
INSERT INTO calls (phone_hash, status) 
VALUES ('+977****9999', 'COMPLETED');

INSERT INTO incidents (call_id, data, priority_score, priority_level, status, simulated)
SELECT id, '{}'::jsonb, 50, 'ELEVATED', 'NEW', false
FROM calls WHERE phone_hash = '+977****9999';
```

### Issue 4: CORS Error
**Cause:** Supabase project settings  
**Fix:**
1. Supabase Dashboard → Settings → API
2. Check "URL Configuration"
3. Make sure project is active

## Quick Test Commands:

### Test 1: Check Env Vars
```bash
# In Windows PowerShell
Get-Content .env.local | Select-String "VITE_SUPABASE"
```

**Should show:**
```
VITE_SUPABASE_URL=https://ezekbjgjukbhfjzbecxk.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
```

### Test 2: Check Server Logs
Look at terminal running `npm run dev`:
```
[web] 📊 Using seed data    ← BAD (using demo)
[web] ✅ Fetched from Supabase  ← GOOD (using DB)
```

## Still Not Working?

Share these details:
1. Browser console output (all messages)
2. Network tab (any requests to supabase.co?)
3. `incidents` table in Supabase (screenshot)
4. Terminal output from `npm run dev`

---

**Most common fix: Restart server + hard refresh browser!** 🔄
