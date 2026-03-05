# Fix white screen / 404 for main.tsx

If you see a **white screen** and **404 for main.tsx**, GitHub is serving the **source** instead of the **built** site.

## Setup (one-time)

This repo uses a **gh-pages branch**: the workflow builds the app and pushes the built files to `gh-pages`. You must tell GitHub Pages to serve that branch.

1. Open **ign-tunayilmaz/eBaySpain** on GitHub → **Settings** → **Pages**.
2. Under **Build and deployment** → **Source**, choose **"Deploy from a branch"**.
3. **Branch**: select **gh-pages**. **Folder**: leave as **/ (root)**. Save.
4. Go to the **Actions** tab → run **"Deploy to GitHub Pages"** once (Run workflow). Wait until it finishes (green check).

The workflow creates/updates the `gh-pages` branch with the built site. Once Pages is set to that branch, the site will work at:

**https://ign-tunayilmaz.github.io/eBaySpain/**
