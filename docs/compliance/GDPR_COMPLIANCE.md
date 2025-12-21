# GDPR Compliance Guide for Gualet

## 📋 Overview

This document outlines the requirements and implementation guidelines for GDPR (General Data Protection Regulation) compliance when deploying Gualet on European servers.

**Last Updated:** December 21, 2025

---

## 🎯 Executive Summary

As a personal finance management application, Gualet processes **highly sensitive personal data** including:
- Financial transactions
- Payment methods
- Spending patterns
- Personal identification (email, user ID)

This data is subject to strict GDPR requirements when deployed in the EU.

---

## 📊 Data Classification

### Personal Data Collected

| Data Type | Category | GDPR Article | Retention Need |
|-----------|----------|--------------|----------------|
| Email address | Identity | Art. 6(1)(b) | Account management |
| Password (hashed) | Authentication | Art. 6(1)(b) | Account security |
| User ID | Identity | Art. 6(1)(b) | System identifier |
| Transaction records | Financial | Art. 9(1)* | Core functionality |
| Categories | Financial patterns | Art. 9(1)* | Core functionality |
| Payment methods | Financial | Art. 9(1)* | Core functionality |
| User preferences | Behavioral | Art. 6(1)(f) | User experience |
| Timestamps (created/updated) | Metadata | Art. 6(1)(f) | Audit trail |

> *Note: Financial data can be considered "special category" under certain interpretations requiring explicit consent.

---

## ✅ Required Implementation Checklist

### 1. Legal Basis & Consent (Art. 6 & 9)

- [ ] **Add Terms of Service & Privacy Policy**
  - Must explain what data is collected
  - Purpose of processing
  - Legal basis (likely "contract" for service provision)
  - Data retention periods
  - User rights under GDPR

- [ ] **Implement Consent Mechanism**
  - [ ] Checkbox during registration (not pre-checked)
  - [ ] Link to privacy policy
  - [ ] Store consent timestamp in database
  - [ ] Allow consent withdrawal

**Implementation needed:**
```typescript
// Add to user.entity.ts
@Column({ nullable: true })
consentDate: TimeString;

@Column({ default: false })
marketingConsent: boolean;
```

### 2. Data Subject Rights (Art. 15-22)

#### Right to Access (Art. 15)
- [ ] **Implement data export endpoint**
  - User can download all their data in JSON/CSV format
  - Include all transactions, categories, payment methods, preferences

**Endpoint needed:**
```
GET /api/me/data-export
```

#### Right to Rectification (Art. 16)
- ✅ Already implemented via PATCH endpoints
- ✅ Users can update categories, payment methods, transactions

#### Right to Erasure (Art. 17 - "Right to be forgotten")
- [ ] **Implement account deletion**
  - Complete data deletion from database
  - Cascade delete all related data
  - Log deletion for audit (anonymized)
  - Email confirmation of deletion

**Endpoint needed:**
```
DELETE /api/me/account
```

#### Right to Data Portability (Art. 20)
- [ ] **Same as data export but in structured format**
  - Machine-readable format (JSON)
  - Include data schema documentation

#### Right to Object (Art. 21)
- [ ] **Allow users to stop processing**
  - Pause account functionality
  - Stop automated analysis/reporting features

### 3. Security Measures (Art. 32)

#### Current Implementation ✅
- ✅ Password hashing with bcrypt
- ✅ JWT authentication
- ✅ HttpOnly cookies
- ✅ Secure cookies in production
- ✅ Database isolation per user (CASCADE DELETE)

#### Additional Requirements
- [ ] **Encryption at rest**
  - Enable PostgreSQL transparent data encryption
  - Encrypt database backups

- [ ] **Encryption in transit**
  - [ ] Force HTTPS in production
  - [ ] Add HSTS headers
  - [ ] Update cookie settings to `secure: true, sameSite: 'strict'` in production

- [ ] **Access logging**
  - [ ] Log all authentication attempts
  - [ ] Log data access (who, when, what)
  - [ ] Log data modifications
  - [ ] Store logs for 90 days minimum

- [ ] **Rate limiting**
  - [ ] Prevent brute force attacks
  - [ ] Protect against DDoS

- [ ] **CORS configuration**
  - [ ] Restrict to specific frontend domain
  - [ ] No wildcard origins in production

**Implementation needed:**
```typescript
// main.ts
app.enableCors({
  origin: config.get('FRONTEND_URL'),
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
});

// Add rate limiting
import * as rateLimit from 'express-rate-limit';
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  })
);
```

### 4. Data Minimization (Art. 5(1)(c))

- ✅ Currently compliant: only essential data collected
- [ ] **Review**: Do you need `createdAt`/`updatedAt` on all entities?
  - Keep for audit purposes (legitimate interest)

### 5. Data Retention & Deletion (Art. 5(1)(e))

- [ ] **Define retention policies**
  - Active accounts: retain all data
  - Deleted accounts: immediate deletion
  - Inactive accounts: define policy (e.g., delete after 2 years)

- [ ] **Implement automated deletion**
  - Scheduled job to delete inactive accounts
  - User notification before deletion (30 days warning)

**Cron job needed:**
```typescript
// packages/backend/src/users/user-cleanup.service.ts
@Cron('0 0 * * 0') // Weekly
async cleanupInactiveAccounts() {
  // Find accounts inactive > 2 years
  // Send warning email
  // Delete after 30 days if no response
}
```

### 6. Data Breach Notification (Art. 33-34)

- [ ] **Implement breach detection**
  - Monitor failed login attempts
  - Alert on unusual data access patterns
  - Log all administrative actions

- [ ] **Breach response plan**
  - Notify supervisory authority within 72 hours
  - Notify affected users if high risk
  - Document all breaches

### 7. Privacy by Design (Art. 25)

- ✅ Per-user data isolation
- ✅ No sharing between users
- [ ] **Pseudonymization consideration**
  - Consider using pseudonyms instead of email for internal processing
  - Separate identity from transaction data

### 8. Data Processing Records (Art. 30)

- [ ] **Maintain processing records**
  - What data is processed
  - Why (purpose)
  - Who has access
  - Retention periods
  - Security measures

### 9. Third-Party Processors (Art. 28)

**Current third parties:**
- PostgreSQL (self-hosted) ✅
- No external services currently

**If you add services (analytics, email, hosting):**
- [ ] Ensure Data Processing Agreements (DPA)
- [ ] Verify they are GDPR compliant
- [ ] Check data transfer mechanisms (EU-US)

### 10. Cross-Border Data Transfers (Art. 44-50)

- [ ] **If using cloud hosting:**
  - Use EU-based data centers
  - If using AWS/GCP/Azure: select EU regions
  - Verify Standard Contractual Clauses (SCCs)

- [ ] **If using CDN:**
  - Ensure data stays in EU
  - Or verify adequate safeguards

---

## 🔧 Priority Implementation Plan

### Phase 1: Critical (Before Production)
1. **Add Privacy Policy & Terms of Service**
2. **Implement CORS & HTTPS enforcement**
3. **Add account deletion endpoint**
4. **Implement data export**
5. **Add consent mechanism to registration**
6. **Enable secure cookies in production**
7. **Add rate limiting**

### Phase 2: Important (Within 30 days)
1. **Implement access logging**
2. **Add breach detection monitoring**
3. **Create retention policy**
4. **Document processing activities**
5. **Add security headers (HSTS, CSP, etc.)**

### Phase 3: Ongoing Compliance
1. **Regular security audits**
2. **Update privacy policy as needed**
3. **Monitor GDPR regulatory changes**
4. **Annual compliance review**

---

## 📝 Required Documentation

### 1. Privacy Policy (Required before launch)

Must include:
- Identity and contact details of data controller
- Data Protection Officer (if applicable - required for large-scale processing)
- Purposes of processing
- Legal basis for processing
- Categories of personal data
- Recipients of data
- Retention periods
- User rights (access, rectification, erasure, etc.)
- Right to lodge complaint with supervisory authority
- Whether data is transferred outside EU

**Create:** `/packages/frontend/src/pages/PrivacyPolicy.tsx`

### 2. Terms of Service

**Create:** `/packages/frontend/src/pages/TermsOfService.tsx`

### 3. Cookie Policy (if using tracking cookies)

Currently using only essential authentication cookies - likely exempt from cookie consent banners, but should document.

### 4. Data Processing Record

**Create:** `DATA_PROCESSING_RECORD.md`

---

## 🛡️ Technical Implementation Examples

### Account Deletion with Data Export

```typescript
// packages/backend/src/users/user.controller.ts
@Delete('account')
@UseGuards(JwtAuthGuard)
async deleteAccount(@Req() req: AuthenticatedRequest, @Res() res: Response) {
  const userId = req.user.userId;
  
  // Optional: Send data export before deletion
  const userData = await this.userService.exportUserData(userId);
  
  // Send confirmation email with exported data
  await this.emailService.sendAccountDeletionConfirmation(
    req.user.email,
    userData
  );
  
  // Delete all user data (cascade handles relations)
  await this.userService.delete(userId);
  
  // Clear session
  res.clearCookie('access_token');
  
  return res.status(200).json({
    message: 'Account successfully deleted',
  });
}
```

### Data Export Endpoint

```typescript
// packages/backend/src/users/user.controller.ts
@Get('data-export')
@UseGuards(JwtAuthGuard)
async exportData(@Req() req: AuthenticatedRequest) {
  return this.userService.exportUserData(req.user.userId);
}

// packages/backend/src/users/user.service.ts
async exportUserData(userId: string) {
  const user = await this.findById(userId);
  const transactions = await this.transactionService.findAllByUser(userId);
  const categories = await this.categoryService.findAllByUser(userId);
  const paymentMethods = await this.paymentMethodService.findAllByUser(userId);
  const preferences = await this.preferencesService.findByUser(userId);
  
  return {
    exportDate: new Date().toISOString(),
    user: {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
    },
    transactions: transactions.map(t => t.toJSON()),
    categories: categories.map(c => c.toJSON()),
    paymentMethods: paymentMethods.map(pm => pm.toJSON()),
    preferences: preferences?.toJSON(),
    metadata: {
      totalTransactions: transactions.length,
      dataProcessingPurpose: 'Personal finance management',
      retentionPeriod: 'Active account - indefinite',
    },
  };
}
```

### Security Headers

```typescript
// packages/backend/src/main.ts
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Security headers
  app.use(helmet({
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
  }));
  
  // ... rest of setup
}
```

### Consent Tracking

```typescript
// packages/backend/src/auth/dto/requests/register.dto.ts
export class RegisterDto {
  @Required('test@gualet.app')
  email: string;

  @Required('1234')
  password: string;

  @ApiProperty({
    description: 'User consent to privacy policy',
    example: true,
  })
  @IsBoolean()
  privacyPolicyConsent: boolean; // Must be true to register
}

// packages/backend/src/db/entities/user.entity.ts
@Column({ type: 'timestamp', nullable: true })
privacyPolicyConsentDate: TimeString;

@Column({ default: false })
marketingConsent: boolean;
```

---

## 🌍 Hosting Recommendations for EU Compliance

### Recommended Providers (EU-based)
1. **Hetzner** (Germany) - Excellent price/performance, GDPR compliant
2. **OVH** (France) - Large EU provider
3. **Scaleway** (France) - Good developer experience
4. **DigitalOcean** (Frankfurt/Amsterdam regions) - Use EU regions only

### Database Hosting
- Use same provider as application (data locality)
- Enable automated encrypted backups
- Keep backups in same EU region

### Configuration for Production

```yaml
# docker-compose.prod.yaml
services:
  db:
    image: postgres:15
    restart: always
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
      # Enable SSL
      POSTGRES_SSL_MODE: require
    volumes:
      - postgres_data:/var/lib/postgresql/data
    # Restrict access
    networks:
      - backend
    # No external port exposure
    
  backend:
    build: .
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://...
      JWT_SECRET: ${JWT_SECRET}
      FRONTEND_URL: https://your-domain.eu
    networks:
      - backend
      - frontend
    depends_on:
      - db

networks:
  backend:
    internal: true  # No external access
  frontend:
```

---

## 📧 User Communication Templates

### Registration Email (with GDPR info)

```
Subject: Welcome to Gualet - Privacy Information

Hi [User],

Welcome to Gualet! 

As required by GDPR, we want to inform you about how we handle your data:

• We only collect data necessary for the service (email, financial transactions)
• Your data is stored securely on EU servers
• You can export or delete your data anytime
• We never share your data with third parties

Your Rights:
- Access your data: Settings → Export Data
- Delete your account: Settings → Delete Account
- Update information: Edit anytime in the app

Read our full Privacy Policy: [link]

Questions? Contact us at privacy@gualet.app

Best regards,
The Gualet Team
```

---

## ⚠️ Common Pitfalls to Avoid

1. **❌ Not having a Privacy Policy before launch**
   - Fine: up to €20 million or 4% of global revenue

2. **❌ Pre-checked consent boxes**
   - Consent must be explicit and freely given

3. **❌ Not implementing data deletion**
   - Users have the right to erasure

4. **❌ No data breach response plan**
   - 72-hour notification requirement

5. **❌ Storing data outside EU without safeguards**
   - Ensure proper legal mechanisms

6. **❌ No encryption in transit/at rest**
   - Required security measure

7. **❌ Keeping data longer than necessary**
   - Define and enforce retention policies

---

## 📚 Additional Resources

- [GDPR Official Text](https://gdpr-info.eu/)
- [ICO GDPR Checklist](https://ico.org.uk/for-organisations/gdpr-resources/)
- [EDPB Guidelines](https://edpb.europa.eu/our-work-tools/general-guidance/gdpr-guidelines-recommendations-best-practices_en)
- [NOYB (Privacy Advocacy)](https://noyb.eu/)

---

## 🔄 Compliance Maintenance

### Monthly
- Review access logs for anomalies
- Check for security updates (dependencies)
- Verify backup integrity

### Quarterly
- Review and update Privacy Policy if needed
- Audit user data retention
- Security vulnerability scan

### Annually
- Full GDPR compliance audit
- Review data processing agreements
- Update documentation
- Employee training (if applicable)

---

## 📞 Next Steps

1. **Review this document** with your team
2. **Prioritize Phase 1** implementations
3. **Consult a lawyer** specialized in GDPR (recommended)
4. **Appoint a Data Protection Officer** (if required)
5. **Document all implementation decisions**

---

**Important:** This document provides guidance but is not legal advice. Consider consulting with a GDPR specialist attorney before production deployment in the EU.

