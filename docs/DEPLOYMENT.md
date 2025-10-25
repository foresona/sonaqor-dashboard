# Deployment Guide - Sonaqor Dashboard

This guide covers deploying the Sonaqor Partner Dashboard to production.

## Recommended: Vercel Deployment (5 minutes)

### Why Vercel?
- ✅ Built specifically for Next.js applications
- ✅ Zero configuration deployment
- ✅ Automatic HTTPS and CDN
- ✅ Free tier for hobby/personal projects
- ✅ GitHub integration with preview deployments
- ✅ Serverless functions support
- ✅ Built-in analytics and monitoring

### Prerequisites
- GitHub account with repository access
- Vercel account (free tier is sufficient)

### Step-by-Step Deployment

#### 1. Prepare Your Repository

Ensure these files are committed:
```bash
git status
git add .
git commit -m "Prepare for deployment"
git push origin main
```

#### 2. Deploy to Vercel

**Option A: Using Vercel Dashboard (Easiest)**

1. Go to [vercel.com](https://vercel.com)
2. Click "Sign Up" or "Log In" with GitHub
3. Click "Add New Project"
4. Import your `sonaqor-dashboard` repository
5. Configure project:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
6. Click "Deploy"

Your dashboard will be live in 2-3 minutes! 🎉

**Option B: Using Vercel CLI**

```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to project
cd /Users/abrahamjr.agiri/Documents/Archive/workspace/foresona/sonaqor-dashboard

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

#### 3. Environment Variables (if needed)

If you plan to connect to a real backend API:

1. In Vercel Dashboard → Project Settings → Environment Variables
2. Add variables:
   ```
   NEXT_PUBLIC_API_URL=https://api.sonaqor.com
   NEXT_PUBLIC_APP_URL=https://dashboard.sonaqor.com
   ```

#### 4. Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain (e.g., `dashboard.sonaqor.com`)
3. Update DNS records as instructed
4. SSL certificate is automatically provisioned

### Post-Deployment

Your dashboard will be available at:
- Production: `https://sonaqor-dashboard.vercel.app`
- Custom domain: `https://dashboard.sonaqor.com` (if configured)

Every git push to `main` automatically deploys to production.
Pull requests get preview URLs like: `https://sonaqor-dashboard-git-feature-username.vercel.app`

---

## Alternative: DigitalOcean Deployment

### Why DigitalOcean?
- Full server control
- Better for backend services
- Can run databases on same server
- Good for learning DevOps

### Cost Comparison

| Service | Vercel | DigitalOcean |
|---------|--------|--------------|
| Hobby/Free Tier | ✅ Free | ❌ $6/month minimum |
| Custom Domains | ✅ Free | ✅ Free |
| SSL Certificates | ✅ Free | ✅ Free (Let's Encrypt) |
| Auto-Scaling | ✅ Yes | ⚠️ Manual |
| Deployment | ✅ Git push | ⚠️ Manual/CI setup |
| Server Management | ✅ None | ⚠️ You manage it |

### DigitalOcean Setup (30-45 minutes)

#### 1. Create Droplet

```bash
# Specs: 
# - OS: Ubuntu 22.04 LTS
# - Size: Basic $6/month (1GB RAM)
# - Datacenter: Closest to your users
```

#### 2. SSH into Server

```bash
ssh root@your_droplet_ip
```

#### 3. Install Dependencies

```bash
# Update system
apt update && apt upgrade -y

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Install PM2 (process manager)
npm install -g pm2

# Install Nginx
apt install -y nginx

# Install certbot for SSL
apt install -y certbot python3-certbot-nginx
```

#### 4. Clone and Build Application

```bash
# Create app directory
mkdir -p /var/www/sonaqor-dashboard
cd /var/www/sonaqor-dashboard

# Clone repository
git clone https://github.com/foresona/sonaqor-dashboard.git .

# Install dependencies
npm install

# Build production
npm run build
```

#### 5. Configure PM2

```bash
# Create ecosystem file
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'sonaqor-dashboard',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/sonaqor-dashboard',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    }
  }]
}
EOF

# Start application
pm2 start ecosystem.config.js

# Set PM2 to start on boot
pm2 startup
pm2 save
```

#### 6. Configure Nginx

```bash
# Create Nginx config
cat > /etc/nginx/sites-available/sonaqor-dashboard << 'EOF'
server {
    listen 80;
    server_name dashboard.sonaqor.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# Enable site
ln -s /etc/nginx/sites-available/sonaqor-dashboard /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

#### 7. Setup SSL Certificate

```bash
# Get SSL certificate
certbot --nginx -d dashboard.sonaqor.com

# Auto-renew (certbot sets this up automatically)
certbot renew --dry-run
```

#### 8. Setup Deployment Script

```bash
# Create deploy script
cat > /var/www/sonaqor-dashboard/deploy.sh << 'EOF'
#!/bin/bash
cd /var/www/sonaqor-dashboard
git pull origin main
npm install
npm run build
pm2 restart sonaqor-dashboard
EOF

chmod +x deploy.sh
```

### Update Application

```bash
# SSH into server
ssh root@your_droplet_ip

# Run deploy script
cd /var/www/sonaqor-dashboard
./deploy.sh
```

---

## Cost Comparison (Annual)

### Vercel
- **Free Tier**: $0/year
- **Pro Plan**: $240/year ($20/month)
- **Enterprise**: Custom pricing

**Free Tier Limits:**
- 100GB bandwidth
- 100 deployments/day
- Unlimited personal/hobby projects

### DigitalOcean
- **Basic Droplet**: $72/year ($6/month)
- **Production Droplet**: $144/year ($12/month - 2GB RAM)
- **Load Balancer**: $120/year (if needed)
- **Total**: ~$216-264/year minimum

---

## Performance Comparison

| Metric | Vercel | DigitalOcean |
|--------|--------|--------------|
| Global CDN | ✅ Automatic | ⚠️ Manual setup |
| Edge Caching | ✅ Built-in | ❌ Need CloudFlare |
| Image Optimization | ✅ Automatic | ❌ Manual |
| Deploy Time | ~2 minutes | ~5-10 minutes |
| Zero Downtime | ✅ Yes | ⚠️ Need config |
| Rollback | ✅ Instant | ⚠️ Manual |

---

## Recommendation Summary

### Choose Vercel if:
- ✅ You want the simplest deployment
- ✅ You're deploying a Next.js frontend only
- ✅ You want automatic scaling
- ✅ You want preview deployments for PRs
- ✅ Budget is limited (free tier is great)
- ✅ You don't want to manage servers

### Choose DigitalOcean if:
- ✅ You need to run backend services too
- ✅ You need a database on same server
- ✅ You want full server control
- ✅ You're learning DevOps
- ✅ You have compliance requirements for data location

---

## Hybrid Approach (Best of Both Worlds)

**Recommended Setup:**
1. **Frontend** → Vercel (sonaqor-dashboard)
2. **Backend API** → DigitalOcean (sonaqor-core)
3. **Database** → DigitalOcean Managed Database or AWS RDS
4. **CDN/DNS** → Cloudflare (free tier)

This gives you:
- ✅ Fast, globally distributed frontend
- ✅ Full control over backend
- ✅ Managed database with backups
- ✅ Free DDoS protection

---

## Next Steps

### For Vercel Deployment (Recommended):

1. **Now**: Push code to GitHub
2. **5 minutes**: Deploy to Vercel
3. **Later**: Add custom domain
4. **Optional**: Connect to backend API

### For DigitalOcean:

1. **Day 1**: Create droplet and setup server
2. **Day 2**: Configure CI/CD pipeline
3. **Day 3**: Setup monitoring and backups
4. **Ongoing**: Maintain and update server

---

## Support & Resources

### Vercel
- Dashboard: https://vercel.com/dashboard
- Docs: https://vercel.com/docs
- Support: support@vercel.com

### DigitalOcean
- Dashboard: https://cloud.digitalocean.com
- Docs: https://docs.digitalocean.com
- Community: https://www.digitalocean.com/community

### Need Help?
- Check deployment logs in Vercel dashboard
- Use `vercel logs` CLI command
- Review Next.js deployment docs

---

## Production Checklist

Before going live:

- [ ] Environment variables configured
- [ ] Custom domain setup
- [ ] SSL certificate active
- [ ] Analytics enabled
- [ ] Error monitoring setup (Sentry)
- [ ] Backend API connected
- [ ] Authentication working
- [ ] CORS configured correctly
- [ ] Rate limiting enabled
- [ ] SEO meta tags added
- [ ] Privacy policy page
- [ ] Terms of service page
- [ ] Contact/support page

---

**My Recommendation**: Deploy to Vercel for the frontend. It's faster, cheaper, and easier to maintain. Focus your DevOps energy on the backend services where you need more control.
