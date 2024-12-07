**Rule ID: SE-000003**
**Purpose**: This rule identifies evaluation companies present in Business Central environments, with particular emphasis on detecting them in production environments.

**What it checks**:
- Companies marked with the "Evaluation Company" flag
- The environment type (production vs. non-production)
- System IDs and names of evaluation companies

**Why it matters**: Having evaluation companies in production environments is generally not recommended as they:
- Consume system resources unnecessarily
- May contain test data that shouldn't be in production
- Could potentially be accessed unintentionally in a production context

**Recommendation**: Delete evaluation companies that are no longer needed, particularly in production environments, to maintain a clean and efficient system.

**Severity**: Warning (in production environments)
             Info (in non-production environments)
**Area**: Technical