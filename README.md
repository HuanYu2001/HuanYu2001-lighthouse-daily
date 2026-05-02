# Lighthouse Daily

Static news site for GitHub Pages, with content updated by `n8n` and Google AI Studio.

## Project files

- `index.html`: home page
- `categories/`: category pages
- `archive/`: archive landing page
- `news-render.js`: client-side renderer for `news-data.json`
- `news-data.json`: latest generated content
- `archive-list.json`: archive metadata used by n8n
- `n8n-workflow.json`: workflow template to import into n8n

## Before first deploy

1. Create or confirm your GitHub repository.
2. Import the workflow into n8n.
3. Configure credentials in n8n:
   - GitHub PAT
   - Gemini API key
4. Run the workflow once manually.

## Connect this local folder to GitHub

Run these commands in this folder after replacing the values:

```powershell
git init
git branch -M main
git remote add origin https://github.com/HuanYu2001/HuanYu2001-lighthouse-daily.git
git add .
git commit -m "Initial project import"
git push -u origin main
```

If the remote already exists, use:

```powershell
git remote set-url origin https://github.com/HuanYu2001/HuanYu2001-lighthouse-daily.git
```

## GitHub Pages

In your repository settings:

1. Open `Settings` -> `Pages`
2. Set source to `Deploy from a branch`
3. Select branch `main`
4. Select folder `/ (root)`

Your site URL will be:

`https://huanyu2001.github.io/HuanYu2001-lighthouse-daily/`

## Notes

- `news-data.json` and `archive-list.json` are included so the site does not start with missing-file errors.
- The workflow still needs valid GitHub and Gemini credentials before it can publish updates.
- The current workflow only updates `news-data.json`, `archive-list.json`, and archive pages. The home and category pages read data from `news-data.json` directly.
