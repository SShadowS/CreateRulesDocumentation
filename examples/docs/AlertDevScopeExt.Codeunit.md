**Rule ID: SE-000002**
**Purpose**: Identifies Business Central extensions that are published in Development (DEV) scope, which can cause issues during system upgrades.

**What it checks**:
- Installed NAV Applications/Extensions
- Publication scope of each extension
- Identifies extensions specifically published in DEV scope

**Why it matters**: Extensions published in DEV scope are automatically uninstalled when the environment is upgraded to a newer version, potentially disrupting business operations and requiring manual reinstallation.

**Recommendation**: Contact the third-party extension developers to have the extensions republished in PTE (Per-Tenant Extension) scope instead of DEV scope to ensure persistence during upgrades.

**Severity**: Warning
**Area**: Technical