**Rule ID: SE-000005**
**Purpose**: This rule identifies and monitors users who have been granted SUPER permissions within Business Central.

**What it checks**:
- Active users in the system (excluding External Users, Applications, and AAD Groups)
- Access Control entries for the SUPER role assignment
- Company-specific and cross-company SUPER permissions
- User Security IDs and associated permissions

**Why it matters**: Users with SUPER permissions have unrestricted access to all system functionality and data, which represents a significant security risk. Excessive distribution of SUPER permissions can compromise system security and make it difficult to maintain proper access controls.

**Recommendation**: Review users with SUPER permissions and reduce their access rights to only what is necessary for their role. Consider implementing more granular permission sets instead of using SUPER permissions.

**Severity**: Info
**Area**: Permissions