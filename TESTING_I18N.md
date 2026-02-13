# 🌍 Translation System - Testing Instructions

## ✅ Implementation Complete

A complete internationalization (i18n) system has been successfully implemented for Gualet with support for **Spanish** and **English**.

## 🚀 Steps to Test

### 1. Run Database Migration

```bash
# Make sure the database is running
docker-compose up -d db

# Run migrations
cd packages/backend
npm run migration:run
```

### 2. Start the Application

```bash
# From the project root
npm run dev
```

This will start:
- Backend at `http://localhost:5050`
- Frontend at `http://localhost:3000`

### 3. Test the Translation System

1. **Access the application**: `http://localhost:3000`

2. **Log in** with your user credentials

3. **Go to Settings**: Navigate to `/settings`

4. **Change language**:
   - You'll see a selector with "Language" / "Idioma"
   - Select "Spanish" (Español)
   - The interface will immediately change to Spanish
   - All labels will be translated

5. **Verify persistence**:
   - Reload the page
   - The language should remain in Spanish
   - Log out and log back in
   - The language should still be Spanish

6. **Change back to English**:
   - Go back to `/settings`
   - Select "English" (Inglés)
   - The interface returns to English

## 📋 Translated Elements

When changing the language, you'll see translations for:

- **Settings**:
  - "Add a new category" → "Añadir nueva categoría"
  - "Manage categories" → "Gestionar categorías"
  - "Add a new payment method" → "Añadir nuevo método de pago"
  - "Manage payment methods" → "Gestionar métodos de pago"
  - "Reports" → "Reportes"
  - "Default payment method" → "Método de pago predeterminado"
  - "Language" → "Idioma"
  - "Logout" → "Cerrar sesión"

- **Auth**:
  - "Login" → "Iniciar sesión"
  - "Register" → "Registrarse"
  - "Email" → "Correo electrónico"
  - "Password" → "Contraseña"

- **Common**:
  - "Save" → "Guardar"
  - "Cancel" → "Cancelar"
  - "Delete" → "Eliminar"
  - "Edit" → "Editar"
  - "Loading..." → "Cargando..."

## 🔍 Verify in Database

You can verify that the language was saved correctly:

```bash
# Connect to the database
docker exec -it gualet-db-1 psql -U gualet -d gualet

# View user preferences
SELECT * FROM user_preferences;

# You should see the 'language' column with 'en' or 'es'
```

## 🧪 Run Tests

```bash
# Frontend tests
cd packages/frontend
npm run test

# Backend tests
cd packages/backend
npm run test

# Type checking
npm run typecheck
```

## 📚 Documentation

- **Usage guide**: `packages/frontend/TRANSLATION_GUIDE.md`
- **Technical details**: `packages/frontend/src/features/common/infrastructure/i18n/README.md`
- **Implementation summary**: `docs/project/I18N_IMPLEMENTATION.md`

## 🎯 For Developers

### Add translations to a new component

```typescript
// In your component
import { useTranslation } from '@common/infrastructure/i18n';

export function MyComponent() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('myFeature.title')}</h1>
      <button>{t('common.save')}</button>
    </div>
  );
}
```

### Add new translations

1. Edit `packages/frontend/src/features/common/infrastructure/i18n/locales/en.ts`
2. Edit `packages/frontend/src/features/common/infrastructure/i18n/locales/es.ts`
3. Use the new key in your component

### Available translation keys

```typescript
// Common
t('common.loading')
t('common.save')
t('common.cancel')
t('common.delete')
t('common.edit')
t('common.back')
t('common.search')

// Auth
t('auth.login')
t('auth.logout')
t('auth.register')
t('auth.email')
t('auth.password')

// Categories
t('categories.title')
t('categories.addCategory')
t('categories.manageCategories')

// Payment Methods
t('paymentMethods.title')
t('paymentMethods.addPaymentMethod')
t('paymentMethods.defaultPaymentMethod')

// Transactions
t('transactions.title')
t('transactions.addTransaction')
t('transactions.amount')
t('transactions.description')

// Reports
t('reports.title')
t('reports.totalIncome')
t('reports.totalOutcome')

// Settings
t('settings.title')
t('settings.language')
t('settings.english')
t('settings.spanish')
```

## ✨ Implemented Features

- ✅ Real-time language switching
- ✅ Database persistence
- ✅ localStorage caching
- ✅ Visual selector in Settings
- ✅ Spanish and English translations
- ✅ Strong TypeScript typing
- ✅ Unit tests
- ✅ Complete documentation

## 🎉 Enjoy the multi-language system!

If you encounter any issues or need to add more translations, check the documentation or review the example files.
