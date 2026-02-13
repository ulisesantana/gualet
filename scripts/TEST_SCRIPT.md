# Test Script Documentation

## Overview

The `test-all.sh` script runs all tests across the Gualet monorepo in parallel and generates a comprehensive test report.

## Usage

### Run all tests (including E2E)
```bash
npm test
```

### Run only unit tests (skip E2E - faster)
```bash
npm run test:unit
```

### Direct script usage
```bash
# All tests
./scripts/test-all.sh

# Skip E2E tests
./scripts/test-all.sh --skip-e2e

# Show help
./scripts/test-all.sh --help
```

## Features

- ✅ **Parallel execution**: All test suites run simultaneously for maximum speed
- ✅ **Comprehensive reporting**: Shows results for each package and overall summary
- ✅ **Colored output**: Easy-to-read terminal output with status indicators
- ✅ **Pass rate calculation**: Automatic calculation of total pass percentage
- ✅ **Duration tracking**: Shows how long tests took to run
- ✅ **Error logs**: Preserves log files when tests fail for debugging
- ✅ **Skip E2E option**: Run only unit tests for faster feedback

## Output Example

```
╔════════════════════════════════════════════════════════════╗
║                  GUALET TEST SUITE                         ║
╚════════════════════════════════════════════════════════════╝

Starting test execution in parallel...

▶ Running Backend tests...
▶ Running Frontend tests...
▶ Running Shared tests...
⊘ Skipping E2E tests
✓ Backend tests completed
✓ Frontend tests completed
✓ Shared tests completed

╔════════════════════════════════════════════════════════════╗
║                    TEST RESULTS                            ║
╚════════════════════════════════════════════════════════════╝

📦 Backend (Jest)
   ✓ Status: PASSED
   Suites: 22/22
   Tests:  190/190

⚛️  Frontend (Vitest)
   ✓ Status: PASSED
   Files:  61/61
   Tests:  332/332

📚 Shared (Vitest)
   ✓ Status: PASSED
   Files:  6/6
   Tests:  31/31

🎭 E2E (Playwright)
   ⊘ Status: SKIPPED
   (Use script without --skip-e2e to run E2E tests)

╔════════════════════════════════════════════════════════════╗
║                       SUMMARY                              ║
╚════════════════════════════════════════════════════════════╝

Total Tests:    553/553 passed (100.0%)
Duration:       0m 20s

✓ ALL TESTS PASSED! 🎉
```

## Test Packages

| Package | Test Framework | Typical Duration |
|---------|---------------|------------------|
| **Backend** | Jest | ~7s |
| **Frontend** | Vitest | ~14s |
| **Shared** | Vitest | ~1s |
| **E2E** | Playwright | ~40-120s |

## Performance

- **Unit tests only** (`npm run test:unit`): ~20 seconds
- **All tests** (`npm test`): ~40-120 seconds (depends on E2E)

## Debugging Failed Tests

When tests fail, the script preserves log files in a temporary directory:

```
💡 Tip: Log files are saved in: /var/folders/.../tmp.XXX

  • Backend tests failed
    See detailed output: /var/folders/.../tmp.XXX/backend.log
```

You can inspect these logs to see the full test output and error messages.

## Exit Codes

- `0`: All tests passed
- `1`: One or more test suites failed

This makes the script CI/CD friendly - it will fail the build if any tests fail.

## Options

### `--skip-e2e`

Skip E2E tests to run only unit tests. This is useful for:
- Quick local development feedback
- Pre-commit checks
- CI pipelines that run E2E separately

### `--help` / `-h`

Show help message with usage information.

## Integration with CI/CD

The script is designed to work well in CI/CD pipelines:

```yaml
# Example GitHub Actions
- name: Run all tests
  run: npm test

# Or skip E2E in PR checks
- name: Run unit tests  
  run: npm run test:unit
```

## Notes

- Tests run in parallel using background processes (`&`)
- E2E tests require Docker to be running (for the database)
- Logs are automatically cleaned up on success
- Colors are ANSI escape codes (may not display in all terminals)

