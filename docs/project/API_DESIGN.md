# API Design Patterns - CRUD vs BREAD

This document explains the API design patterns used in Gualet's backend.

## 📋 Overview

Gualet uses two different patterns for entity management:

- **CRUD** (Create, Read, Update, Delete) - For simple entities with small datasets
- **BREAD** (Browse, Read, Edit, Add, Delete) - For complex entities requiring advanced querying

---

## 🏷️ Categories - CRUD Pattern

**Endpoint:** `GET /api/me/categories`

### Characteristics
- ✅ Simple listing - returns all user's categories
- ❌ No filtering
- ❌ No pagination
- ❌ No sorting options
- ✅ Typically <50 records per user

### Why CRUD?
Categories are **reference data** used primarily in dropdowns and selectors. Users rarely have more than 20-30 categories, so returning the complete list is efficient and simple.

### Example Response
```json
{
  "data": [
    {
      "id": "uuid-1",
      "name": "Groceries",
      "type": "outcome",
      "icon": "🛒",
      "color": "#FF5733"
    },
    // ... all categories
  ]
}
```

### Operations
- `POST /api/me/categories` - Create
- `GET /api/me/categories` - Read all
- `GET /api/me/categories/:id` - Read one
- `PATCH /api/me/categories/:id` - Update
- `DELETE /api/me/categories/:id` - Delete (with conflict detection)

---

## 💳 Payment Methods - CRUD Pattern

**Endpoint:** `GET /api/me/payment-methods`

### Characteristics
- ✅ Simple listing - returns all user's payment methods
- ❌ No filtering
- ❌ No pagination
- ❌ No sorting options
- ✅ Typically <20 records per user

### Why CRUD?
Payment methods are also **reference data**. Users typically have only a handful of payment methods (credit cards, cash, bank accounts), making full listing optimal.

### Example Response
```json
{
  "data": [
    {
      "id": "uuid-1",
      "name": "Visa Credit Card",
      "icon": "💳",
      "color": "#1E88E5"
    },
    // ... all payment methods
  ]
}
```

### Operations
- `POST /api/me/payment-methods` - Create
- `GET /api/me/payment-methods` - Read all
- `GET /api/me/payment-methods/:id` - Read one
- `PATCH /api/me/payment-methods/:id` - Update
- `DELETE /api/me/payment-methods/:id` - Delete (with conflict detection)

---

## 💰 Transactions - BREAD Pattern

**Endpoint:** `GET /api/me/transactions`

### Characteristics
- ✅ **Browse** with advanced filtering
- ✅ Pagination support
- ✅ Sorting by date (asc/desc)
- ✅ Multiple filter criteria
- ✅ Can handle thousands of records

### Why BREAD?
Transactions are **transactional data** that grow continuously. Users can have hundreds or thousands of transactions, requiring sophisticated querying capabilities for performance and usability.

### Query Parameters

```typescript
interface TransactionQueryParams {
  // Date range filters
  from?: string;           // ISO date "2024-01-01"
  to?: string;             // ISO date "2024-12-31"
  
  // Relationship filters
  categoryId?: string;     // Filter by category
  paymentMethodId?: string; // Filter by payment method
  
  // Type filter
  operation?: 'income' | 'outcome';
  
  // Pagination
  page?: number;           // Page number (default: 1)
  pageSize?: number;       // Items per page (default: 10, 0 = all)
  
  // Sorting
  sort?: 'asc' | 'desc';   // Sort by date (default: asc)
}
```

### Example Requests

**Get latest 10 transactions:**
```bash
GET /api/me/transactions?sort=desc&pageSize=10
```

**Get January 2024 expenses from a specific category:**
```bash
GET /api/me/transactions?from=2024-01-01&to=2024-01-31&categoryId=abc-123&operation=outcome
```

**Get all transactions (no pagination):**
```bash
GET /api/me/transactions?pageSize=0
```

### Example Response
```json
{
  "data": [
    {
      "id": "uuid-1",
      "amount": 45.50,
      "description": "Weekly groceries",
      "date": "2024-01-15",
      "operation": "outcome",
      "category": {
        "id": "cat-1",
        "name": "Groceries",
        "type": "outcome"
      },
      "paymentMethod": {
        "id": "pm-1",
        "name": "Credit Card"
      }
    },
    // ... more transactions
  ],
  "pagination": {
    "total": 150,      // Total matching records
    "page": 1,         // Current page
    "pageSize": 10     // Items per page
  }
}
```

### Operations
- `POST /api/me/transactions` - Add
- `GET /api/me/transactions` - Browse (with filters)
- `GET /api/me/transactions/:id` - Read one
- `PATCH /api/me/transactions/:id` - Edit
- `DELETE /api/me/transactions/:id` - Delete

---

## 📊 Comparison Table

| Feature | Categories | Payment Methods | Transactions |
|---------|-----------|----------------|--------------|
| **Pattern** | CRUD | CRUD | BREAD |
| **List Endpoint** | Simple | Simple | Advanced |
| **Filters** | ❌ None | ❌ None | ✅ Date, Category, PM, Type |
| **Pagination** | ❌ Not needed | ❌ Not needed | ✅ Required |
| **Sorting** | ❌ None | ❌ None | ✅ By date (asc/desc) |
| **Typical Records** | <50 | <20 | 100s-1000s |
| **Growth Rate** | Low | Very Low | High (daily) |
| **Use Case** | Reference/Selector | Reference/Selector | Analysis/Reports |
| **Performance** | Always fast | Always fast | Optimized with filters |

---

## 🎯 Design Decisions

### When to use CRUD
Use **CRUD** when:
- Entity has a small, relatively stable dataset (<100 records)
- No filtering or searching is needed
- Data is used primarily as reference (dropdowns, selectors)
- Complete list can be efficiently loaded at once

**Examples:** Categories, Payment Methods, User Preferences, Tags

### When to use BREAD
Use **BREAD** when:
- Entity can have hundreds or thousands of records
- Users need to search/filter by multiple criteria
- Data grows continuously over time
- Performance requires pagination
- Data is used for analysis and reporting

**Examples:** Transactions, Invoices, Orders, Logs, Messages

---

## 🔮 Future Considerations

### Potential CRUD → BREAD Migrations

If categories or payment methods grow beyond 100 records per user, consider:

1. **Categories:**
   - Add `type` filter (income/outcome)
   - Add name search
   - Still likely won't need pagination

2. **Payment Methods:**
   - Add name search
   - Add `archived` filter
   - Still likely won't need pagination

### Potential BREAD Enhancements for Transactions

Possible future improvements:
- ✅ Text search in descriptions
- ✅ Amount range filters (min/max)
- ✅ Bulk operations
- ✅ Export to CSV/Excel
- ✅ Advanced aggregations (sum by category, monthly totals)

---

## 📚 Related Documentation

- [Backend API Documentation](../../packages/backend/README.md)
- [Project Status](./STATUS.md)
- [Quick Reference](./QUICK_REFERENCE.md)

---

**Last Updated:** December 21, 2025  
**Version:** 1.0

