# Translation System - Quick Start Guide

## ✅ Translation System Implemented

A complete internationalization (i18n) system has been implemented for the frontend with support for **Spanish** and **English**.

## 🎯 Implemented Features

### Backend
- ✅ `language` field added to `UserPreferences` (model, entity, DTO)
- ✅ Database migration to add `language` column
- ✅ Updated API to save/retrieve language preferences
- ✅ Validation for supported languages (en, es)

### Frontend
- ✅ i18next configuration with React
- ✅ Spanish and English translations
- ✅ Language selector in `/settings`
- ✅ Language persistence in:
  - Database (user_preferences)
  - localStorage (for quick loading)
- ✅ Real-time language switching
- ✅ Custom `useInitializeI18n` hook

## 🚀 How to Use

### 1. In any component

```typescript
import { useTranslation } from '@common/infrastructure/i18n';

function MyComponent() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('common.loading')}</h1>
      <button>{t('common.save')}</button>
      <p>{t('transactions.noTransactions')}</p>
    </div>
  );
}
```

### 2. Change language programmatically

```typescript
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { i18n } = useTranslation();
  
  const switchToSpanish = () => {
    i18n.changeLanguage('es');
  };
  
  const switchToEnglish = () => {
    i18n.changeLanguage('en');
  };
  
  return (
    <div>
      <button onClick={switchToSpanish}>Español</button>
      <button onClick={switchToEnglish}>English</button>
    </div>
  );
}
```

### 3. User changes language from Settings

Users can go to `/settings` and select their preferred language from the dropdown. The change:
- Saves to the database
- Applies immediately throughout the application
- Persists in localStorage

## 📝 Available Translations

### Main categories:
- `common.*` - Common UI elements
- `auth.*` - Authentication (login, logout, register)
- `categories.*` - Category management
- `paymentMethods.*` - Payment methods
- `transactions.*` - Transactions
- `reports.*` - Reports
- `settings.*` - Settings

### Key examples:
```typescript
t('common.save')           // "Save" / "Guardar"
t('common.cancel')         // "Cancel" / "Cancelar"
t('auth.login')            // "Login" / "Iniciar sesión"
t('categories.title')      // "Categories" / "Categorías"
t('settings.language')     // "Language" / "Idioma"
```

## 🔧 Add New Translations

1. Edit `/src/features/common/infrastructure/i18n/locales/en.ts`
2. Edit `/src/features/common/infrastructure/i18n/locales/es.ts`
3. Use the new key: `t('your.new.key')`
4. Run tests to verify consistency: `npm test -- locales/translations.test.ts`

**Important:** The test suite will automatically verify that:
- Both English and Spanish have the same keys
- No empty strings exist
- Translation counts match between languages

## 🧪 Testing

### Unit Tests

The project includes **26 automated tests** for translation validation:

```bash
# Run all frontend tests
npm run test

# Run only translation tests
npm test -- locales/translations.test.ts
```

**What the tests verify:**
- ✅ Key consistency between English and Spanish (8 tests)
- ✅ Required translations present (12 tests)
- ✅ No empty strings, proper formatting (4 tests)
- ✅ Complete coverage (2 tests)

### Mocking in Component Tests

Translations can be mocked in component tests:

```typescript
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { changeLanguage: vi.fn() },
  }),
}));
```

### Verification Script

Run the automated verification script:

```bash
# From project root
bash scripts/verify-i18n.sh
```

This checks:
- Dependencies installed
- Configuration files present
- Translation files exist
- Database migration exists
- TypeScript compiles

## 📦 Modified/Created Files

### Backend
- `packages/backend/src/db/entities/user-preferences.entity.ts`
- `packages/backend/src/user-preferences/dto/user-preferences.dto.ts`
- `packages/backend/src/user-preferences/user-preferences.model.ts`
- `packages/backend/src/user-preferences/user-preferences.repository.ts`
- `packages/backend/src/user-preferences/user-preferences.service.ts`
- `packages/backend/src/user-preferences/user-preferences.controller.ts`
- `packages/backend/src/migrations/1735481000000-AddLanguageToUserPreferences.ts`

### Shared
- `packages/shared/src/domain/user-preferences.ts` (added `Language` type)

### Frontend
- `packages/frontend/src/features/common/infrastructure/i18n/` (new directory)
  - `config.ts` - i18next configuration
  - `locales/en.ts` - English translations
  - `locales/es.ts` - Spanish translations
  - `useInitializeI18n.ts` - Custom hook
  - `useInitializeI18n.test.ts` - Tests
  - `index.ts` - Exports
  - `README.md` - Documentation
- `packages/frontend/src/features/settings/ui/SettingsView/SettingsView.tsx`
- `packages/frontend/src/features/settings/infrastructure/user-preferences/user-preferences.repository.ts`
- `packages/frontend/src/features/common/ui/App/App.tsx`

## 🎉 Ready to Use!

The system is fully functional. Users can:
1. Go to `/settings`
2. Change language using the selector
3. See the entire interface updated instantly
4. Language is saved and persists between sessions

## 🔄 Next Steps (Optional)

- Add more languages (French, German, etc.)
- Translate dynamic error messages
- Translate user-generated content (categories, descriptions)
- Automatically detect browser language
- Add date/number formatting per locale
