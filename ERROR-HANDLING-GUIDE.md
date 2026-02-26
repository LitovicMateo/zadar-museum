# Error Handling Implementation Guide

**Date:** January 19, 2026  
**Status:** Partially Complete - Examples Implemented

---

## Overview

This guide documents the pattern for adding query-level error handling with toast notifications to all React Query hooks.

---

## ✅ Completed Examples

The following hooks have been updated with error handling:

### Detail Pages (High Priority)

- ✅ `usePlayerDetails` - Player detail pages
- ✅ `useTeamDetails` - Team detail pages
- ✅ `useCoachDetails` - Coach detail pages
- ✅ `useGameDetails` - Game detail pages
- ✅ `useVenueDetails` - Venue detail pages
- ✅ `useRefereeDetails` - Referee detail pages

### List Pages

- ✅ `usePlayers` - Players list
- ✅ `useTeams` - Teams list

### Statistics

- ✅ `usePlayerAllTimeStats` - Player all-time statistics

### Infrastructure

- ✅ Toast imports added to:
  - `useGames`
  - `useLeagueDetails`
  - `useCoaches`
  - `useReferees`
  - `useVenues`

---

## 📋 Implementation Pattern

### Step 1: Add Toast Import

```typescript
// Before
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";

// After
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import toast from "react-hot-toast";
```

### Step 2: Add onError Handler to useQuery

```typescript
// Before
export const useEntityDetails = (id: string) => {
  return useQuery({
    queryKey: ["entity", id],
    queryFn: fetchEntity.bind(null, id),
    enabled: !!id,
  });
};

// After
export const useEntityDetails = (id: string) => {
  return useQuery({
    queryKey: ["entity", id],
    queryFn: fetchEntity.bind(null, id),
    enabled: !!id,
    onError: () => {
      toast.error("Failed to load entity details");
    },
  });
};
```

---

## 🎯 Error Message Guidelines

### Message Format

- **Detail pages:** `'Failed to load {entity} details'`
- **List pages:** `'Failed to load {entities}'`
- **Statistics:** `'Failed to load {entity} statistics'`
- **Actions:** `'Failed to {action} {entity}'`

### Examples

```typescript
// Detail pages
toast.error("Failed to load player details");
toast.error("Failed to load team details");
toast.error("Failed to load game details");

// List pages
toast.error("Failed to load players");
toast.error("Failed to load teams");
toast.error("Failed to load games");

// Statistics
toast.error("Failed to load player statistics");
toast.error("Failed to load team statistics");
toast.error("Failed to load season stats");

// Specific sections
toast.error("Failed to load game boxscore");
toast.error("Failed to load team schedule");
toast.error("Failed to load league standings");
```

---

## 📁 Remaining Hooks to Update

### Game Hooks (`frontend/src/hooks/queries/game/`)

- ⚠️ `useGames.ts` - Already has toast import, needs onError
- ⚠️ `useGameBoxscore.ts` - Needs both
- ⚠️ `useGameScore.ts` - Needs both
- ⚠️ `useGameTeamStats.ts` - Needs both
- ⚠️ `useGameTeamCoaches.ts` - Needs both
- ⚠️ `useGameTeams.ts` - Needs both
- ⚠️ `useGameReferees.ts` - Needs both

### Player Hooks (`frontend/src/hooks/queries/player/`)

- ⚠️ `usePlayerBoxscore.ts`
- ⚠️ `usePlayerSeasons.ts`
- ⚠️ `usePlayerTeams.ts`
- ⚠️ `usePlayerCompetitions.ts`
- ⚠️ `usePlayerNumber.ts`
- ⚠️ `usePlayerSeasonAverage.ts`
- ⚠️ `usePlayerSeasonLeagueAverage.ts`
- ⚠️ `usePlayerCareerHigh.ts`
- ⚠️ `useAllTimeStats.ts`
- ⚠️ `useAllTimeLeagueStats.ts`

### Team Hooks (`frontend/src/hooks/queries/team/`)

- ⚠️ `useTeamSeasons.ts`
- ⚠️ `useTeamCompetitions.ts`
- ⚠️ `useTeamSeasonStats.ts`
- ⚠️ `useTeamSeasonLeagueStats.ts`
- ⚠️ `useTeamTotalStats.ts`
- ⚠️ `useTeamLeagueStats.ts`
- ⚠️ `useTeamSeasonCompetitions.ts`
- ⚠️ `useTeamLeaders.ts`

### Coach Hooks (`frontend/src/hooks/queries/coach/`)

- ⚠️ `useCoaches.ts` - Already has toast import, needs onError
- ⚠️ `useCoachGamelog.ts`
- ⚠️ `useCoachRecord.ts`
- ⚠️ `useCoachLeagueStats.ts`
- ⚠️ `useCoachSeasons.ts`
- ⚠️ `useCoachSeasonCompetitions.ts`
- ⚠️ `useCoachTeams.ts`
- ⚠️ `useSeasonTotalStats.ts`
- ⚠️ `useSeasonLeagueStats.ts`

### Referee Hooks (`frontend/src/hooks/queries/referee/`)

- ⚠️ `useReferees.ts` - Already has toast import, needs onError
- ⚠️ `useRefereeSeasons.ts`
- ⚠️ `useRefereeSeasonStats.ts`
- ⚠️ `useRefereeSeasonLeagueStats.ts`
- ⚠️ `useRefereeTeamRecord.ts`
- ⚠️ `useRefereeGamelog.ts`

### Venue Hooks (`frontend/src/hooks/queries/venue/`)

- ⚠️ `useVenues.ts` - Already has toast import, needs onError
- ⚠️ `useVenueSeasons.ts`
- ⚠️ `useVenueSeasonStats.ts`
- ⚠️ `useVenueSeasonLeagueStats.ts`
- ⚠️ `useVenueSeasonCompetitions.ts`
- ⚠️ `useVenueGamelog.ts`
- ⚠️ `useVenueTeamRecord.ts`

### League Hooks (`frontend/src/hooks/queries/league/`)

- ⚠️ `useLeagueDetails.ts` - Already has toast import, needs onError
- ⚠️ `useLeagueSeasons.ts`
- ⚠️ `useLeagueGames.ts`
- ⚠️ `useLeaguePlayerRankings.ts`
- ⚠️ `useLeagueTeamRecord.ts`
- ⚠️ `usePlayerLeagueStats.ts`
- ⚠️ `useTeamLeagueStats.ts`

### Stats Hooks (`frontend/src/hooks/queries/stats/`)

- ⚠️ `useCoachAllTimeStats.ts`
- ⚠️ `useTeamAllTimeStats.ts`
- ⚠️ `useRefereeAllTimeStats.ts`
- ⚠️ `usePlayerRecords.ts`
- ⚠️ `useTeamRecords.ts`

### Dashboard Hooks (`frontend/src/hooks/queries/dasboard/`)

- ⚠️ `useCompetitions.ts`
- ⚠️ `useSeasons.ts`
- ⚠️ `useSeasonCompetitions.ts`
- ⚠️ `useCompetitionGames.ts`

### Other Hooks

- ⚠️ `useSeasonSchedule.ts`
- ⚠️ `player-stats/usePlayerStats.ts`
- ⚠️ `player-stats/useGamePlayerStats.ts`
- ⚠️ `team-stats/useTeamStats.ts`
- ⚠️ `team-stats/useSingleTeamStats.ts`
- ⚠️ `staff/useStaffDetails.ts`
- ⚠️ `staff/useStaffs.ts`

---

## 🚀 Batch Implementation Strategy

### Priority 1: Detail Pages (Already Complete ✅)

These are the most visible to users and should show errors clearly.

### Priority 2: List Pages & Statistics

```bash
# Add toast import to remaining list hooks
frontend/src/hooks/queries/coach/useCoaches.ts
frontend/src/hooks/queries/referee/useReferees.ts
frontend/src/hooks/queries/venue/useVenues.ts
frontend/src/hooks/queries/game/useGames.ts
frontend/src/hooks/queries/league/useLeagueDetails.ts
```

### Priority 3: Section-Specific Data

Add error handlers to hooks that load specific sections (boxscores, gamelogs, records, etc.)

### Priority 4: Supporting Data

Less critical hooks like seasons, competitions, teams lists

---

## 🔍 Find and Replace Patterns

You can use these patterns for bulk updates:

### Pattern 1: Add Toast Import

**Find:**

```typescript
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
```

**Replace:**

```typescript
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import toast from "react-hot-toast";
```

### Pattern 2: Add onError to useQuery (Simple)

**Find:**

```typescript
enabled: !!{variable}
	});
};
```

**Replace:**

```typescript
enabled: !!{variable},
		onError: () => {
			toast.error('Failed to load {entity}');
		}
	});
};
```

---

## 💡 Advanced Error Handling (Future Enhancement)

### Display API Error Messages

```typescript
onError: (error: any) => {
  const message = error?.response?.data?.message || "Failed to load data";
  toast.error(message);
};
```

### Retry Logic

```typescript
return useQuery({
  queryKey: ["entity", id],
  queryFn: fetchEntity.bind(null, id),
  retry: 2, // Retry failed requests twice
  onError: () => {
    toast.error("Failed to load entity after multiple attempts");
  },
});
```

### Loading States with Toast

```typescript
const query = useQuery({
  queryKey: ["entity", id],
  queryFn: async () => {
    const loadingToast = toast.loading("Loading entity...");
    try {
      const data = await fetchEntity(id);
      toast.dismiss(loadingToast);
      toast.success("Entity loaded successfully");
      return data;
    } catch (error) {
      toast.dismiss(loadingToast);
      throw error;
    }
  },
  onError: () => {
    toast.error("Failed to load entity");
  },
});
```

---

## ✅ Testing Checklist

After adding error handlers:

1. **Test Network Errors**
   - Disconnect internet
   - Verify toast appears with correct message
   - Verify no console errors

2. **Test API Errors**
   - Use invalid IDs
   - Test 404 responses
   - Test 500 responses
   - Verify toast messages are user-friendly

3. **Test Multiple Errors**
   - Navigate quickly between pages
   - Verify toasts don't stack excessively
   - Verify old toasts dismiss

4. **Test Success Cases**
   - Ensure no error toasts on successful loads
   - Verify data displays correctly

---

## 📊 Progress Tracking

**Total Hooks:** ~76
**With Error Handling:** 14 (18%)
**Remaining:** ~62 (82%)

**Estimated Time:** 2-3 hours for full implementation

---

## 🎯 Next Steps

1. Complete Priority 1 hooks (✅ DONE)
2. Add onError handlers to hooks that already have toast imports (~5 hooks)
3. Batch update remaining hooks by category (game → player → team → coach → referee → venue → league)
4. Test error flows on main pages
5. Consider adding error tracking service (Sentry) for production

---

**Last Updated:** January 19, 2026  
**Pattern Established:** Yes  
**Ready for Bulk Implementation:** Yes
