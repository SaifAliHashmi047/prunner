import { useState, useCallback } from "react";
import useCallApi from "./useCallApi";

const useWorkpacks = () => {
  const { callApi } = useCallApi();
  const [workpacks, setWorkpacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchWorkPacks = useCallback(async (pageNum = 1, isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else if (pageNum === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const response = await callApi("workpacks", "GET", null, {
        page: pageNum,
        limit: 10
      });

      if (response?.success && response?.data) {
        const newWorkPacks = response.data.workpacks || [];
        const pagination = response.data.pagination;

        if (isRefresh || pageNum === 1) {
          setWorkpacks(newWorkPacks);
        } else {
          setWorkpacks(prev => [...prev, ...newWorkPacks]);
        }

        if (pagination && pagination.currentPage >= pagination.totalPages) {
          setHasMore(false);
        } else if (newWorkPacks.length === 0) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }
        setPage(pageNum);
      }
    } catch (error) {
      console.log("Fetch workpacks error", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  }, [callApi]);

  const loadMore = () => {
    if (!loadingMore && !loading && hasMore) {
      fetchWorkPacks(page + 1);
    }
  };

  const onRefresh = () => {
    fetchWorkPacks(1, true);
  };

  return {
    workpacks,
    loading,
    refreshing,
    loadingMore,
    hasMore,
    fetchWorkPacks,
    loadMore,
    onRefresh
  };
};

export default useWorkpacks;
