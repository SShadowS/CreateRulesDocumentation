**Rule ID: SE-000004**
**Purpose**: Detects the presence of demo data extensions in Business Central environments, particularly focusing on production environments.

**What it checks**:
- Contoso Coffee Demo Dataset extension
- Contoso Coffee Demo Dataset US extension
- Sustainability Contoso Coffee Demo Dataset extension

**Why it matters**: Demo data extensions are designed for testing and demonstration purposes. Their presence in production environments can potentially interfere with or corrupt actual business data, creating risks for data integrity.

**Recommendation**: Uninstall any identified demo data extensions if they are no longer needed for demo data generation purposes. This is particularly important in production environments.

**Severity**: Warning (Production) / Info (Non-Production)
**Area**: Technical