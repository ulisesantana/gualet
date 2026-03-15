# Production Readiness Roadmap

**Created:** February 13, 2026  
**Status:** 🔴 **Not Production Ready**  
**Target:** Production-ready in 6-8 weeks

---

## 🎯 Overview

This document outlines the critical path to make Gualet production-ready. Based on a comprehensive audit (February 2026), the application has **critical blockers** that must be addressed before deployment.

**Key Finding:** While the application has excellent code quality and test coverage, it lacks essential production requirements like GDPR compliance and deployment infrastructure.

---

## 📊 Current State Assessment

### ✅ Strengths
- **Backend:** 99.62% test coverage, 190 tests passing
- **Frontend:** 183 tests passing, clean architecture
- **E2E:** 24/24 active tests passing (100%)
- **i18n:** Complete Spanish/English support
- **Documentation:** Comprehensive ADRs and guides
- **Code Quality:** No TypeScript errors, well-structured

### ❌ Critical Gaps
- **GDPR:** 0% implemented (mandatory for EU)
- **CI/CD:** GitHub Actions workflows removed — not in use at this time (will be set up when deployment is planned)
- **Deployment:** No production configuration exists
- **Security:** Missing headers, rate limiting, CORS config
- **Monitoring:** No logging, error tracking, or alerts

---

## 🚀 Phased Approach

### **Phase 1: GDPR Compliance** (2-3 weeks)
**Priority:** 🔴 **CRITICAL**  
**Blocker:** Legal requirement for EU deployment

#### Week 1: Legal Documents & User Rights
**Estimated Hours:** 40 hours

**Tasks:**
```bash
# Frontend
- [ ] Create Privacy Policy page
  - Location: packages/frontend/src/features/legal/PrivacyPolicyView.tsx
  - Route: /privacy-policy
  - Content: Use PRIVACY_POLICY_TEMPLATE.md
  
- [ ] Create Terms of Service page
  - Location: packages/frontend/src/features/legal/TermsView.tsx
  - Route: /terms
  
- [ ] Add Cookie Consent Banner
  - Component: packages/frontend/src/features/common/ui/CookieConsent.tsx
  - Only essential cookies (auth), no tracking
  - Show once, store consent in localStorage

- [ ] Update Registration Form
  - Add consent checkbox (required, unchecked by default)
  - Link to Privacy Policy and Terms
  - Validate consent before registration

# Backend
- [ ] Add consent tracking to User entity
  - Fields: privacyPolicyConsentDate, marketingConsent
  - Migration: AddConsentTrackingToUsers
  
- [ ] Update RegisterDTO
  - Add privacyPolicyConsent: boolean (required)
  - Validation: @IsBoolean()
  
- [ ] Store consent timestamp on registration
  - Save privacyPolicyConsentDate = now()
  - marketingConsent = false by default
```

**Validation:**
```bash
# Manual testing
1. Register new user → consent checkbox must be checked
2. Check database → privacyPolicyConsentDate is set
3. Visit /privacy-policy → page renders correctly
4. Visit /terms → page renders correctly
```

#### Week 2: Data Rights Implementation
**Estimated Hours:** 40 hours

**Tasks:**
```bash
# Backend - Data Export
- [ ] Create /api/me/data-export endpoint
  - Controller: packages/backend/src/users/user.controller.ts
  - Method: exportData()
  - Response: Complete user data in JSON
  - Include: user, transactions, categories, payment methods, preferences
  
- [ ] Add export service method
  - Location: packages/backend/src/users/user.service.ts
  - Method: exportUserData(userId: string)
  - Aggregate all user data
  - Format as JSON with metadata
  
# Backend - Account Deletion
- [ ] Create DELETE /api/me/account endpoint
  - Controller: packages/backend/src/users/user.controller.ts
  - Method: deleteAccount()
  - Cascade delete all related data
  - Send confirmation email (optional but recommended)
  
- [ ] Test cascade deletion
  - Verify transactions deleted
  - Verify categories deleted
  - Verify payment methods deleted
  - Verify preferences deleted
  - Check foreign key constraints
  
# Frontend - Settings Integration
- [ ] Add "Export My Data" button in Settings
  - Trigger download of JSON file
  - Show loading state during export
  - Success message after download
  
- [ ] Add "Delete My Account" section in Settings
  - Warning message about data loss
  - Confirmation dialog (type email to confirm)
  - Immediate logout after deletion
```

**Validation:**
```bash
# Automated tests
npm run test:backend -- user.controller.spec.ts
npm run test:backend -- user.service.spec.ts

# Manual testing
1. Click "Export My Data" → JSON file downloads
2. Verify JSON contains all user data
3. Click "Delete Account" → confirmation dialog appears
4. Confirm deletion → user logged out, data gone
5. Try to login → user not found
```

#### Week 3: Security Hardening
**Estimated Hours:** 30 hours

**Tasks:**
```bash
# Backend - Security Headers
- [ ] Install helmet
  npm install helmet -w packages/backend
  
- [ ] Configure helmet in main.ts
  - HSTS (max-age: 31536000, includeSubDomains)
  - CSP (default-src: 'self')
  - X-Frame-Options: DENY
  - X-Content-Type-Options: nosniff
  
# Backend - Rate Limiting
- [ ] Install express-rate-limit
  npm install express-rate-limit -w packages/backend
  
- [ ] Configure rate limiting
  - Global: 100 requests per 15 minutes
  - Auth endpoints: 5 login attempts per 15 minutes
  - Apply to /api/auth/* routes
  
# Backend - CORS Configuration
- [ ] Update CORS for production
  - Development: origin: true (all origins)
  - Production: origin: process.env.FRONTEND_URL
  - credentials: true (for cookies)
  
# Backend - Request Size Limits
- [ ] Configure body parser limits
  - JSON: 10mb max
  - URL encoded: 10mb max
  
# Backend - Access Logging
- [ ] Create logging middleware
  - Log: timestamp, method, path, userId, IP, status, duration
  - Store in file: logs/access.log
  - Rotate daily (keep 90 days)
```

**Configuration:**
```typescript
// packages/backend/src/main.ts
import helmet from 'helmet';
import * as rateLimit from 'express-rate-limit';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Security headers
  app.use(helmet({
    hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
  }));
  
  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP',
  });
  app.use(limiter);
  
  // Auth endpoints stricter rate limit
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Too many login attempts',
  });
  app.use('/api/auth/login', authLimiter);
  
  // CORS
  const isProd = process.env.NODE_ENV === 'production';
  app.enableCors({
    origin: isProd ? process.env.FRONTEND_URL : true,
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  });
  
  // ... rest of setup
}
```

**Validation:**
```bash
# Security headers test
curl -I https://your-app.com/api/health
# Should see: Strict-Transport-Security, X-Frame-Options, etc.

# Rate limiting test
for i in {1..10}; do curl https://your-app.com/api/auth/login; done
# Should get 429 Too Many Requests after 5 attempts

# CORS test
curl -H "Origin: https://malicious.com" https://your-app.com/api/health
# Should get CORS error in production
```

**Deliverables:**
- ✅ Privacy Policy and Terms pages live
- ✅ User can export their data (JSON)
- ✅ User can delete their account
- ✅ Security headers configured (Helmet)
- ✅ Rate limiting active
- ✅ CORS properly configured
- ✅ Access logging implemented
- ✅ All GDPR_CHECKLIST.md items checked

---

### **Phase 2: CI/CD Automation** (1 week, deferred)
**Priority:** ⏸️ **Deferred** — GitHub Actions workflows removed, not in use at this time  
**Note:** Will be set up from scratch when deployment infrastructure is ready.

#### What to implement when the time comes

**Day 1-2: Continuous Integration**
Create `.github/workflows/ci.yml` to run on every PR and push to `main`/`develop`:
- Type checking (`npm run typecheck`)
- Linting (`npm run lint`)
- Backend tests with coverage (`npm run test:backend:cov`)
- Frontend tests with coverage (`npm run test:frontend:cov`)

**Day 3-4: E2E Tests in CI**
Create `.github/workflows/e2e.yml`:
- Spin up test database with Docker Compose
- Install Playwright with `npx playwright install --with-deps chromium`
- Run `npm run test:e2e`
- Upload `playwright-report/` as artifact on failure

**Day 5: Deployment Workflow**
Create `.github/workflows/deploy.yml`:
- Run on push to `main`
- Type check and build
- Build Docker image tagged with commit SHA
- Deploy to production server

**Estimated Time:** 1 week  
**Estimated Hours:** 40 hours

**Deliverables (future):**
- ✅ CI runs on every PR
- ✅ Type checking automated
- ✅ Backend and frontend tests in CI
- ✅ E2E tests in CI
- ✅ Deployment workflow active

---

### **Phase 3: Production Infrastructure** (2 weeks)
**Priority:** 🔴 **CRITICAL**  
**Blocker:** Nowhere to deploy the application

#### Week 1: Infrastructure Provisioning
**Estimated Hours:** 40 hours

**Day 1-2: Hosting Setup**
```bash
# Recommended: Hetzner (EU-based, GDPR compliant, affordable)

1. Create Hetzner Cloud account
2. Provision server:
   - Type: CPX31 (4 vCPU, 8GB RAM, 160GB disk)
   - Location: Falkenstein, Germany (EU)
   - OS: Ubuntu 22.04 LTS
   - Cost: ~€15/month

3. Initial server setup:
   - Create non-root user
   - Configure SSH keys
   - Disable password authentication
   - Configure firewall (UFW)
   - Install Docker and Docker Compose
   
4. Provision managed database (alternative: self-hosted PostgreSQL)
   - Hetzner Managed Database
   - PostgreSQL 16
   - Location: Falkenstein
   - Cost: ~€15/month
   - Auto-backups enabled
```

**Day 3: Domain and DNS**
```bash
1. Register domain (or use existing)
   - Example: gualet.app
   - Registrar: Namecheap, CloudFlare, etc.

2. Configure DNS:
   - A record: @ → server IP
   - A record: www → server IP
   - CNAME: api → @ (for api.gualet.app)

3. Wait for DNS propagation (up to 48h)
```

**Day 4-5: SSL/TLS Setup**
```bash
# On server
1. Install Certbot
   sudo apt install certbot python3-certbot-nginx

2. Obtain certificate
   sudo certbot certonly --standalone -d gualet.app -d www.gualet.app -d api.gualet.app

3. Configure auto-renewal
   sudo certbot renew --dry-run
   
4. Set up renewal cron
   0 0 * * * /usr/bin/certbot renew --quiet
```

#### Week 2: Deployment Configuration
**Estimated Hours:** 40 hours

**Create `docker-compose.prod.yml`:**
```yaml
version: '3.8'

services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - /etc/letsencrypt:/etc/letsencrypt:ro
    depends_on:
      - backend
    restart: unless-stopped

  backend:
    build:
      context: .
      dockerfile: Dockerfile
    environment:
      NODE_ENV: production
      DATABASE_URL: ${DATABASE_URL}
      JWT_SECRET: ${JWT_SECRET}
      FRONTEND_URL: https://gualet.app
    volumes:
      - ./logs:/app/logs
    restart: unless-stopped
    networks:
      - app-network

  # Database (if self-hosted)
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: ${POSTGRES_DB}
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backups:/backups
    restart: unless-stopped
    networks:
      - app-network

volumes:
  postgres_data:

networks:
  app-network:
    driver: bridge
```

**Create `nginx.conf`:**
```nginx
events {
    worker_connections 1024;
}

http {
    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=100r/s;
    limit_req_zone $binary_remote_addr zone=auth_limit:10m rate=5r/m;

    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Frontend
    server {
        listen 80;
        listen 443 ssl http2;
        server_name gualet.app www.gualet.app;

        ssl_certificate /etc/letsencrypt/live/gualet.app/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/gualet.app/privkey.pem;

        # Redirect HTTP to HTTPS
        if ($scheme != "https") {
            return 301 https://$server_name$request_uri;
        }

        # Serve static files
        location / {
            root /app/packages/backend/dist/public;
            try_files $uri $uri/ /index.html;
        }

        # API proxy
        location /api {
            limit_req zone=api_limit burst=20 nodelay;
            proxy_pass http://backend:5050;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }

        # Stricter rate limit for auth
        location /api/auth/login {
            limit_req zone=auth_limit burst=2 nodelay;
            proxy_pass http://backend:5050;
            # ... same proxy settings
        }
    }
}
```

**Create `.env.production`:**
```bash
# Database
DATABASE_URL=postgresql://user:password@host:5432/gualet_prod
POSTGRES_DB=gualet_prod
POSTGRES_USER=gualet
POSTGRES_PASSWORD=<generate-strong-password>

# JWT
JWT_SECRET=<generate-with-openssl-rand-base64-32>
JWT_EXPIRES_IN=1h

# Application
NODE_ENV=production
PORT=5050
FRONTEND_URL=https://gualet.app

# Email (if implementing)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=noreply@gualet.app
SMTP_PASSWORD=<smtp-password>
```

**Create backup script `scripts/backup-db.sh`:**
```bash
#!/bin/bash
set -e

BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/gualet_backup_$DATE.sql.gz"

# Backup database
docker exec postgres pg_dump -U $POSTGRES_USER $POSTGRES_DB | gzip > $BACKUP_FILE

# Keep only last 30 days of backups
find $BACKUP_DIR -name "gualet_backup_*.sql.gz" -mtime +30 -delete

echo "Backup completed: $BACKUP_FILE"
```

**Setup cron for daily backups:**
```bash
# Run daily at 2 AM
0 2 * * * /path/to/scripts/backup-db.sh >> /var/log/backup.log 2>&1
```

**Deliverables:**
- ✅ Production server provisioned (EU region)
- ✅ Domain configured with DNS
- ✅ SSL/TLS certificates installed
- ✅ Nginx reverse proxy configured
- ✅ Docker Compose for production ready
- ✅ Environment variables secured
- ✅ Database backups automated
- ✅ Deployment documentation complete

---

### **Phase 4: Monitoring & Observability** (1 week)
**Priority:** 🟡 **High**  
**Blocker:** Cannot operate in production without monitoring

#### Day 1-2: Error Tracking
**Estimated Hours:** 16 hours

**Setup Sentry (Free tier available):**
```bash
# Install Sentry SDKs
npm install @sentry/node @sentry/integrations -w packages/backend
npm install @sentry/react @sentry/tracing -w packages/frontend

# Backend configuration
# packages/backend/src/main.ts
import * as Sentry from '@sentry/node';

async function bootstrap() {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV,
    tracesSampleRate: 0.1, // 10% of transactions
  });
  
  // ... rest of setup
}

# Frontend configuration
# packages/frontend/src/main.tsx
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  integrations: [new Sentry.BrowserTracing()],
  tracesSampleRate: 0.1,
});
```

#### Day 3-4: Logging
**Estimated Hours:** 16 hours

**Implement Winston logger:**
```bash
npm install winston winston-daily-rotate-file -w packages/backend

# Create logger service
# packages/backend/src/common/logger/logger.service.ts
import * as winston from 'winston';
import 'winston-daily-rotate-file';

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    // Console
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
    // File - all logs
    new winston.transports.DailyRotateFile({
      filename: 'logs/app-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxFiles: '90d',
    }),
    // File - errors only
    new winston.transports.DailyRotateFile({
      filename: 'logs/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxFiles: '90d',
    }),
  ],
});
```

#### Day 5: Health Checks & Uptime Monitoring
**Estimated Hours:** 8 hours

**Enhance health endpoint:**
```typescript
// packages/backend/src/health/health.controller.ts
@Get('health')
async getHealth(): Promise<HealthCheck> {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: await this.checkDatabase(),
    memory: process.memoryUsage(),
    version: process.env.npm_package_version,
  };
}

private async checkDatabase(): Promise<{ status: string }> {
  try {
    await this.dataSource.query('SELECT 1');
    return { status: 'connected' };
  } catch (error) {
    return { status: 'error' };
  }
}
```

**Setup UptimeRobot (Free tier):**
1. Create account at uptimerobot.com
2. Add HTTP(s) monitor for https://gualet.app/api/health
3. Check interval: 5 minutes
4. Alert contacts: Email
5. Expected response: 200 OK

**Deliverables:**
- ✅ Sentry error tracking active
- ✅ Winston logging configured
- ✅ Log rotation automated
- ✅ Enhanced health endpoint
- ✅ Uptime monitoring with alerts

---

### **Phase 5: Quality Assurance** (1-2 weeks)
**Priority:** 🟡 **High**  
**Goal:** Complete test coverage and documentation

#### Week 1: Test Coverage Completion

**Enable Skipped E2E Tests:**
```bash
# packages/e2e/tests/payment-methods.spec.ts
# Remove .skip from all tests
test('should create payment method', async ({ page }) => {
  // ... test implementation
});

# packages/e2e/tests/network-errors.spec.ts
# Remove .skip from all tests
test('should handle network errors', async ({ page }) => {
  // ... test implementation
});

# Fix any failing tests
npm run test:e2e
```

**Improve Frontend Coverage:**
```bash
# Target: >90% coverage
# Focus areas:
- Repository implementations
- Error handling in data sources
- Edge cases in forms
- Loading states
- Network error scenarios

# Add missing tests
npm run test:frontend:cov
# Check coverage report
open packages/frontend/coverage/lcov-report/index.html
```

#### Week 2: Storybook & Documentation (Optional)

**Create Storybook Stories:**
```bash
# Install Storybook (already configured)
npm run storybook

# Create stories for main components
# packages/frontend/src/features/categories/ui/CategoryCard/CategoryCard.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { CategoryCard } from './CategoryCard';

const meta: Meta<typeof CategoryCard> = {
  title: 'Categories/CategoryCard',
  component: CategoryCard,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CategoryCard>;

export const Expense: Story = {
  args: {
    category: {
      id: '1',
      name: 'Groceries',
      type: 'OUTCOME',
      icon: '🛒',
      color: '#FF5733',
    },
  },
};

export const Income: Story = {
  args: {
    category: {
      id: '2',
      name: 'Salary',
      type: 'INCOME',
      icon: '💰',
      color: '#28A745',
    },
  },
};
```

**Deliverables:**
- ✅ E2E tests: 45/45 passing (100%)
- ✅ Frontend coverage: >90%
- ✅ Storybook stories for main components
- ✅ Documentation updated

---

## 📅 Timeline Summary

| Phase | Duration | Effort | Priority |
|-------|----------|--------|----------|
| Phase 1: GDPR Compliance | 2-3 weeks | 110 hours | 🔴 Critical |
| Phase 2: CI/CD Automation | 1 week | 40 hours | ⏸️ Deferred |
| Phase 3: Production Infrastructure | 2 weeks | 80 hours | 🔴 Critical |
| Phase 4: Monitoring & Observability | 1 week | 40 hours | 🟡 High |
| Phase 5: Quality Assurance | 1-2 weeks | 40-80 hours | 🟡 High |
| **Total** | **7-9 weeks** | **310-350 hours** | - |

**Assumptions:**
- Full-time work: 40 hours/week = 7-9 weeks
- Part-time work: 20 hours/week = 14-18 weeks
- Includes buffer for testing and documentation

---

## ✅ Production Readiness Checklist

Use this checklist before deploying to production:

### Legal & Compliance
- [ ] Privacy Policy page live
- [ ] Terms of Service page live
- [ ] Cookie consent banner implemented
- [ ] User can export their data
- [ ] User can delete their account
- [ ] GDPR compliance verified
- [ ] Data hosted in EU region

### Security
- [ ] Security headers configured (Helmet)
- [ ] Rate limiting active
- [ ] CORS restricted to production domain
- [ ] HTTPS enforced (no HTTP allowed)
- [ ] Secrets in environment variables (not in code)
- [ ] Database connection encrypted
- [ ] No sensitive data in logs
- [ ] Security audit completed

### Infrastructure
- [ ] Production server provisioned
- [ ] Domain configured with SSL
- [ ] Database backups automated
- [ ] Nginx reverse proxy configured
- [ ] Health checks monitored
- [ ] Error tracking active (Sentry)
- [ ] Logging configured (Winston)
- [ ] Uptime monitoring active

### Quality Assurance
- [ ] All tests passing (backend, frontend, e2e)
- [ ] Test coverage >90% (backend and frontend)
- [ ] No TypeScript errors
- [ ] No ESLint errors
- [ ] Load testing completed
- [ ] Performance optimized

### Operations
- [ ] CI/CD pipeline set up (deferred — will be created when deployment is planned)
- [ ] Deployment documented
- [ ] Rollback procedure tested
- [ ] Incident response plan created
- [ ] Team trained on operations
- [ ] Monitoring alerts configured

---

## 🚨 Known Risks & Mitigation

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| GDPR non-compliance penalties | High | Medium | Complete Phase 1 before launch |
| Security breach | High | Low | Implement all security measures |
| Deployment failures | Medium | Medium | Test deployment on staging first |
| Database data loss | High | Low | Automated backups + test restore |
| Service downtime | Medium | Medium | Health checks + uptime monitoring |
| Performance issues | Medium | Low | Load testing + monitoring |

---

## 📞 Next Steps

**Immediate Actions (This Week):**

1. **Review this roadmap** with team/stakeholders
2. **Prioritize phases** based on business needs
3. **Set up project board** with tasks from each phase
4. **Assign owners** for each phase
5. **Schedule kickoff** for Phase 1 (GDPR)

**Recommended Approach:**
- Start with Phase 1 (GDPR) - non-negotiable for EU
- Phase 2 (CI/CD) is deferred — workflows removed; will be set up when deployment is planned
- Phase 3 (Infrastructure) depends on deployment timeline
- Phases 4-5 can be done incrementally

**Questions to Answer:**
- When is the target launch date?
- Is the team full-time or part-time on this?
- What is the budget for hosting/tools?
- Do we need legal review of Privacy Policy/Terms?
- Are we deploying EU-only or globally?

---

**Last Updated:** March 15, 2026  
**Next Review:** After Phase 1 completion  
**Owner:** Development Team
