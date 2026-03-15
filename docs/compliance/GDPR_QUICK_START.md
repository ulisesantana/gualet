# GDPR Quick Start Guide

> 🚀 **Start here if you need to deploy to EU quickly**

## 📍 Where to Start

1. **Read this** (5 min)
2. **Read [GDPR_CHECKLIST.md](./GDPR_CHECKLIST.md)** (15 min) 
3. **Implement critical items** (1 week)
4. **Read full [GDPR_COMPLIANCE.md](./GDPR_COMPLIANCE.md)** (when you have time)

---

## ⚡ 5-Minute Summary

### What is GDPR?

**GDPR** = General Data Protection Regulation (EU law since 2018)

**For you it means:**
- Users have rights over their data
- You must protect their data
- You must be transparent about data usage
- Non-compliance = fines up to €20M or 4% revenue

### What Data Does Gualet Handle?

Your app processes **highly sensitive financial data**:

- ✅ Email, password (authentication)
- ✅ Financial transactions (amounts, dates, descriptions)
- ✅ Categories and payment methods
- ✅ User preferences

**Good news:** You DON'T store actual card numbers, banking credentials, or biometrics.

### What Must You Do?

**Before launching in EU:**

1. ✅ Have a Privacy Policy (use our template)
2. ✅ Have Terms of Service
3. ✅ Get user consent (checkbox on registration)
4. ✅ Allow users to export their data
5. ✅ Allow users to delete their account
6. ✅ Use HTTPS everywhere
7. ✅ Host data in EU
8. ✅ Implement security measures

---

## 🎯 The Absolute Minimum (Emergency Mode)

**If you need to launch ASAP and are short on time:**

### 1. Install Security Packages (5 min)

```bash
cd packages/backend
npm install helmet express-rate-limit
```

### 2. Add Security to main.ts (10 min)

```typescript
import helmet from 'helmet';
import * as rateLimit from 'express-rate-limit';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Security headers
  app.use(helmet());
  
  // Rate limiting
  app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
  }));
  
  // CORS - CHANGE THIS TO YOUR DOMAIN
  app.enableCors({
    origin: 'https://your-domain.eu',
    credentials: true,
  });
  
  // Rest of your code...
}
```

### 3. Create Privacy Policy Page (30 min)

- Copy `PRIVACY_POLICY_TEMPLATE.md`
- Fill in your information (replace all `[...]` placeholders)
- Create React component: `packages/frontend/src/pages/PrivacyPolicy.tsx`
- Add route and link in footer

### 4. Add Data Export Endpoint (20 min)

```typescript
// packages/backend/src/users/user.controller.ts
@Get('me/data-export')
@UseGuards(JwtAuthGuard)
async exportData(@Req() req: AuthenticatedRequest) {
  const userId = req.user.userId;
  
  const user = await this.userService.findById(userId);
  const transactions = await this.transactionService.findAllByUser(userId);
  const categories = await this.categoryService.findAllByUser(userId);
  const paymentMethods = await this.paymentMethodService.findAllByUser(userId);
  
  return {
    exportDate: new Date().toISOString(),
    user: user.toJSON(),
    transactions: transactions.map(t => t.toJSON()),
    categories: categories.map(c => c.toJSON()),
    paymentMethods: paymentMethods.map(pm => pm.toJSON()),
  };
}
```

### 5. Add Account Deletion Endpoint (15 min)

```typescript
// packages/backend/src/users/user.controller.ts
@Delete('me/account')
@UseGuards(JwtAuthGuard)
async deleteAccount(@Req() req, @Res() res) {
  const userId = req.user.userId;
  
  // Delete user (cascade will handle related data)
  await this.userService.delete(userId);
  
  // Clear session
  res.clearCookie('access_token');
  
  return res.status(200).json({
    message: 'Account successfully deleted'
  });
}
```

### 6. Add Consent to Registration (15 min)

**Backend DTO:**
```typescript
// packages/backend/src/auth/dto/requests/register.dto.ts
export class RegisterDto {
  @Required('test@gualet.app')
  email: string;

  @Required('1234')
  password: string;

  @ApiProperty({ description: 'Privacy policy consent' })
  @IsBoolean()
  privacyPolicyConsent: boolean;
}
```

**Frontend form:**
```tsx
<Checkbox
  required
  label={
    <span>
      I agree to the{' '}
      <Link to="/privacy-policy">Privacy Policy</Link>
    </span>
  }
/>
```

### 7. Deploy to EU Hosting (varies)

**Recommended quick options:**
- **Hetzner** (Germany) - €4/month
- **DigitalOcean Frankfurt** - €6/month
- **Scaleway** (France) - €7/month

**Must have:**
- ✅ Server in EU region
- ✅ PostgreSQL in same region
- ✅ SSL certificate (free with Let's Encrypt)

### 8. Environment Variables

```bash
# .env.production
NODE_ENV=production
FRONTEND_URL=https://your-domain.eu
DATABASE_URL=postgresql://user:pass@eu-db-host/dbname
JWT_SECRET=your-super-long-random-secret-at-least-64-chars
```

---

## ✅ Minimum Viable GDPR Compliance

After the above 8 steps (~2 hours of work + hosting setup):

- ✅ Privacy Policy: Check
- ✅ User consent: Check
- ✅ Data export: Check
- ✅ Account deletion: Check
- ✅ Security headers: Check
- ✅ HTTPS: Check
- ✅ EU hosting: Check
- ✅ CORS protection: Check

**You can launch.** Then improve over time.

---

## 🔍 Verification

After deploying, run:

```bash
./scripts/verify-gdpr-compliance.sh https://api.your-domain.eu https://your-domain.eu
```

This will check:
- HTTPS enforcement
- Security headers
- CORS configuration
- Required endpoints
- Privacy policy accessibility

---

## 📚 Full Documentation

For complete details, see:

| Document | Purpose | Read When |
|----------|---------|-----------|
| **GDPR_CHECKLIST.md** | Step-by-step implementation | Now |
| **GDPR_COMPLIANCE.md** | Complete guide with examples | Before production |
| **DATA_PROCESSING_RECORD.md** | Legal compliance record | Fill out before launch |
| **PRIVACY_POLICY_TEMPLATE.md** | Privacy policy template | Customize before launch |

---

## ⚠️ Common Mistakes

**DON'T:**
- ❌ Use a pre-checked consent checkbox
- ❌ Host in US without proper safeguards
- ❌ Forget to implement account deletion
- ❌ Use `*` for CORS in production
- ❌ Skip HTTPS
- ❌ Leave default privacy policy text

**DO:**
- ✅ Require explicit consent (unchecked by default)
- ✅ Use EU hosting
- ✅ Implement all user rights (access, delete, export)
- ✅ Whitelist only your domain in CORS
- ✅ Enforce HTTPS everywhere
- ✅ Customize privacy policy with your info

---

## 🆘 Need Help?

1. **Legal questions:** Consult a GDPR lawyer
2. **Technical questions:** See code examples in GDPR_COMPLIANCE.md
3. **Hosting questions:** Provider's support documentation
4. **GDPR general:** https://gdpr-info.eu/

**Spanish resources:**
- AEPD (Spain): https://www.aepd.es/
- GDPR guide in Spanish: https://www.aepd.es/guias

---

## 📊 Estimated Effort

| Phase | Time | Can Launch? |
|-------|------|-------------|
| Minimum (this guide) | 2 hours + hosting | ✅ Yes, but basic |
| Recommended (checklist) | 1 week | ✅ Yes, compliant |
| Complete (full guide) | 2-3 weeks | ✅ Yes, professional |

---

## 🚀 Next Steps

1. **Right now:** Complete the 8 steps above
2. **This week:** Work through GDPR_CHECKLIST.md
3. **Before launch:** Review GDPR_COMPLIANCE.md
4. **After launch:** Monthly compliance checks

---

**Remember:** GDPR compliance is not a one-time thing. It's ongoing. But with these tools, you have everything you need to start and maintain compliance.

Good luck! 🍀

