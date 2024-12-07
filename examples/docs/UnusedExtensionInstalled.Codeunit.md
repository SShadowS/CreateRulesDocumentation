**Rule ID: SE-000007**
**Purpose**: Identifies installed Business Central extensions that appear to be unused in the environment.

**What it checks**:
1. Presence of specific extensions:
   - Shopify Connector
   - AMC Banking
   - Intercompany API
   - Cloud Migration
   - Cloud Migration API
   - Intelligent Cloud
   - Ceridian Payroll
2. Verifies if these extensions:
   - Are installed in the environment
   - Have no data in their associated tables
   - Across all non-evaluation companies

**Why it matters**: Having unused extensions installed in the system can unnecessarily consume resources and potentially impact overall system performance.

**Recommendation**: Review the identified unused extensions and uninstall them if they are not needed to improve system performance.

**Severity**: Warning
**Area**: Performance