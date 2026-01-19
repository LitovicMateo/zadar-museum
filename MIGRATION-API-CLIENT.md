# API Client Migration Guide

## Overview

All query hooks need to be updated to use the centralized `apiClient` from `@/lib/api-client` instead of importing axios directly.

## Migration Pattern

### Before:

```typescript
import axios from "axios";

const fetchData = async () => {
  const res = await axios.get(API_ROUTES.something);
  return res.data;
};
```

### After:

```typescript
import apiClient from "@/lib/api-client";

const fetchData = async () => {
  const res = await apiClient.get(API_ROUTES.something);
  return res.data;
};
```

## Files Updated (Examples)

- ✅ frontend/src/providers/auth-provider.tsx
- ✅ frontend/src/hooks/queries/player/usePlayerDetails.ts
- ✅ frontend/src/hooks/queries/team/useTeamDetails.ts
- ✅ frontend/src/hooks/queries/coach/useCoachDetails.ts

## Remaining Files (100+ files)

Run this find-and-replace across all files in `frontend/src/hooks/queries/**/*.ts`:

**Find:** `import axios from 'axios';`
**Replace:** `import apiClient from '@/lib/api-client';`

**Then find:** `axios.get(`
**Replace:** `apiClient.get(`

**Then find:** `axios.post(`
**Replace:** `apiClient.post(`

**Then find:** `axios.put(`
**Replace:** `apiClient.put(`

**Then find:** `axios.delete(`
**Replace:** `apiClient.delete(`

## Benefits After Migration

1. ✅ JWT automatically attached to all requests
2. ✅ Automatic token expiry handling (401 redirect)
3. ✅ Centralized error handling
4. ✅ Consistent timeout configuration
5. ✅ No need to manually add auth headers
