# Architecture Decision Records (ADR)

This directory contains the Architecture Decision Records (ADR) for the Gualet project.

## What is an ADR?

An Architecture Decision Record (ADR) is a document that captures an important architectural decision along with its context and consequences.

## Format

We use the [MADR](https://adr.github.io/madr/) format (Markdown Architecture Decision Records) with the following sections:

- **Status**: proposed | accepted | rejected | deprecated | superseded
- **Context**: What problem are we trying to solve?
- **Decision**: What decision did we make?
- **Consequences**: What are the consequences of this decision?
- **Alternatives Considered**: What other options did we consider?

## Naming Convention

ADRs are named following this pattern:

```
NNNN-descriptive-title.md
```

Where `NNNN` is a sequential 4-digit number with leading zeros (0001, 0002, etc.).

## Decision Index

| ADR | Title | Status | Date |
|-----|-------|--------|------|
| [0001](0001-use-nestjs-backend.md) | Use NestJS as Backend Framework | Accepted | 2025-12-21 |
| [0002](0002-use-postgresql-database.md) | Use PostgreSQL as Primary Database | Accepted | 2025-12-21 |
| [0003](0003-offline-first-sync-strategy.md) | Offline-First Synchronization Strategy | Proposed | 2025-12-21 |

## Decision Process

1. **Identify the need**: When facing an important architectural decision
2. **Create an ADR in "proposed" status**: Document the problem and options
3. **Discuss**: Review with the team (or yourself if it's a personal project)
4. **Decide**: Mark the ADR as "accepted" or "rejected"
5. **Implement**: Proceed with implementation
6. **Update if necessary**: If the decision changes, create a new ADR that "supersedes" the previous one

## Template

To create a new ADR, copy the following template:

```markdown
# [Number]. [Decision Title]

**Status**: proposed | accepted | rejected | deprecated | superseded by [ADR-XXXX]

**Date**: YYYY-MM-DD

**Deciders**: [List of people involved in the decision]

---

## Context

[Describe the problem that needs to be solved and the context in which the decision is made]

### Problem Statement

[What problem are we trying to solve?]

### Requirements

- Requirement 1
- Requirement 2

---

## Decision

[Describe the decision that was made]

### Chosen Solution

[Name of the chosen solution]

### Implementation Details

[Technical details of how it will be implemented]

---

## Alternatives Considered

### Option 1: [Name]

**Pros:**
- Pro 1
- Pro 2

**Cons:**
- Con 1
- Con 2

**Estimated Effort**: X weeks/days

### Option 2: [Name]

[Same format as Option 1]

---

## Consequences

### Positive

- Positive consequence 1
- Positive consequence 2

### Negative

- Negative consequence 1
- Negative consequence 2

### Neutral

- Neutral consequence 1

---

## Risks and Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Risk 1 | High/Medium/Low | High/Medium/Low | Mitigation strategy |

---

## Follow-up Actions

- [ ] Action 1
- [ ] Action 2

---

## References

- [Link to relevant documentation]
- [Link to discussions]
- [Link to examples]

---

**Last Updated**: YYYY-MM-DD
```

## References

- [ADR GitHub Organization](https://adr.github.io/)
- [MADR Template](https://adr.github.io/madr/)
- [When to Write an ADR](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions)

