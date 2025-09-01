# DigitalOcean Deployment Guide

## Prerequisites

1. **DigitalOcean Account**: Sign up at https://digitalocean.com
2. **Domain Name**: Purchase a domain (e.g., notarynow.com)
3. **GitHub Repository**: Push your code to GitHub
4. **DigitalOcean CLI**: Install doctl

## Step 1: Install DigitalOcean CLI

```bash
# macOS
brew install doctl

# Linux
curl -sL https://do.co/install-doctl.sh | sh

# Windows
# Download from https://github.com/digitalocean/doctl/releases
```

## Step 2: Authenticate with DigitalOcean

```bash
doctl auth init
# Enter your DigitalOcean API token
```

## Step 3: Create Database

```bash
# Create MongoDB database
doctl databases create notarynow-db \
  --engine mongodb \
  --version "6.0" \
  --size db-s-1vcpu-1gb \
  --region nyc1

# Get database connection details
doctl databases get notarynow-db
```

## Step 4: Deploy Backend

```bash
# Deploy backend application
doctl apps create --spec deployment/backend-app.yaml

# Get the app ID and URL
doctl apps list
```

## Step 5: Deploy Frontend

```bash
# Deploy frontend application
doctl apps create --spec deployment/frontend-app.yaml

# Get the app ID and URL
doctl apps list
```

## Step 6: Configure Domain

```bash
# Add your domain to DigitalOcean
doctl domains create notarynow.com

# Create DNS records
doctl compute domain create notarynow.com

# Add A record for main domain
doctl compute domain records create notarynow.com \
  --record-type A \
  --record-name @ \
  --record-data <LOAD_BALANCER_IP>

# Add CNAME for www subdomain
doctl compute domain records create notarynow.com \
  --record-type CNAME \
  --record-name www \
  --record-data @

# Add wildcard for tenant subdomains
doctl compute domain records create notarynow.com \
  --record-type CNAME \
  --record-name "*" \
  --record-data @
```

## Step 7: Set Environment Variables

```bash
# Backend environment variables
doctl apps update <BACKEND_APP_ID> \
  --set-env-vars NODE_ENV=production \
  --set-env-vars MONGODB_URI=<MONGODB_CONNECTION_STRING> \
  --set-env-vars JWT_SECRET=<YOUR_JWT_SECRET> \
  --set-env-vars CORS_ORIGIN=https://notarynow.com,https://*.notarynow.com

# Frontend environment variables
doctl apps update <FRONTEND_APP_ID> \
  --set-env-vars VITE_API_URL=https://api.notarynow.com \
  --set-env-vars VITE_APP_ENV=production
```

## Step 8: Configure SSL Certificates

```bash
# DigitalOcean automatically provisions SSL certificates
# No additional configuration needed
```

## Step 9: Test Deployment

```bash
# Test main domain
curl https://notarynow.com

# Test tenant subdomain
curl https://tenant1.notarynow.com

# Test admin subdomain
curl https://admin.notarynow.com
```

## Step 10: Monitor and Scale

```bash
# View application logs
doctl apps logs <APP_ID>

# Scale applications
doctl apps update <APP_ID> --set-env-vars INSTANCE_COUNT=3

# Monitor performance
doctl apps get <APP_ID>
```

## Environment Variables Reference

### Backend Variables
- `NODE_ENV`: production
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `CORS_ORIGIN`: Allowed origins for CORS

### Frontend Variables
- `VITE_API_URL`: Backend API URL
- `VITE_APP_ENV`: production

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   ```bash
   # Check database status
   doctl databases get notarynow-db
   
   # Verify connection string
   doctl databases get notarynow-db --format Connection
   ```

2. **Subdomain Not Working**
   ```bash
   # Check DNS records
   doctl compute domain records list notarynow.com
   
   # Verify wildcard record exists
   dig *.notarynow.com
   ```

3. **Application Not Starting**
   ```bash
   # Check logs
   doctl apps logs <APP_ID>
   
   # Check environment variables
   doctl apps get <APP_ID> --format EnvVars
   ```

### Performance Optimization

1. **Enable CDN**
   ```bash
   # DigitalOcean Spaces for static assets
   doctl spaces create notarynow-assets
   ```

2. **Database Optimization**
   ```bash
   # Upgrade database size
   doctl databases resize notarynow-db --size db-s-2vcpu-4gb
   ```

3. **Load Balancer**
   ```bash
   # Create load balancer
   doctl compute load-balancer create \
     --name notarynow-lb \
     --region nyc1 \
     --forwarding-rules protocol:http,entry-port:80,target-port:80 \
     --health-check protocol:http,port:80,path:/health
   ```

## Cost Estimation

- **App Platform**: $12/month (2 instances)
- **Database**: $15/month (1GB RAM)
- **Load Balancer**: $12/month
- **Domain**: $12/year
- **Total**: ~$39/month

## Security Best Practices

1. **Environment Variables**: Never commit secrets to Git
2. **Database Access**: Use private networks
3. **SSL**: Always use HTTPS
4. **CORS**: Restrict origins properly
5. **Rate Limiting**: Implement API rate limiting
6. **Monitoring**: Set up alerts for downtime
