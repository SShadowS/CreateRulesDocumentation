**Rule ID: SE-000006**
**Purpose**: Identifies number series configurations in Business Central that don't allow gaps in their numbering sequence.

**What it checks**:
1. Purchase Setup Number Series:
   - Order Numbers
   - Invoice Numbers
   - Credit Memo Numbers
   - Quote Numbers
   - Vendor Numbers
   - Blanket Order Numbers
   - Price List Numbers
   - Return Order Numbers

2. Sales Setup Number Series:
   - Order Numbers
   - Invoice Numbers
   - Credit Memo Numbers
   - Quote Numbers
   - Customer Numbers
   - Blanket Order Numbers
   - Reminder Numbers
   - Finance Charge Memo Numbers
   - Direct Debit Mandate Numbers
   - Price List Numbers

**Why it matters**: Number series configured to not allow gaps can cause significant performance issues and database locking problems during document creation and processing in Business Central.

**Recommendation**: Change the identified number series configurations to allow gaps, which will improve system performance and reduce locking issues.

**Severity**: Warning
**Area**: Performance