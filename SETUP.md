# 🌿 Wellness Tracker — Setup Guide

**Total time: ~45 minutes.** Follow each step in order.
No coding required — just copy, paste, and click.

---

## What you're building

| Piece | What it does | Where it lives | Cost |
|---|---|---|---|
| Google Sheet | Stores all user data | Your Google Drive | Free |
| Apps Script | The backend / server | Attached to the sheet | Free |
| index.html | The app users open | GitHub Pages | Free |
| Google OAuth | Secure user login | Google Cloud | Free |

---

## STEP 1 — Create your Google Sheet

1. Go to [sheets.google.com](https://sheets.google.com) and create a **New Spreadsheet**
2. Name it: `Wellness Tracker Data`
3. Leave it open — you'll need it in Step 2

---

## STEP 2 — Set up the Apps Script backend

1. In your Google Sheet, click **Extensions → Apps Script**
2. Delete everything in the editor (the default `function myFunction()` code)
3. Open the file `Code.gs` from this zip
4. **Copy everything** from Code.gs and paste it into the Apps Script editor
5. Click the **Save** button (💾 icon)
6. Click **Run** → select `setupSheet` → click **Run** again
   - If asked for permissions, click **Review Permissions → Allow**
   - This creates the "Entries" header row in your sheet
7. Now deploy it:
   - Click **Deploy → New deployment**
   - Click the gear icon ⚙️ next to "Type" → select **Web app**
   - Fill in:
     - Description: `Wellness Tracker v1`
     - Execute as: **Me**
     - Who has access: **Anyone**
   - Click **Deploy**
   - Copy the **Web app URL** — it looks like:
     `https://script.google.com/macros/s/ABC123.../exec`
     //https://script.google.com/u/0/home/projects/133W5U27F25O8SiOIeUD7wgY1iweK2IvKQ2gtrzPIYeHNvm6JJjQIH2mR/edit
   - **Save this URL — you'll need it in Step 4**

> ⚠️ Every time you change Code.gs, you must deploy a **New Deployment** for changes to take effect.

---

## STEP 3 — Get a Google OAuth Client ID

This lets users log in with their Google account securely.

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Click **Select a project → New Project**
   - Name: `Wellness Tracker`
   - Click **Create**
3. Make sure your new project is selected (top left dropdown)
4. Go to **APIs & Services → OAuth consent screen**
   - User Type: **External** → click **Create**
   - App name: `Wellness Tracker`
   - User support email: your email
   - Developer contact email: your email
   - Click **Save and Continue** through all screens (you don't need to fill in Scopes)
   - On the Summary screen, click **Back to Dashboard**
5. Go to **APIs & Services → Credentials**
   - Click **+ Create Credentials → OAuth client ID**
   - Application type: **Web application**
   - Name: `Wellness Tracker Web`
   - Under **Authorized JavaScript origins**, click **+ Add URI**
     - Add: `https://YOUR-USERNAME.github.io` (use your actual GitHub username)
     - Also add: `http://localhost` (for testing)
   - Click **Create**
6. A popup shows your Client ID. It looks like:
   `1234567890-abc123.apps.googleusercontent.com`
   - **Copy this Client ID — you'll need it in Step 4**

---

## STEP 4 — Update the app with your credentials

Open `index.html` in any text editor (Notepad on Windows, TextEdit on Mac, or VS Code).

Find these two lines near the top and bottom of the file:

```
'YOUR_GOOGLE_CLIENT_ID'   ← appears TWICE (top meta tag AND in CONFIG object)
'YOUR_APPS_SCRIPT_URL'    ← appears once in CONFIG object
```

**Replace them:**

1. Find `YOUR_GOOGLE_CLIENT_ID` (there are 2 of them) → replace both with your Client ID from Step 3
2. Find `YOUR_APPS_SCRIPT_URL` → replace with your Web app URL from Step 2

Also update the `<meta>` tag near the top:
```html
<meta name="google-signin-client_id" content="YOUR_GOOGLE_CLIENT_ID">
```
Replace `YOUR_GOOGLE_CLIENT_ID` there too.

Save the file.

---

## STEP 5 — Host on GitHub Pages (free)

1. Create a free account at [github.com](https://github.com) if you don't have one
2. Click **+** (top right) → **New repository**
   - Repository name: `wellness-tracker`
   - Visibility: **Public** ← required for free GitHub Pages
   - Click **Create repository**
3. On the next screen, click **uploading an existing file**
4. Drag and drop ALL the files from your zip into the upload area:
   - `index.html`
   - `manifest.json`
   - `sw.js`
   - `icon-192.png` (see Note below)
   - `icon-512.png` (see Note below)
5. Click **Commit changes**
6. Go to **Settings → Pages** (left sidebar)
   - Source: **Deploy from a branch**
   - Branch: **main** → folder: **/ (root)**
   - Click **Save**
7. Wait 2 minutes, then your app will be live at:
   `https://YOUR-USERNAME.github.io/wellness-tracker`

> **Note on icons:** The manifest.json references `icon-192.png` and `icon-512.png`.
> For now, you can skip these and the app will still work — you just won't have a custom icon.
> To add a proper icon: create or find a 512×512 PNG image, resize it to both 192px and 512px, and upload both files to your GitHub repo.

---

## STEP 6 — Test it yourself first

1. Open `https://YOUR-USERNAME.github.io/wellness-tracker` on your phone
2. Sign in with your Google account
3. Submit a test check-in
4. Check that the row appeared in your Google Sheet (Sheet tab = "Entries")
5. Check that the dashboard shows data

**If you see a CORS error in the browser console:**
- Go back to your Apps Script deployment
- Click **Deploy → Manage Deployments**
- Click the pencil ✏️ icon → change "Who has access" to **Anyone**
- Save → copy the new URL → update it in index.html → re-upload to GitHub

---

## STEP 7 — Share with users

Each user gets the **same link**: `https://YOUR-USERNAME.github.io/wellness-tracker`

They log in with their own Google account, and they **only ever see their own data**. The Apps Script backend filters rows by email address automatically.

**How users add it to their home screen:**

📱 **iPhone (Safari):**
1. Open the link in Safari (must be Safari, not Chrome)
2. Tap the **Share** button (box with arrow)
3. Scroll down → tap **Add to Home Screen**
4. Tap **Add**

📱 **Android (Chrome):**
1. Open the link in Chrome
2. Tap the **⋮** menu → **Add to Home Screen**
3. Tap **Add**

They now have a single app icon on their home screen. No app store needed.

---

## Adding users

There is nothing to configure to add a new user. Anyone who has your link and signs in with a Google account will automatically get their own private data space. Their data is isolated by their Google email — they cannot see anyone else's entries.

If you ever want to **restrict access** to only certain people, let me know — we can add an email allowlist to the Apps Script.

---

## Scaling & Costs

| Users | Cost |
|---|---|
| 1–100 | **$0/month** |
| 100–1,000 | Still **$0/month** (Google's free quotas are very generous) |
| 1,000+ | May need Google Workspace, but that's a great problem to have |

At 10 paying customers, the only thing you'd want to spend money on is a **custom domain** (~$12/year via Google Domains or Namecheap), so instead of `username.github.io/wellness-tracker` users see `wellnesstracker.app` or similar.

---

## Troubleshooting

| Problem | Fix |
|---|---|
| Blank screen / won't load | Check browser console for errors. Most common: wrong Client ID |
| "Sign in" button doesn't appear | Make sure the Client ID in the `<meta>` tag and in CONFIG match |
| Data doesn't save | Check that your Apps Script URL is correct and deployed as "Anyone" |
| Chart doesn't show | Need at least 2 entries on different dates |
| CORS error | Re-deploy Apps Script with "Who has access: Anyone" and get a fresh URL |
| "Unauthorized" error | Your Google token expired — just sign out and back in |

---

## File Summary

```
wellness-tracker/
├── index.html      ← The entire app (edit the 3 placeholders in here)
├── manifest.json   ← Makes it installable as a home screen app
├── sw.js           ← Service worker (enables offline/installable)
├── Code.gs         ← Paste this into Google Apps Script
└── SETUP.md        ← This file
```

---

*Built with: Google Apps Script + Google Sheets + Vanilla JS PWA*
*Hosting: GitHub Pages (free)*
*Auth: Google Identity Services (free)*
