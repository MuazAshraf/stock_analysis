# Railway Deployment Guide

A personal checklist so I never debug the same Railway issues again.

---

## 1. Railway Service Settings

| Setting | Value | Notes |
|---------|-------|-------|
| **Root Directory** | `/backend` | Set to your backend folder if monorepo |
| **Watch Paths** | `/backend/**` | Only changes inside this path trigger deploys |
| **Branch** | `master` | Confirm correct branch is connected |
| **Start Command** | `python main.py` | Relative to root directory |
| **Healthcheck Path** | `/api/health` | Must return 200, not 400/404 |
| **Builder** | RAILPACK | Railway's default builder |

---

## 2. TrustedHostMiddleware (THE BIGGEST TRAP)

Railway's healthcheck uses internal IPs/hostnames that you **cannot predict**. If you restrict hosts, the healthcheck gets a `400 Bad Request`, the deploy fails, and Railway keeps the old deploy active — making it look like your new code never deployed.

**Wildcards like `*.railway.internal` DO NOT WORK** — TrustedHostMiddleware only supports exact hostnames or `"*"`.

### Fix: Just allow all hosts

```python
from fastapi.middleware.trustedhost import TrustedHostMiddleware

app.add_middleware(TrustedHostMiddleware, allowed_hosts=["*"])
```

CORS already protects which browsers can call your API. TrustedHostMiddleware with `"*"` is fine.

### How to know this is the problem
- Healthcheck keeps failing
- Deploy Logs show `400 Bad Request` on `/api/health`
- Old deploy stays ACTIVE, new ones go to FAILED in history

---

## 3. CORS Configuration

Add **all** your frontend domains:

```python
allowed_origins = [
    "http://localhost:3000",           # local Next.js dev
    "http://127.0.0.1:3000",          # local alt
    "https://yourdomain.com",          # production (Vercel)
    "https://your-app.vercel.app",     # Vercel preview URL
]
```

> If using pydantic-settings, set `PSX_ALLOWED_ORIGINS` as a comma-separated string in Railway Variables.

---

## 4. Port Binding

Railway gives you a `PORT` environment variable. Your app **must** use it:

```python
import os
port = int(os.environ.get("PORT", 8000))
uvicorn.run("main:app", host="0.0.0.0", port=port)
```

- Bind to `0.0.0.0` (not `127.0.0.1`)
- Never hardcode the port

---

## 5. Environment Variables

Go to Railway → **Variables** tab and add:

- API keys, SMTP credentials, secrets
- `PSX_ALLOWED_ORIGINS` (if using pydantic-settings env_prefix)
- Any `.env` values your app needs — Railway doesn't read `.env` files

---

## 6. Connecting Frontend (Vercel) to Backend (Railway)

1. **Railway**: Settings → Networking → Custom Domain → add `api.yourdomain.com`
2. **DNS**: Add a CNAME record pointing `api.yourdomain.com` → your Railway `.up.railway.app` URL
3. **Vercel**: Set env variable `NEXT_PUBLIC_API_URL=https://api.yourdomain.com`
4. **Backend CORS**: Add `https://yourdomain.com` to allowed origins

---

## 7. Debugging Failed Deploys

| Symptom | Check | Likely Cause |
|---------|-------|-------------|
| Healthcheck fails, 400 | Deploy Logs | `TrustedHostMiddleware` blocking Railway's internal requests |
| Healthcheck fails, 404 | Deploy Logs | Wrong healthcheck path or route not registered |
| Healthcheck fails, 500 | Deploy Logs | App crashing — missing env var or import error |
| Build fails | Build Logs | Missing dependency or Python version issue |
| Old commit stays ACTIVE | History tab | New deploys are failing — check the FAILED ones in history |
| Push doesn't trigger deploy | Watch Paths | Your changed files are outside the watch path |

---

## 8. Common Gotchas

- **`railway.json`** lives in repo root, NOT inside `/backend`
- **Watch Paths** filter deploys — changing `railway.json` (root level) won't trigger if watch path is `/backend/**`
- **"Redeploy" button** re-runs the **same old commit**, not your latest code. Push new code instead.
- **Python version**: Railway defaults to 3.13. Add `.python-version` file in your root directory if you need 3.12
- **Serverless mode**: If enabled, containers scale to zero when idle — first request will be slow (cold start)

---

## 9. railway.json Template

```json
{
  "$schema": "https://railway.com/railway.schema.json",
  "build": {
    "builder": "RAILPACK"
  },
  "deploy": {
    "startCommand": "python main.py",
    "healthcheckPath": "/api/health",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 3
  }
}
```

---

## 10. Quick Sanity Check Before Deploying

- [ ] `TrustedHostMiddleware` uses `allowed_hosts=["*"]`
- [ ] App reads `PORT` from environment
- [ ] App binds to `0.0.0.0`
- [ ] `/api/health` endpoint exists and returns 200
- [ ] CORS includes your Vercel production domain
- [ ] All secrets are in Railway Variables tab
- [ ] `railway.json` is in repo root
- [ ] Watch Paths match where your code lives
