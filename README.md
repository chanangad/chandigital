# Chan Digital website

Static GitHub Pages site for Chan Digital, the studio behind Roxzone and LoopFace.

## Local preview

```bash
python3 -m http.server 8080
```

Open `http://localhost:8080`.

## Publish on GitHub Pages

### Option A — GitHub Actions (recommended)

1. Push this folder to a GitHub repository on the `main` branch.
2. Open **Settings → Pages**.
3. Set **Build and deployment → Source** to **GitHub Actions**.
4. Push to `main` — the workflow in `.github/workflows/pages.yml` deploys automatically.

### Option B — Branch deploy

1. Push this folder to a GitHub repository.
2. Open **Settings → Pages**.
3. Set the source to **Deploy from a branch**.
4. Select the default branch and `/ (root)`.

No build step is required.
