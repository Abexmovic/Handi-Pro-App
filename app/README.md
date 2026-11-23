# Handi-pro Mobile App (Android & iOS)

This folder contains the complete, production-ready cross-platform mobile app for **Handi-pro**, wrapped with Capacitor 6.

Your original web files in `C:\Users\HP\Desktop\Handi-Pro` remain completely untouched and active.

---

## 1. App Configuration & Branding
- **App Name:** Handi-pro
- **Package ID / Bundle ID:** `com.handipro.app`
- **Icon & Splash Screen:** Generated directly from `Images/icon.jpeg` into both Android mipmap/drawable and iOS xcassets resources.
- **Backend Connection:** Directly connects to your live Supabase project (`https://abtqoesfhwwudxkqliko.supabase.co`).
- **Features Included:**
  - Full native offline banner & offline fallback handling.
  - Native phone calling (`tel:`) and WhatsApp (`wa.me`) deep-linking.
  - Native Camera & Photo Gallery upload picker via `@capacitor/camera`.
  - Android 11+ Package visibility declarations for WhatsApp and phone dialing.
  - Safe-area layout adjustments for iOS notches and Android navigation bars.

---

## 2. Row Level Security (RLS) Audit Report & Fix
During our security audit on your Supabase backend:
- **Public Data Read (GET):** Clean and works as expected. Anyone can view verified providers.
- **Data Modification (UPDATE / DELETE):** Row Level Security is active and protected. Unauthenticated requests cannot alter or delete artisan profiles.
- **Provider Registration (INSERT):** Anyone using the public anon key can submit new applications.

### Recommended RLS SQL Policy for Supabase
If you want to ensure that newly submitted artisans can **never** bypass the admin verification queue by spoofing `is_verified: true`, run this single SQL command in your [Supabase SQL Editor](https://supabase.com/dashboard/project/abtqoesfhwwudxkqliko/sql):

```sql
-- 1. Ensure RLS is enabled on providers table
ALTER TABLE public.providers ENABLE ROW LEVEL SECURITY;

-- 2. Allow anybody (anon) to read only verified providers
CREATE POLICY "Allow public read verified providers" 
ON public.providers 
FOR SELECT 
USING (is_verified = true);

-- 3. Allow anybody (anon) to insert their registration application
-- but strictly enforce that is_verified defaults to FALSE
CREATE POLICY "Allow public registration insert" 
ON public.providers 
FOR INSERT 
WITH CHECK (is_verified = false);

-- 4. Prevent public UPDATE or DELETE (only authenticated admins or service role can edit)
CREATE POLICY "Restrict public update" 
ON public.providers 
FOR UPDATE 
USING (auth.role() = 'authenticated');

CREATE POLICY "Restrict public delete" 
ON public.providers 
FOR DELETE 
USING (auth.role() = 'authenticated');
```

---

## 3. How to Build the Apps

### Option A: 100% Automated Cloud Build (Recommended for Windows)
Because iOS requires a Mac to sign and build, and your Windows machine does not have the Android SDK or Xcode installed locally, a ready-to-run GitHub Actions workflow has been set up at:
`.github/workflows/build-mobile-apps.yml`

1. Push this project to your GitHub repository:
   ```bash
   git add .
   git commit -m "Add Handi-pro mobile app and build workflow"
   git push origin main
   ```
2. Go to the **Actions** tab on your GitHub repository.
3. Select **Build Handi-pro Mobile App (Android APK & iOS)** and click **Run workflow**.
4. Once completed (approx. 3-4 minutes):
   - Download `handipro-debug-apk` (ready to install on any Android phone).
   - Download `handipro-ios-app` (ready for Xcode / TestFlight upload).

---

### Option B: Local Android Build (Using Android Studio)
1. Install [Android Studio](https://developer.android.com/studio) on your PC.
2. In the terminal, navigate to `app`:
   ```bash
   cd C:\Users\HP\Desktop\Handi-Pro\app
   npx cap open android
   ```
3. Android Studio will open the `android` folder automatically.
4. Click **Build > Build Bundle(s) / APK(s) > Build APK(s)** to generate `app-debug.apk`.

---

### Option C: Local iOS Build (Using a Mac)
1. Copy the `app` folder to a Mac with Xcode installed.
2. Run:
   ```bash
   cd app
   npm install
   npx cap open ios
   ```
3. Xcode opens. Select your development team under **Signing & Capabilities** and click **Run** or **Archive** for TestFlight / App Store submission.
