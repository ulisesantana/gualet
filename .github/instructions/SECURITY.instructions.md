---
applyTo: '**'
description: 'Security best practices and guidelines'
---

# Security Instructions

## General Security Principles

1. **Never commit secrets** - Use environment variables
2. **Validate all inputs** - Never trust user input
3. **Use parameterized queries** - Prevent SQL injection
4. **Hash passwords** - Never store plain text passwords
5. **Use HTTPS** - Always encrypt data in transit
6. **Implement rate limiting** - Prevent abuse
7. **Keep dependencies updated** - Patch known vulnerabilities
8. **Follow principle of least privilege** - Minimal permissions

## Authentication & Authorization

### JWT Authentication

- Use secure secret key (min 256 bits)
- Set reasonable expiration time
- Store tokens securely (httpOnly cookies preferred)
- Validate tokens on every request

```typescript
// ✅ Good: Secure JWT configuration
jwt.sign(payload, process.env.JWT_SECRET, {
  expiresIn: '1h',
  algorithm: 'HS256',
});

// ❌ Bad: Weak configuration
jwt.sign(payload, 'secret123', { expiresIn: '999y' });
```

### Password Security

- Use bcrypt or argon2 for hashing
- Minimum password length: 8 characters
- Validate password strength
- Never log or display passwords

```typescript
// ✅ Good: Hash password with bcrypt
import * as bcrypt from 'bcrypt';

const saltRounds = 10;
const hashedPassword = await bcrypt.hash(password, saltRounds);

// Verify password
const isValid = await bcrypt.compare(inputPassword, hashedPassword);
```

### Session Management

- Use secure, httpOnly cookies
- Set proper cookie attributes
- Implement logout functionality
- Clear session on logout

```typescript
// ✅ Good: Secure cookie settings
res.cookie('token', jwt, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production', // HTTPS only in prod
  sameSite: 'strict',
  maxAge: 3600000, // 1 hour
});
```

## Input Validation

### Backend Validation (NestJS)

Always validate user input using class-validator:

```typescript
// ✅ Good: Proper validation
export class CreateTransactionDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(-1000000)
  @Max(1000000)
  amount: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  description: string;

  @IsNotEmpty()
  @IsUUID()
  categoryId: string;
}

// ❌ Bad: No validation
export class CreateTransactionDto {
  amount: any; // Accepts anything!
  description: string;
  categoryId: string;
}
```

### SQL Injection Prevention

Always use parameterized queries with TypeORM:

```typescript
// ✅ Good: Parameterized query
await this.repository.findOne({
  where: { id: userId, categoryId: categoryId }
});

// OR with QueryBuilder
await this.repository
  .createQueryBuilder('transaction')
  .where('transaction.userId = :userId', { userId })
  .andWhere('transaction.categoryId = :categoryId', { categoryId })
  .getMany();

// ❌ Bad: String concatenation (SQL INJECTION!)
await this.repository.query(
  `SELECT * FROM transactions WHERE userId = '${userId}'`
);
```

### XSS Prevention

- Escape user input before displaying
- Use React's built-in XSS protection
- Sanitize HTML if accepting rich text

```typescript
// ✅ Good: React automatically escapes
<div>{user.description}</div>

// ⚠️ Dangerous: Only use if you trust the HTML
<div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />

// ❌ Bad: Never do this with user input
<div dangerouslySetInnerHTML={{ __html: userInput }} />
```

## Environment Variables

### Backend (.env)

```bash
# ✅ Good: Secure configuration
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://user:pass@localhost:5432/db
JWT_SECRET=your-super-secure-secret-min-32-chars
COOKIE_SECRET=another-super-secure-secret

# ❌ Bad: Hardcoded or weak
JWT_SECRET=secret123
DATABASE_URL=postgresql://root:root@localhost/db
```

### Frontend (.env)

```bash
# ✅ Good: Public variables only (prefixed with VITE_)
VITE_API_URL=https://api.example.com
VITE_APP_NAME=Gualet

# ❌ Bad: Secrets in frontend (NEVER!)
VITE_API_KEY=super-secret-key
VITE_DATABASE_PASSWORD=password123
```

**Important:** 
- Frontend environment variables are PUBLIC (visible in browser)
- Never put secrets in frontend .env
- Backend secrets stay on the server

## CORS Configuration

```typescript
// ✅ Good: Specific origins
app.enableCors({
  origin: ['https://yourapp.com', 'https://www.yourapp.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
});

// ⚠️ Development only
app.enableCors({
  origin: true, // Allow all origins (development only!)
  credentials: true,
});

// ❌ Bad: Too permissive in production
app.enableCors({
  origin: '*',
  credentials: true,
});
```

## Rate Limiting

Implement rate limiting to prevent abuse:

```typescript
// Backend rate limiting (NestJS)
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60, // Time window in seconds
      limit: 10, // Max requests per ttl
    }),
  ],
})
export class AppModule {}

// Apply to specific routes
@UseGuards(ThrottlerGuard)
@Controller('auth')
export class AuthController {}
```

## Data Privacy (GDPR)

### Personal Data Handling

- Collect only necessary data
- Store data securely
- Allow users to export their data
- Allow users to delete their data
- Document data processing (see `docs/compliance/`)

### Data Deletion

```typescript
// ✅ Good: Delete user and all related data
async deleteUser(userId: string): Promise<void> {
  await this.transactionRepository.delete({ userId });
  await this.categoryRepository.delete({ userId });
  await this.paymentMethodRepository.delete({ userId });
  await this.userRepository.delete(userId);
}

// Implement soft delete for compliance
@DeleteDateColumn()
deletedAt?: Date;
```

## Error Handling

### Don't Leak Sensitive Information

```typescript
// ✅ Good: Generic error message to user
try {
  await this.service.processPayment(data);
} catch (error) {
  console.error('Payment error:', error); // Log detailed error
  throw new InternalServerErrorException('Payment processing failed'); // Generic to user
}

// ❌ Bad: Exposing internal details
catch (error) {
  throw new InternalServerErrorException(error.message); // Might leak DB structure, file paths, etc.
}
```

## Dependencies

### Keep Dependencies Updated

```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Update dependencies
npm update

# Check for outdated packages
npm outdated
```

### Review New Dependencies

Before adding a dependency:
- [ ] Check npm downloads (popular = more eyes on security)
- [ ] Check last update date (actively maintained?)
- [ ] Check known vulnerabilities (`npm audit`)
- [ ] Review license (compatible with your project?)
- [ ] Check if it's really needed (avoid dependency bloat)

## File Upload (Future)

If implementing file uploads:

```typescript
// ✅ Good: Validate file type and size
import { diskStorage } from 'multer';
import * as path from 'path';

const storage = diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

@Post('upload')
@UseInterceptors(
  FileInterceptor('file', {
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png|pdf)$/)) {
        return cb(new Error('Only images and PDFs allowed'), false);
      }
      cb(null, true);
    },
  }),
)
async uploadFile(@UploadedFile() file: Express.Multer.File) {
  // Process file
}

// ❌ Bad: No validation
@Post('upload')
async uploadFile(@UploadedFile() file: any) {
  // Accepts any file, any size!
}
```

## API Security Headers

```typescript
// Add security headers (NestJS + Helmet)
import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
}));
```

## Database Security

### Connection Security

```typescript
// ✅ Good: Secure connection
const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: true,
  } : false,
});

// ❌ Bad: Hardcoded credentials
const dataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  username: 'root',
  password: 'password123',
  database: 'mydb',
});
```

### Principle of Least Privilege

- Database user should only have necessary permissions
- Don't use root/admin user for application
- Create specific user with limited permissions

```sql
-- ✅ Good: Limited permissions
CREATE USER gualet_app WITH PASSWORD 'secure_password';
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO gualet_app;

-- ❌ Bad: Too much access
GRANT ALL PRIVILEGES ON DATABASE gualet TO gualet_app;
```

## Frontend Security

### API Keys

```typescript
// ✅ Good: API calls go through your backend
// Your backend proxies requests to third-party APIs
const response = await fetch('/api/external-service');

// ❌ Bad: API key exposed in frontend
const response = await fetch('https://api.example.com', {
  headers: { 'X-API-Key': 'your-secret-key' } // Visible to anyone!
});
```

### Local Storage

```typescript
// ✅ Good: Store non-sensitive data only
localStorage.setItem('theme', 'dark');
localStorage.setItem('language', 'en');

// ❌ Bad: Storing sensitive data
localStorage.setItem('jwt', token); // Vulnerable to XSS
localStorage.setItem('password', password); // Never!
```

**Use httpOnly cookies for authentication tokens instead.**

## Security Checklist

### Before Deploying

- [ ] All secrets in environment variables
- [ ] .env files in .gitignore
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS prevention (escape user input)
- [ ] CORS properly configured
- [ ] Rate limiting implemented
- [ ] HTTPS enabled (production)
- [ ] Secure cookie settings
- [ ] Error messages don't leak information
- [ ] Dependencies updated (`npm audit`)
- [ ] Password hashing implemented
- [ ] JWT with secure secret and expiration
- [ ] Database connection encrypted (SSL)
- [ ] Security headers configured (Helmet)
- [ ] File upload validation (if applicable)
- [ ] GDPR compliance documented

### Regular Maintenance

- [ ] Update dependencies monthly
- [ ] Run `npm audit` weekly
- [ ] Review security advisories
- [ ] Rotate secrets periodically
- [ ] Review access logs for suspicious activity
- [ ] Test authentication/authorization flows

## Reporting Security Issues

If you find a security vulnerability:

1. **Do NOT** create a public issue
2. Email the maintainer privately
3. Provide detailed description and reproduction steps
4. Allow time for a fix before public disclosure

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
- [NestJS Security Best Practices](https://docs.nestjs.com/security/authentication)
- [React Security Best Practices](https://react.dev/learn/security)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)

