# Privacy Policy Template for Gualet

**⚠️ This is a TEMPLATE. You MUST customize it with your actual information before publishing.**

---

# Privacy Policy

**Last updated:** [DATE]

## 1. Introduction

Welcome to Gualet ("we", "our", "us"). We respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information when you use our personal finance management application.

**Data Controller:**
- Name: [Your name or company name]
- Address: [Your address]
- Email: privacy@gualet.app
- Location: [Country]

**Data Protection Officer (if applicable):**
- Name: [DPO name or "Not applicable"]
- Email: [DPO email or "N/A"]

## 2. Information We Collect

### 2.1 Personal Information You Provide

When you register and use Gualet, we collect:

| Data Type | Purpose | Legal Basis |
|-----------|---------|-------------|
| Email address | Account identification and contact | Performance of contract (Art. 6(1)(b) GDPR) |
| Password | Account security (stored as encrypted hash) | Performance of contract (Art. 6(1)(b) GDPR) |
| Financial transactions | Core app functionality - track expenses | Performance of contract (Art. 6(1)(b) GDPR) |
| Transaction categories | Organize your financial data | Performance of contract (Art. 6(1)(b) GDPR) |
| Payment method names | Track transaction sources | Performance of contract (Art. 6(1)(b) GDPR) |
| User preferences | Customize your experience | Legitimate interest (Art. 6(1)(f) GDPR) |

### 2.2 Information We Do NOT Collect

We want to be clear about what we DON'T collect:
- ❌ No actual credit/debit card numbers
- ❌ No banking credentials
- ❌ No CVV/security codes
- ❌ No biometric data
- ❌ No location tracking
- ❌ No behavioral analytics or tracking cookies
- ❌ No third-party advertising data

### 2.3 Automatically Collected Information

For security purposes, we collect:
- IP addresses (for authentication and security)
- Access logs (who accessed what, when)
- Device information (browser type, for compatibility)

**Retention:** Security logs are kept for 90 days, then automatically deleted.

## 3. How We Use Your Information

We use your personal data exclusively to:

1. **Provide the service** - Enable you to track and manage your finances
2. **Maintain your account** - Authentication and account management
3. **Improve security** - Detect and prevent fraud and unauthorized access
4. **Communicate with you** - Service updates, security alerts (essential communications only)

**We DO NOT:**
- ❌ Sell your data to third parties
- ❌ Use your data for advertising
- ❌ Share your data with data brokers
- ❌ Analyze your spending for commercial purposes
- ❌ Send marketing emails (unless you explicitly opt-in)

## 4. Legal Basis for Processing

Under GDPR, we process your data based on:

- **Contract (Art. 6(1)(b))**: Processing necessary to provide you with the service
- **Legitimate Interest (Art. 6(1)(f))**: Security monitoring, fraud prevention, and service improvement
- **Consent (Art. 6(1)(a))**: Where applicable, such as marketing communications (opt-in only)

## 5. Data Storage and Security

### 5.1 Where We Store Your Data

- **Location:** All data is stored on servers within the European Union
- **Database:** PostgreSQL database hosted in [EU country/region]
- **Backups:** Encrypted backups stored in the same EU region

### 5.2 Security Measures

We implement industry-standard security measures:

- ✅ Password encryption using bcrypt (one-way hashing)
- ✅ HTTPS/TLS encryption for all data in transit
- ✅ Database encryption at rest
- ✅ Secure, HttpOnly cookies for session management
- ✅ Rate limiting to prevent brute force attacks
- ✅ Regular security updates and patches
- ✅ Access controls and user data isolation
- ✅ Automated security monitoring

**No security system is 100% perfect.** While we implement strong safeguards, we cannot guarantee absolute security. We will notify you within 72 hours if a data breach affects your personal data.

## 6. Your Rights Under GDPR

You have the following rights regarding your personal data:

### 6.1 Right to Access (Art. 15)
**What:** Get a copy of all your personal data  
**How:** Settings → Export Data  
**Response Time:** Immediately (automated)  
**Cost:** Free

### 6.2 Right to Rectification (Art. 16)
**What:** Correct inaccurate data  
**How:** Edit directly in the app  
**Response Time:** Immediate

### 6.3 Right to Erasure / "Right to be Forgotten" (Art. 17)
**What:** Delete all your data  
**How:** Settings → Delete Account  
**Response Time:** Immediate  
**Scope:** Complete deletion of all data (irreversible)

### 6.4 Right to Data Portability (Art. 20)
**What:** Receive your data in machine-readable format  
**How:** Settings → Export Data (JSON format)  
**Response Time:** Immediate

### 6.5 Right to Object (Art. 21)
**What:** Stop certain types of processing  
**How:** Contact us at privacy@gualet.app  
**Note:** May limit service functionality

### 6.6 Right to Withdraw Consent
**What:** Withdraw consent for data processing  
**How:** Delete your account  
**Effect:** Service will no longer be available

### 6.7 Right to Lodge a Complaint
**What:** File a complaint with a supervisory authority  
**Authority:** [Your country's Data Protection Authority]  
**Contact:** [Authority website and contact info]

Examples:
- **Spain:** Agencia Española de Protección de Datos (AEPD) - www.aepd.es
- **Germany:** BfDI - www.bfdi.bund.de
- **France:** CNIL - www.cnil.fr
- **EU General:** https://edpb.europa.eu/about-edpb/about-edpb/members_en

## 7. Data Retention

| Data Type | Retention Period |
|-----------|------------------|
| Active account data | Until you delete your account |
| Deleted account data | Immediately deleted (no retention) |
| Security logs | 90 days |
| Backup data | 30 days (encrypted) |

**Inactive Accounts:**
- We may send a warning email after [12/24] months of inactivity
- Account may be deleted after [24] months of inactivity with 30 days notice
- You can prevent deletion by logging in

## 8. Data Sharing and Third Parties

### 8.1 Who We Share With

We do NOT share your data with third parties, except:

1. **Legal Obligations:** If required by law, court order, or government request
2. **Service Providers (Processors):** Only if necessary for hosting/infrastructure

### 8.2 Current Processors

| Service | Purpose | Location | Safeguards |
|---------|---------|----------|------------|
| [Hosting Provider Name] | Server hosting | EU | DPA signed, GDPR compliant |
| PostgreSQL (self-hosted) | Database | EU | Self-managed |

**All processors:**
- Are contractually obligated to protect your data
- Can only process data according to our instructions
- Are GDPR compliant
- Are located in the EU or provide adequate safeguards

## 9. International Data Transfers

**Current Status:** NO data transfers outside the European Economic Area (EEA)

**If we transfer data in the future:**
- We will use Standard Contractual Clauses (SCCs) approved by the EU Commission
- We will notify you via email
- We will update this policy
- You can object to such transfers

## 10. Cookies and Tracking

### 10.1 Essential Cookies

We use ONE cookie:
- **Name:** `access_token`
- **Purpose:** Authentication (keep you logged in)
- **Type:** HttpOnly, Secure
- **Duration:** Session
- **Required:** Yes (essential for service functionality)

**No consent banner needed** - This cookie is strictly necessary for the service.

### 10.2 Analytics and Tracking

We do NOT use:
- ❌ Google Analytics or similar tools
- ❌ Advertising cookies
- ❌ Social media tracking pixels
- ❌ Cross-site tracking

## 11. Children's Privacy

Gualet is NOT intended for children under 16 years old. We do not knowingly collect data from children. If you believe a child has created an account, please contact us immediately at privacy@gualet.app.

## 12. Changes to This Policy

We may update this privacy policy to reflect:
- Changes in our practices
- Legal requirements
- New features

**Notification:**
- Major changes: Email notification + in-app notice
- Minor changes: Updated "Last updated" date
- Previous versions: Available upon request

**Your Rights:**
- If you don't agree with changes, you can delete your account
- Continued use after notification means acceptance

## 13. Data Breach Notification

In case of a data breach:

**Our obligations:**
- Notify supervisory authority within 72 hours
- Notify you if there's high risk to your rights
- Provide clear information about the breach
- Explain our response measures

**Your actions:**
- Change your password immediately
- Monitor your accounts
- Contact us for questions

## 14. Contact Us

For any privacy-related questions or requests:

**Email:** privacy@gualet.app  
**Response Time:** Within 30 days (GDPR requirement)

**Data Subject Requests:**
- Access your data: Use in-app export feature or email us
- Delete your account: Use in-app deletion or email us
- Correct your data: Edit directly in app
- Questions: Email privacy@gualet.app

**Postal Address:**
[Your Name/Company]  
[Street Address]  
[City, Postal Code]  
[Country]

## 15. Supervisory Authority

You have the right to lodge a complaint with a data protection supervisory authority:

**[Your Country] Supervisory Authority:**
- Name: [Authority Name]
- Website: [URL]
- Email: [Contact Email]
- Phone: [Phone Number]

**EU-wide list:** https://edpb.europa.eu/about-edpb/about-edpb/members_en

---

## Summary (Plain Language)

**What we collect:** Email, password (encrypted), your financial transactions  
**Why:** To provide you with a personal finance tracking app  
**Who sees it:** Only you (and our servers for processing)  
**Where:** EU servers only  
**How long:** Until you delete your account  
**Your control:** Export or delete anytime  

**We never:**
- Sell your data
- Show you ads
- Track you across websites
- Share with third parties (except as required by law)

---

**This privacy policy is compliant with:**
- GDPR (EU Regulation 2016/679)
- ePrivacy Directive
- National data protection laws

**Last reviewed:** [DATE]  
**Next review:** [DATE]

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | [DATE] | Initial version |

---

**By using Gualet, you acknowledge that you have read and understood this Privacy Policy.**

For questions or concerns, contact: privacy@gualet.app

