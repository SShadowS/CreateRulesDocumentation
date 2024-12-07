**Rule ID: SE-000001**
**Purpose**: Identifies Per-Tenant Extensions (PTEs) that don't allow source code download capabilities.

**What it checks**:
- Installed Per-Tenant Extensions
- Source code download permissions for each PTE
- Package ID and App ID information
- Extension names and their download capabilities

**Why it matters**: Without access to the source code, organizations may face significant challenges if they need to modify the extension in the future, especially if the original third-party developer becomes unavailable. This could lead to business continuity risks.

**Recommendation**: Contact the third-party developer who created the extension to either:
- Obtain a copy of the source code
- Request enabling of the download code option for the PTE

**Severity**: Warning
**Area**: Technical