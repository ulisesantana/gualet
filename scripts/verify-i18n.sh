#!/bin/bash

# Script to verify the translation system

echo "🌍 Translation System - Gualet"
echo "===================================="
echo ""

# 1. Verify dependencies are installed
echo "📦 Checking dependencies..."
cd packages/frontend
if grep -q "i18next" package.json && grep -q "react-i18next" package.json; then
    echo "✅ i18next dependencies installed"
else
    echo "❌ Missing i18next dependencies"
    exit 1
fi
echo ""

# 2. Verify configuration files
echo "📁 Checking configuration files..."
if [ -f "src/features/common/infrastructure/i18n/config.ts" ]; then
    echo "✅ i18n configuration found"
else
    echo "❌ Missing i18n configuration"
    exit 1
fi
echo ""

# 3. Verify translation files
echo "🗣️ Checking translations..."
if [ -f "src/features/common/infrastructure/i18n/locales/en.ts" ]; then
    echo "✅ English translations found"
else
    echo "❌ Missing English translations"
    exit 1
fi

if [ -f "src/features/common/infrastructure/i18n/locales/es.ts" ]; then
    echo "✅ Spanish translations found"
else
    echo "❌ Missing Spanish translations"
    exit 1
fi
echo ""

# 4. Verify backend migration
echo "🗄️ Checking database migration..."
cd ../backend
if ls src/migrations/*AddLanguageToUserPreferences.ts 1> /dev/null 2>&1; then
    echo "✅ Migration found"
else
    echo "❌ Missing migration"
    exit 1
fi
echo ""

# 5. Verify TypeScript
echo "🔍 Checking TypeScript..."
cd ../..
npm run typecheck > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ TypeScript OK"
else
    echo "❌ TypeScript errors"
    npm run typecheck
    exit 1
fi
echo ""

echo "🎉 Everything ready!"
echo ""
echo "Next steps:"
echo "1. Run migration: cd packages/backend && npm run migration:run"
echo "2. Start app: npm run dev"
echo "3. Go to /settings and change language"
echo ""
echo "📚 Documentation:"
echo "- packages/frontend/TRANSLATION_GUIDE.md"
echo "- docs/project/I18N_IMPLEMENTATION.md"

