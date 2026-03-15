#!/bin/bash

# GDPR Security Verification Script
# Run this after deployment to verify security measures are in place

set -e

echo "🔐 GDPR Security Verification for Gualet"
echo "========================================"
echo ""

# Configuration
API_URL="${1:-https://api.gualet.app}"
FRONTEND_URL="${2:-https://gualet.app}"

if [[ "$API_URL" == "https://api.gualet.app" ]]; then
    echo "⚠️  Warning: Using default URLs. Provide your actual URLs:"
    echo "Usage: $0 <API_URL> <FRONTEND_URL>"
    echo "Example: $0 https://api.example.eu https://example.eu"
    echo ""
fi

echo "Checking: $API_URL"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PASSED=0
FAILED=0
WARNINGS=0

function pass() {
    echo -e "${GREEN}✓${NC} $1"
    ((PASSED++))
}

function fail() {
    echo -e "${RED}✗${NC} $1"
    ((FAILED++))
}

function warn() {
    echo -e "${YELLOW}⚠${NC} $1"
    ((WARNINGS++))
}

echo "1. HTTPS Enforcement"
echo "-------------------"

# Check if HTTPS is enforced
HTTP_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -L "${API_URL/https/http}/api" 2>/dev/null || echo "000")

if [[ "$HTTP_RESPONSE" == "301" ]] || [[ "$HTTP_RESPONSE" == "308" ]]; then
    pass "HTTP redirects to HTTPS"
elif [[ "$API_URL" == https* ]]; then
    warn "HTTPS used but HTTP redirect not verified"
else
    fail "HTTPS not enforced - API accessible via HTTP"
fi

echo ""
echo "2. Security Headers"
echo "------------------"

# Get security headers
HEADERS=$(curl -s -I "$API_URL/api" 2>/dev/null || echo "")

# Check Strict-Transport-Security (HSTS)
if echo "$HEADERS" | grep -qi "strict-transport-security"; then
    HSTS_VALUE=$(echo "$HEADERS" | grep -i "strict-transport-security" | cut -d' ' -f2-)
    pass "HSTS header present: $HSTS_VALUE"
else
    fail "HSTS header missing - Required for GDPR compliance"
fi

# Check X-Content-Type-Options
if echo "$HEADERS" | grep -qi "x-content-type-options"; then
    pass "X-Content-Type-Options header present"
else
    warn "X-Content-Type-Options header missing"
fi

# Check X-Frame-Options
if echo "$HEADERS" | grep -qi "x-frame-options"; then
    pass "X-Frame-Options header present"
else
    warn "X-Frame-Options header missing"
fi

# Check Content-Security-Policy
if echo "$HEADERS" | grep -qi "content-security-policy"; then
    pass "Content-Security-Policy header present"
else
    warn "Content-Security-Policy header missing"
fi

# Check X-XSS-Protection
if echo "$HEADERS" | grep -qi "x-xss-protection"; then
    pass "X-XSS-Protection header present"
else
    warn "X-XSS-Protection header recommended"
fi

echo ""
echo "3. Cookie Security"
echo "-----------------"

# Check cookie settings (requires actual login, so we'll just verify endpoint exists)
LOGIN_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/api/auth/login" -X POST 2>/dev/null || echo "000")

if [[ "$LOGIN_STATUS" == "400" ]] || [[ "$LOGIN_STATUS" == "401" ]]; then
    pass "Login endpoint accessible (returns $LOGIN_STATUS)"
else
    warn "Cannot verify cookie settings (login endpoint returned $LOGIN_STATUS)"
fi

echo ""
echo "4. CORS Configuration"
echo "--------------------"

# Check CORS headers
CORS_ORIGIN=$(curl -s -I -H "Origin: https://malicious.com" "$API_URL/api/auth/verify" 2>/dev/null | grep -i "access-control-allow-origin" | cut -d' ' -f2- || echo "")

if [[ -z "$CORS_ORIGIN" ]] || [[ "$CORS_ORIGIN" == *"$FRONTEND_URL"* ]]; then
    pass "CORS properly configured (not allowing all origins)"
else
    fail "CORS misconfigured: $CORS_ORIGIN"
fi

echo ""
echo "5. API Endpoints Verification"
echo "-----------------------------"

# Check if required GDPR endpoints exist
endpoints=(
    "/api/auth/register:POST"
    "/api/auth/login:POST"
    "/api/auth/logout:POST"
    "/api/auth/verify:GET"
)

for endpoint_method in "${endpoints[@]}"; do
    IFS=':' read -r endpoint method <<< "$endpoint_method"
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X "$method" "$API_URL$endpoint" 2>/dev/null || echo "000")

    if [[ "$STATUS" != "000" ]] && [[ "$STATUS" != "404" ]]; then
        pass "Endpoint $method $endpoint exists (status: $STATUS)"
    else
        fail "Endpoint $method $endpoint not found"
    fi
done

echo ""
echo "6. Required GDPR Endpoints"
echo "-------------------------"

# These might not exist yet - just informational
gdpr_endpoints=(
    "/api/me/data-export:GET"
    "/api/me/account:DELETE"
)

echo "The following endpoints are REQUIRED for GDPR compliance:"
for endpoint_method in "${gdpr_endpoints[@]}"; do
    IFS=':' read -r endpoint method <<< "$endpoint_method"
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X "$method" "$API_URL$endpoint" 2>/dev/null || echo "000")

    if [[ "$STATUS" != "000" ]] && [[ "$STATUS" != "404" ]]; then
        pass "GDPR endpoint $method $endpoint implemented"
    else
        fail "GDPR endpoint $method $endpoint NOT FOUND - Required!"
    fi
done

echo ""
echo "7. Database Security"
echo "-------------------"

# Can't check from outside, so just provide checklist
echo "Manual verification required:"
echo "  [ ] Database uses SSL/TLS connections"
echo "  [ ] Database has encryption at rest enabled"
echo "  [ ] Database is located in EU region"
echo "  [ ] Database backups are encrypted"
echo "  [ ] Database access is restricted (not publicly accessible)"

echo ""
echo "8. Documentation"
echo "---------------"

# Check if privacy policy is accessible
PRIVACY_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL/privacy-policy" 2>/dev/null || echo "000")
TERMS_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL/terms-of-service" 2>/dev/null || echo "000")

if [[ "$PRIVACY_STATUS" == "200" ]]; then
    pass "Privacy Policy accessible at /privacy-policy"
else
    fail "Privacy Policy not found (status: $PRIVACY_STATUS) - REQUIRED for GDPR"
fi

if [[ "$TERMS_STATUS" == "200" ]]; then
    pass "Terms of Service accessible at /terms-of-service"
else
    fail "Terms of Service not found (status: $TERMS_STATUS) - REQUIRED for GDPR"
fi

echo ""
echo "=========================================="
echo "📊 Results Summary"
echo "=========================================="
echo -e "${GREEN}Passed:${NC} $PASSED"
echo -e "${YELLOW}Warnings:${NC} $WARNINGS"
echo -e "${RED}Failed:${NC} $FAILED"
echo ""

if [[ $FAILED -eq 0 ]] && [[ $WARNINGS -eq 0 ]]; then
    echo -e "${GREEN}✓ All checks passed! Your deployment appears GDPR compliant.${NC}"
    exit 0
elif [[ $FAILED -eq 0 ]]; then
    echo -e "${YELLOW}⚠ Some warnings detected. Review and improve security measures.${NC}"
    exit 0
else
    echo -e "${RED}✗ Critical issues found! Fix these before deploying to production.${NC}"
    echo ""
    echo "Review GDPR_COMPLIANCE.md and GDPR_CHECKLIST.md for implementation guidance."
    exit 1
fi

