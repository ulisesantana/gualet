<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## 🏗️ Architecture

The backend follows clean architecture principles:

- **Controllers:** Handle HTTP requests, validation, and response formatting
- **Services:** Business logic and orchestration
- **Repositories:** Data access using TypeORM
- **Entities:** Database models
- **DTOs:** Data validation with class-validator

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - Login (sets HttpOnly cookie)
- `POST /api/auth/logout` - Logout
- `POST /api/auth/verify` - Verify session

### Categories
- `GET /api/me/categories` - List categories
- `GET /api/me/categories/:id` - Get category
- `POST /api/me/categories` - Create category
- `PATCH /api/me/categories/:id` - Update category
- `DELETE /api/me/categories/:id` - Delete category

### Payment Methods
- `GET /api/me/payment-methods` - List payment methods
- `GET /api/me/payment-methods/:id` - Get payment method
- `POST /api/me/payment-methods` - Create payment method
- `PATCH /api/me/payment-methods/:id` - Update payment method
- `DELETE /api/me/payment-methods/:id` - Delete payment method

### Transactions
- `GET /api/me/transactions` - List transactions (with filters)
- `GET /api/me/transactions/:id` - Get transaction
- `POST /api/me/transactions` - Create transaction
- `PATCH /api/me/transactions/:id` - Update transaction
- `DELETE /api/me/transactions/:id` - Delete transaction

### User Preferences
- `GET /api/me/preferences` - Get preferences
- `PUT /api/me/preferences` - Update preferences

### Health
- `GET /api/health` - Health check

## 🔒 Security

- JWT-based authentication with HttpOnly cookies
- Password hashing with bcrypt
- CORS configured for frontend origin
- Input validation with class-validator
- SQL injection prevention via TypeORM parameterized queries

## 📖 Documentation

- **Swagger UI:** http://localhost:5050/api/docs
- **Project Documentation:** [../../docs/](../../docs/)
- **Database Seeding:** [DATABASE_SEEDING.md](./DATABASE_SEEDING.md)

## 🛠️ Development

### Type Checking
```bash
npm run typecheck
```

### Database Migrations
```bash
# Generate new migration
npm run migration:generate

# Run migrations
npm run migration:run

# Revert last migration
npm run migration:revert
```

### Database Management
```bash
# Seed test data
npm run db:seed

# Clean database
npm run db:clean
```

## 📄 License

ISC
