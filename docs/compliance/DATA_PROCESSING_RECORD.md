# Data Processing Record (Art. 30 GDPR)

**Organization:** Gualet
**Last Updated:** December 21, 2025
**Contact:** [Your contact information]

---

## 1. Controller Information

| Field | Value |
|-------|-------|
| Name | Gualet |
| Type | Data Controller |
| Purpose | Personal finance management application |
| Legal Representative | [Your name/company] |
| Contact Address | [Your address] |
| Contact Email | privacy@gualet.app |
| DPO (if applicable) | [Name or N/A] |

---

## 2. Processing Activities

### 2.1 User Authentication & Account Management

**Purpose:** Allow users to create and manage their account

**Legal Basis:** Art. 6(1)(b) - Performance of contract

**Categories of Data Subjects:**
- Application users
- Registered members

**Categories of Personal Data:**
- Email address
- Password (hashed with bcrypt)
- User ID (UUID)
- Account creation timestamp
- Account update timestamp
- Privacy policy consent timestamp

**Recipients:**
- Internal: Backend authentication service
- External: None

**Retention Period:**
- Active accounts: Until user requests deletion
- Deleted accounts: Immediate deletion
- Logs: 90 days

**Security Measures:**
- Password hashing with bcrypt (10 rounds)
- JWT authentication
- HttpOnly cookies
- Secure cookies in production
- Rate limiting on authentication endpoints
- Account lockout after failed attempts

---

### 2.2 Financial Transaction Management

**Purpose:** Track and manage personal financial transactions

**Legal Basis:** Art. 6(1)(b) - Performance of contract

**Categories of Data Subjects:**
- Application users

**Categories of Personal Data:**
- Transaction amount
- Transaction description
- Transaction date
- Operation type (income/expense)
- Category association
- Payment method association
- Creation/update timestamps

**Recipients:**
- Internal: Transaction service, reporting module
- External: None

**Retention Period:**
- Active accounts: Until user deletes transaction or account
- Deleted accounts: Immediate deletion via CASCADE

**Security Measures:**
- User isolation (each user can only access their data)
- Database-level access control
- Encrypted connections (SSL/TLS)
- Input validation and sanitization
- CASCADE DELETE on user deletion

---

### 2.3 Category Management

**Purpose:** Organize transactions into custom categories

**Legal Basis:** Art. 6(1)(b) - Performance of contract

**Categories of Data Subjects:**
- Application users

**Categories of Personal Data:**
- Category name
- Category type (income/expense)
- User ID
- Creation/update timestamps

**Recipients:**
- Internal: Category service, transaction service
- External: None

**Retention Period:**
- Active accounts: Until user deletes category or account
- Deleted accounts: Immediate deletion via CASCADE

**Security Measures:**
- User isolation
- Input validation
- Database constraints

---

### 2.4 Payment Method Management

**Purpose:** Manage payment methods for transaction tracking

**Legal Basis:** Art. 6(1)(b) - Performance of contract

**Categories of Data Subjects:**
- Application users

**Categories of Personal Data:**
- Payment method name
- User ID
- Creation/update timestamps

**Note:** NO sensitive payment information (card numbers, CVV, etc.) is stored

**Recipients:**
- Internal: Payment method service, transaction service
- External: None

**Retention Period:**
- Active accounts: Until user deletes payment method or account
- Deleted accounts: Immediate deletion via CASCADE

**Security Measures:**
- User isolation
- Input validation
- No sensitive payment data storage

---

### 2.5 User Preferences

**Purpose:** Store user interface and application preferences

**Legal Basis:** Art. 6(1)(f) - Legitimate interest (improve user experience)

**Categories of Data Subjects:**
- Application users

**Categories of Personal Data:**
- UI preferences (theme, language, etc.)
- Display settings
- User ID
- Creation/update timestamps

**Recipients:**
- Internal: Preferences service
- External: None

**Retention Period:**
- Active accounts: Until user changes or deletes account
- Deleted accounts: Immediate deletion via CASCADE

**Security Measures:**
- User isolation
- Input validation

---

### 2.6 Access Logging & Security Monitoring

**Purpose:** Security monitoring and breach detection

**Legal Basis:** Art. 6(1)(f) - Legitimate interest (security)

**Categories of Data Subjects:**
- Application users
- Visitors

**Categories of Personal Data:**
- IP address
- Timestamp
- Request path
- HTTP method
- Response status
- User agent
- Authentication status

**Recipients:**
- Internal: Security team, system administrators
- External: None

**Retention Period:**
- Access logs: 90 days
- Security incident logs: 2 years

**Security Measures:**
- Encrypted storage
- Access restricted to administrators
- Automated anomaly detection

---

## 3. Cross-Border Data Transfers

**Current Status:** No cross-border transfers outside EU

**If transfers occur:**
- Mechanism: Standard Contractual Clauses (SCCs)
- Recipient guarantees: [To be documented]
- Safeguards: [To be documented]

---

## 4. Technical and Organizational Measures

### Access Control
- Role-based access control (RBAC)
- Per-user data isolation
- JWT-based authentication
- Session management with HttpOnly cookies

### Encryption
- In transit: TLS 1.2+ (HTTPS)
- At rest: Database encryption (PostgreSQL)
- Passwords: bcrypt hashing

### Data Minimization
- Only essential data collected
- No unnecessary metadata
- No third-party analytics

### Availability & Resilience
- Automated database backups
- Disaster recovery plan: [To be documented]
- Uptime monitoring

### Testing & Evaluation
- E2E tests with Playwright
- Unit tests for backend services
- Security updates monitoring
- Dependency vulnerability scanning

---

## 5. Data Breach Response Plan

### Detection
- Monitoring of failed login attempts
- Unusual data access patterns
- Database integrity checks
- Automated security alerts

### Assessment (within 24 hours)
1. Identify scope of breach
2. Determine data categories affected
3. Assess risk to data subjects
4. Document timeline

### Notification (within 72 hours if required)
1. **Supervisory Authority:**
   - [Your country's data protection authority]
   - Contact: [Authority contact]
   - Method: [Online form/email]

2. **Data Subjects (if high risk):**
   - Email notification
   - Clear description of breach
   - Likely consequences
   - Measures taken
   - Contact point

### Remediation
1. Contain breach
2. Secure systems
3. Prevent recurrence
4. Update security measures

### Documentation
- Breach registry maintained
- All breaches logged (even if not notified)
- Lessons learned

---

## 6. Data Subject Rights - Response Procedures

### Right of Access (Art. 15)
- **Endpoint:** GET /api/me/data-export
- **Response time:** Within 30 days
- **Format:** JSON (machine-readable)
- **Free of charge:** Yes (first request)

### Right to Rectification (Art. 16)
- **Implementation:** PATCH endpoints for all resources
- **Response time:** Immediate (online update)

### Right to Erasure (Art. 17)
- **Endpoint:** DELETE /api/me/account
- **Response time:** Immediate
- **Confirmation:** Email sent to user
- **Scope:** All related data via CASCADE DELETE

### Right to Data Portability (Art. 20)
- **Same as data export**
- **Format:** Structured JSON
- **Includes:** All user-generated data

### Right to Object (Art. 21)
- **Account suspension:** [To be implemented]
- **Stop processing:** Account deletion

---

## 7. Data Protection Impact Assessment (DPIA)

**Assessment Date:** [To be completed]

**High Risk Processing?** Potentially YES
- Large-scale processing of financial data
- Systematic monitoring of users
- Automated decision-making: NO

**Necessity:** Core functionality requires financial data processing

**Risks Identified:**
1. Unauthorized access to financial data
2. Data breach exposing transaction history
3. Insider threat

**Mitigation Measures:**
- Strong authentication
- Encryption
- User isolation
- Access logging
- Regular security audits

**Residual Risk:** LOW (with measures implemented)

---

## 8. Processor Agreements

### Current Processors

| Processor | Service | Location | DPA | SCC |
|-----------|---------|----------|-----|-----|
| [Hosting Provider] | Application hosting | EU | ☐ | ☐ |
| [Database Provider] | Database hosting | EU | ☐ | ☐ |
| N/A | Self-hosted | EU | N/A | N/A |

*Note: Update when processors are selected*

### Required for each processor:
- ☐ Data Processing Agreement (DPA) signed
- ☐ Standard Contractual Clauses (if outside EU)
- ☐ Processor's security measures verified
- ☐ Sub-processors disclosed
- ☐ Annual compliance audit

---

## 9. Employee Training & Awareness

**Not applicable** - Solo developer / Small team

**If team grows:**
- [ ] GDPR basics training
- [ ] Data handling procedures
- [ ] Breach response training
- [ ] Annual refresher

---

## 10. Regular Review Schedule

| Activity | Frequency | Last Review | Next Review |
|----------|-----------|-------------|-------------|
| This document | Quarterly | [Date] | [Date] |
| Privacy Policy | Quarterly | [Date] | [Date] |
| Security measures | Monthly | [Date] | [Date] |
| Access logs | Monthly | [Date] | [Date] |
| Dependency updates | Weekly | [Date] | [Date] |
| Full compliance audit | Annually | [Date] | [Date] |

---

## 11. Supervisory Authority

**Relevant Authority:** [Based on your location]

Examples:
- Spain: Agencia Española de Protección de Datos (AEPD)
- Germany: Bundesbeauftragter für den Datenschutz und die Informationsfreiheit (BfDI)
- France: Commission Nationale de l'Informatique et des Libertés (CNIL)
- UK: Information Commissioner's Office (ICO)

**Contact:** [Authority website and contact information]

---

## 12. Record of Changes

| Date | Change | Updated By |
|------|--------|------------|
| 2025-12-21 | Initial version | [Your name] |
|            |                |            |

---

**Document Owner:** [Your name]  
**Approval:** [Your signature/date]  
**Next Review:** [Date in 3 months]

