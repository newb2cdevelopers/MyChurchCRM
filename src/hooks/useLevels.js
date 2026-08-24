import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchLevels,
  selectLevels,
  selectLevelsLastFetched,
  selectLevelsLoading,
} from '../features/sundaySchool/levelsSlice';

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export function useLevels() {
  const dispatch = useDispatch();
  const levels = useSelector(selectLevels);
  const lastFetched = useSelector(selectLevelsLastFetched);
  const loading = useSelector(selectLevelsLoading);

  const isCacheValid = useCallback(() => {
    if (!lastFetched) return false;
    return Date.now() - lastFetched < CACHE_TTL_MS;
  }, [lastFetched]);

  const ensureLevelsLoaded = useCallback(async () => {
    if (levels.length > 0 && isCacheValid()) {
      return levels;
    }
    await dispatch(fetchLevels()).unwrap();
    // After dispatch, the component will re-render with updated levels from selector
    // We return the current levels; the caller should re-read from the hook after await
    return levels;
  }, [dispatch, levels, isCacheValid]);

  // Auto-fetch on mount if cache is empty or stale
  useEffect(() => {
    if (levels.length === 0 || !isCacheValid()) {
      dispatch(fetchLevels());
    }
  }, [dispatch, levels, isCacheValid]);

  return {
    levels,
    loading,
    ensureLevelsLoaded,
    hasLevels: levels.length > 0,
    isCacheValid: isCacheValid(),
  };
}

export function useLevelTeachers(levelId) {
  const { levels } = useLevels();
  const level = levels.find(l => l._id === levelId);
  return level?.teachers || [];
}
