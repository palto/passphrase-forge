# Technical Debt

This file tracks known technical debt and areas for future improvement.

## Generator Architecture Duplication

**Issue:** Two similar generator architectures exist with confusing names:

1. **`PasswordGenerator`** (app/passphrase/password-generator.ts)
   - Concrete class for basic word-based passphrase generation
   - Methods: `generate()`, `generateDetails()`, `generateMultiple()`
   - Uses `WordSource` for word selection

2. **`PassphraseGenerator`** (app/passphrase/generators/base.ts)
   - Interface for different generation strategies
   - Methods: `generate()`, `generateMultiple()`
   - `BasicPassphraseGenerator` is just a thin wrapper around `PasswordGenerator`

**Problem:**
- Naming confusion between `PasswordGenerator` and `PassphraseGenerator`
- `BasicPassphraseGenerator` adds unnecessary indirection
- Two similar interfaces doing essentially the same thing

**Impact:**
- Low - functionality works correctly
- Medium - code maintainability and clarity

**Potential Solutions:**
1. Make `PasswordGenerator` implement `PassphraseGenerator` interface directly (eliminate wrapper)
2. Rename `PasswordGenerator` to something like `WordCombiner` or `BaseWordGenerator` (clearer separation of concerns)
3. Merge into single generator hierarchy (replace `PasswordGenerator` entirely)

**Next Steps:**
- Decide on preferred approach
- Refactor to eliminate duplication
- Update tests and documentation
