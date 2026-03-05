# Fix white screen / 404 for main.tsx

If you see a **white screen** and the browser console shows **404 for main.tsx**, GitHub Pages is serving the **source code** instead of the **built** site.

## Fix (one-time)

1. Open your repo on GitHub: **ign-tunayilmaz/eBaySpain** (or your fork).
2. Go to **Settings** → **Pages**.
3. Under **Build and deployment** → **Source**, select **"GitHub Actions"** (not "Deploy from a branch").
4. Save. No need to choose a branch.

After that, every push to `main` will run the workflow, build the app, and deploy the built files. The site will load correctly at:

**https://ign-tunayilmaz.github.io/eBaySpain/**

If Source is set to "Deploy from a branch" and branch `main`, GitHub serves the raw repo (including `index.html` that references `/src/main.tsx`). That file is not published, so you get 404 and a white screen.
