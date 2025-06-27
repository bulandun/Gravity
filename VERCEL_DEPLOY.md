# Vercel Deployment Guide for AI Compliance Monitor

## Prerequisites
1. Install Vercel CLI: `npm i -g vercel`
2. Have a Vercel account at [vercel.com](https://vercel.com)
3. Your database URL (PostgreSQL) ready

## Step-by-Step Deployment

### 1. Initialize Vercel Project
```bash
# Login to Vercel
vercel login

# Initialize the project
vercel

# Follow prompts:
# - Link to existing project? N (for new project)
# - Project name: ai-compliance-monitor (or your choice)
# - Directory: ./ (current directory)
# - Override settings? N
```

### 2. Set Environment Variables
```bash
# Add your database URL
vercel env add DATABASE_URL

# Add other required environment variables
vercel env add PGHOST
vercel env add PGUSER
vercel env add PGPASSWORD
vercel env add PGDATABASE
vercel env add PGPORT
```

### 3. Configure Build Settings
The project is already configured with:
- ✅ `vercel.json` - Vercel configuration
- ✅ `api/index.ts` - Serverless function entry point
- ✅ Build scripts ready

### 4. Deploy
```bash
# Deploy to production
vercel --prod

# Your app will be available at:
# https://your-project-name.vercel.app
```

### 5. Update URLs After Deployment
After deployment, update these files with your actual Vercel URL:

**openapi.yaml:**
```yaml
servers:
  - url: "https://your-actual-vercel-url.vercel.app/api"
```

**ai-plugin.json:**
```json
{
  "api": {
    "url": "https://your-actual-vercel-url.vercel.app/openapi.yaml"
  },
  "logo_url": "https://your-actual-vercel-url.vercel.app/logo.png",
  "contact_email": "support@your-actual-vercel-url.vercel.app"
}
```

### 6. Redeploy with Updated URLs
```bash
vercel --prod
```

## Vercel Configuration Details

### API Routes
- All API endpoints are handled by `/api/index.ts`
- Routes are automatically mapped:
  - `/api/check-output` → Your compliance checking endpoint
  - `/api/metrics` → Dashboard metrics
  - `/api/generate-report` → Audit reports
  - And all other endpoints...

### Static Files
- Frontend built with Vite serves from `/client/dist/`
- OpenAPI spec accessible at `/openapi.yaml`
- Plugin manifest at `/.well-known/ai-plugin.json`

### Environment Variables
Required for production:
- `DATABASE_URL` - PostgreSQL connection string
- `PGHOST`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`, `PGPORT` - Database credentials

## ChatGPT Plugin Setup After Deployment

1. **Get your Vercel URL** from deployment output
2. **Update configuration files** with actual URL
3. **Test API endpoints:**
   ```bash
   curl https://your-app.vercel.app/api/metrics
   curl https://your-app.vercel.app/openapi.yaml
   ```
4. **Install in ChatGPT:**
   - Go to ChatGPT → Settings → Beta Features → Plugins
   - "Develop your own plugin"
   - Enter: `https://your-app.vercel.app`

## Troubleshooting

### Common Issues:
1. **Build fails**: Check that all dependencies are in `package.json`
2. **API not working**: Verify environment variables are set
3. **Database connection**: Ensure DATABASE_URL is correct
4. **CORS errors**: Already configured in routes.ts

### Vercel Logs:
```bash
# View deployment logs
vercel logs

# View function logs
vercel logs --follow
```

## Production Monitoring
- View analytics at vercel.com dashboard
- Monitor function execution times
- Check error rates and performance metrics

## Project Structure for Vercel
```
├── api/
│   └── index.ts          # Serverless function entry
├── client/
│   └── dist/             # Built frontend (auto-generated)
├── server/
│   ├── index.ts          # Express app
│   └── routes.ts         # API routes
├── vercel.json           # Vercel configuration
├── openapi.yaml          # API specification
└── ai-plugin.json        # ChatGPT plugin manifest
```

Your AI Compliance Monitor will be fully functional on Vercel with:
- ✅ HTTPS by default
- ✅ Automatic scaling
- ✅ Global CDN
- ✅ Serverless functions
- ✅ ChatGPT plugin ready