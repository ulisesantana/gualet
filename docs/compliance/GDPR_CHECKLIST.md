# GDPR Implementation Checklist

⚠️ **Use this checklist before deploying to production in the EU**

## 🚨 Critical (MUST do before launch)

### Legal Documents
- [ ] Create Privacy Policy page
- [ ] Create Terms of Service page
- [ ] Add links to footer and registration page
- [ ] Add consent checkbox to registration form (unchecked by default)
- [ ] Store consent timestamp in database

### Security
- [ ] Enable HTTPS only (force redirect)
- [ ] Update cookie settings: `secure: true, sameSite: 'strict'` in production
- [ ] Add CORS configuration (whitelist frontend domain only)
- [ ] Implement rate limiting on authentication endpoints
- [ ] Add security headers (HSTS, CSP, X-Frame-Options)
- [ ] Remove `2>&1` from any commands (as per coding instructions)

### User Rights Implementation
- [ ] Implement account deletion endpoint (`DELETE /api/me/account`)
- [ ] Implement data export endpoint (`GET /api/me/data-export`)
- [ ] Test cascade deletion of all user data
- [ ] Send confirmation email on account deletion

### Data Protection
- [ ] Database in EU region/data center
- [ ] Enable database encryption at rest
- [ ] Verify all connections use SSL/TLS
- [ ] No data transfers outside EU

### Code Updates Needed

#### 1. User Entity - Add Consent Tracking
**File:** `packages/backend/src/db/entities/user.entity.ts`
```typescript
@Column({ type: 'timestamp', nullable: true })
privacyPolicyConsentDate: TimeString;

@Column({ default: false })
marketingConsent: boolean;
```

#### 2. Registration DTO - Add Consent
**File:** `packages/backend/src/auth/dto/requests/register.dto.ts`
```typescript
@ApiProperty({
  description: 'User consent to privacy policy',
  example: true,
})
@IsBoolean()
privacyPolicyConsent: boolean;
```

#### 3. Main App - Security Headers & CORS
**File:** `packages/backend/src/main.ts`
```typescript
import helmet from 'helmet';
import * as rateLimit from 'express-rate-limit';

// Add after app creation
app.use(helmet({
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
}));

app.enableCors({
  origin: config.get('FRONTEND_URL'),
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
});

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);
```

#### 4. User Service - Data Export
**File:** `packages/backend/src/users/user.service.ts`
```typescript
async exportUserData(userId: string) {
  // Implementation in GDPR_COMPLIANCE.md
}
```

#### 5. User Controller - Account Deletion
**File:** Create `packages/backend/src/users/user.controller.ts`
```typescript
@Delete('me/account')
@UseGuards(JwtAuthGuard)
async deleteAccount(@Req() req, @Res() res) {
  // Implementation in GDPR_COMPLIANCE.md
}
```

---

## ⚡ Important (Within 30 days of launch)

### Monitoring & Logging
- [ ] Implement access logging
- [ ] Log authentication attempts
- [ ] Set up security alerts
- [ ] Create log retention policy (90 days recommended)

### Documentation
- [ ] Complete DATA_PROCESSING_RECORD.md with your information
- [ ] Document hosting provider and location
- [ ] Create data breach response plan
- [ ] Document data retention policy

### Testing
- [ ] Test account deletion flow
- [ ] Test data export completeness
- [ ] Verify cascade deletion works
- [ ] Test consent mechanism

---

## 📋 Nice to Have (Improve compliance)

### Features
- [ ] Implement account suspension (pause processing)
- [ ] Add data retention cleanup job (inactive accounts)
- [ ] Implement login history for users
- [ ] Add password change functionality
- [ ] Add email change with verification

### Monitoring
- [ ] Set up uptime monitoring
- [ ] Configure automated backups
- [ ] Test backup restoration
- [ ] Create disaster recovery plan

---

## 📝 Dependencies to Install

```bash
# Backend security packages
cd packages/backend
npm install helmet express-rate-limit
npm install @types/express-rate-limit --save-dev
```

---

## 🌍 Deployment Checklist

### Environment Variables
```bash
# .env.production
NODE_ENV=production
FRONTEND_URL=https://your-domain.eu  # Your actual domain
DATABASE_URL=postgresql://...         # EU-based database
JWT_SECRET=...                        # Strong secret (64+ chars)
POSTGRES_SSL_MODE=require
```

### Hosting Requirements
- [ ] Server located in EU
- [ ] Database in same EU region
- [ ] SSL certificate configured
- [ ] Firewall rules configured
- [ ] Database backups automated
- [ ] Backup encryption enabled

---

## ✅ Pre-Launch Verification

Run through this final checklist:

1. **Privacy Policy**
   - [ ] Accessible at `/privacy-policy`
   - [ ] Link in footer
   - [ ] Link on registration page
   - [ ] Includes all required GDPR information

2. **Terms of Service**
   - [ ] Accessible at `/terms-of-service`
   - [ ] Link in footer
   - [ ] Referenced in registration

3. **Registration Form**
   - [ ] Unchecked consent checkbox
   - [ ] Cannot submit without consent
   - [ ] Links to privacy policy
   - [ ] Consent timestamp saved

4. **User Rights**
   - [ ] Can export data: Working
   - [ ] Can delete account: Working
   - [ ] Can update information: Working
   - [ ] Receives confirmation emails: Working

5. **Security**
   - [ ] HTTPS enforced
   - [ ] Secure cookies enabled
   - [ ] CORS configured
   - [ ] Rate limiting active
   - [ ] Security headers present

6. **Data Location**
   - [ ] App hosted in EU
   - [ ] Database in EU
   - [ ] Backups in EU
   - [ ] No external data transfers

---

## 🚀 Quick Implementation Commands

```bash
# 1. Install security dependencies
cd packages/backend
npm install helmet express-rate-limit @types/express-rate-limit

# 2. Run database migration for consent fields
# Create migration file first, then:
npm run migration:run

# 3. Run tests
npm run test:backend
npm run test:e2e

# 4. Build for production
npm run build

# 5. Verify security headers (after deployment)
curl -I https://your-domain.eu/api
```

---

## 📞 Support Contacts

- **GDPR Questions:** [Your DPO or legal contact]
- **Technical Issues:** [Your dev team contact]
- **Hosting Provider:** [Provider support]
- **Supervisory Authority:** [Your country's DPA]

---

## 🔄 Regular Maintenance (After Launch)

### Weekly
- [ ] Check dependency vulnerabilities
- [ ] Review failed login attempts
- [ ] Monitor error logs

### Monthly
- [ ] Review access logs
- [ ] Check backup integrity
- [ ] Update dependencies

### Quarterly
- [ ] Review Privacy Policy
- [ ] Audit user data
- [ ] Security scan

### Annually
- [ ] Full GDPR compliance audit
- [ ] Review all documentation
- [ ] Update processing records

---

**Last Updated:** December 21, 2025

**Note:** Check off items as you complete them. Keep this checklist in version control to track compliance progress.

