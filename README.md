# AI Compliance Monitor - ChatGPT Plugin Setup

This is a comprehensive AI compliance monitoring system for MedTech that can be integrated as a ChatGPT plugin.

## API Endpoints

### Core Compliance Features
- `POST /api/check-output` - Check AI output for compliance violations
- `POST /api/scan-training-data` - Scan training datasets for risks
- `GET /api/metrics` - Get real-time compliance metrics
- `GET /api/logs` - Retrieve AI output check logs
- `GET /api/alerts` - Get compliance alerts

### Reporting & Analysis
- `GET /api/report/{id}` - Get specific audit report
- `POST /api/generate-report` - Generate new audit report
- `GET /api/drift-data` - Get model drift information
- `GET /api/bias-results` - Get bias detection results

## ChatGPT Plugin Integration

### 1. Deploy Your API

You need to deploy this application to a public HTTPS endpoint. Options include:

**Replit (Current deployment):**
- Already deployed at: `https://ai-compliance-shield-brendandonnell3.replit.app`
- OpenAPI spec available at: `https://ai-compliance-shield-brendandonnell3.replit.app/openapi.yaml`
- Plugin manifest at: `https://ai-compliance-shield-brendandonnell3.replit.app/.well-known/ai-plugin.json`

**Other hosting options:**
- Vercel: `npm run build` then deploy
- Render: Connect your GitHub repo
- Railway: Connect your GitHub repo
- AWS/GCP/Azure: Use their container services

### 2. Update Configuration Files

After deployment, update these files with your actual domain. If deploying to Vercel, for example `https://gravity-topaz.vercel.app`, the configuration would look like:

**ai-plugin.json:**
```json
{
  "api": {
    "url": "https://gravity-topaz.vercel.app/openapi.yaml"
  },
  "logo_url": "https://gravity-topaz.vercel.app/logo.png",
  "contact_email": "support@gravity-topaz.vercel.app",
  "legal_info_url": "https://gravity-topaz.vercel.app/legal"
}
```

**openapi.yaml:**
```yaml
servers:
  - url: https://gravity-topaz.vercel.app/api
    description: Production API Server
```

### 3. Install in ChatGPT

1. Go to ChatGPT (requires ChatGPT Plus/Pro)
2. Click on your profile → Settings → Beta Features
3. Enable "Plugins"
4. Go to GPT-4 → Plugins → Plugin Store
5. Click "Develop your own plugin"
6. Enter your domain: `https://your-actual-domain.com`
7. ChatGPT will automatically read your manifest and install the plugin

### 4. Test the Plugin

Try these example prompts in ChatGPT:

```
"Check this AI output for HIPAA compliance: 'Patient John Smith, DOB 1/15/1980, has diabetes'"

"Generate a HIPAA compliance audit report for our medical AI system"

"What are the current compliance metrics for our AI models?"

"Scan this training data for privacy risks and bias issues"
```

## Local Development

Run the setup script once to install dependencies:

```bash
# Install dependencies
npm run setup

# Start development server
npm run dev

# Push database schema
npm run db:push
```

After dependencies are installed, you can verify TypeScript types with:

```bash
npm run check
```

## Environment Variables Required

```env
DATABASE_URL=your_postgresql_connection_string
```

## API Features

### Compliance Checking
- Real-time AI output scanning for PHI/PII
- Risk scoring (0-1 scale)
- HIPAA and GDPR violation detection
- Automated flagging and blocking

### Training Data Analysis
- Upload CSV, JSON, or XLSX files
- Privacy risk assessment
- Bias detection across demographics
- Missing documentation identification

### Audit Reporting
- HIPAA, GDPR, FDA compliance reports
- Automated findings generation
- PDF report generation
- Compliance recommendations

### Monitoring & Analytics
- Real-time compliance dashboards
- Model drift detection
- Bias monitoring across groups
- Alert management system

## ChatGPT Use Cases

Once installed, the plugin enables ChatGPT to:

1. **Compliance Checking**: Analyze any AI output for regulatory compliance
2. **Risk Assessment**: Evaluate training datasets for privacy and bias risks
3. **Audit Support**: Generate compliance reports for regulatory submissions
4. **Monitoring**: Check real-time compliance status of AI systems
5. **Recommendations**: Get specific guidance on compliance improvements

## Security Notes

- API includes CORS headers for external access
- No authentication required for demo purposes
- In production, implement proper API authentication
- Ensure HTTPS for all communications
- Store sensitive data securely

## Support

For issues with plugin installation or API integration, check:
1. Your domain is accessible via HTTPS
2. OpenAPI spec validates at https://editor.swagger.io/
3. Plugin manifest follows ChatGPT requirements
4. CORS headers are properly configured