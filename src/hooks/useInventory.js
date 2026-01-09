import { useState, useCallback, useRef } from "react";
import useCallApi from "./useCallApi";

const useInventory = () => {
  const { callApi } = useCallApi();
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const isLoadingRef = useRef(false);
  const callApiRef = useRef(callApi);

  // Keep callApi ref updated
  callApiRef.current = callApi;

  const fetchInventory = useCallback(
    async (pageNum = 1, isRefresh = false) => {
      if (isLoadingRef.current && !isRefresh) return;

      isLoadingRef.current = true;

      if (isRefresh) {
        setRefreshing(true);
        setHasMore(true);
      } else if (pageNum === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      try {
        const response = await callApiRef.current("inventory", "GET", null, {
          page: pageNum,
          limit: 10,
        });

        if (response?.success && response?.data) {
          const list = response.data.inventory || [];
          const pagination = response.data.pagination;

          if (isRefresh || pageNum === 1) {
            setInventory(list);
          } else {
            setInventory(prev => [...prev, ...list]);
          }

          if (pagination && pagination.currentPage >= pagination.totalPages) {
            setHasMore(false);
          } else if (list.length === 0) {
            setHasMore(false);
          } else {
            setHasMore(true);
          }

          setPage(pageNum);
        }
      } catch (error) {
        console.log("Fetch inventory error", error);
        setHasMore(false);
      } finally {
        setLoading(false);
        setRefreshing(false);
        setLoadingMore(false);
        isLoadingRef.current = false;
      }
    },
    []
  );

  const loadMore = useCallback(() => {
    if (!isLoadingRef.current && hasMore && !loading && !loadingMore) {
      fetchInventory(page + 1);
    }
  }, [fetchInventory, hasMore, loading, loadingMore, page]);

  const onRefresh = useCallback(() => {
    fetchInventory(1, true);
  }, [fetchInventory]);

  const createInventory = useCallback(
    async (payload) => {
      try {
        const response = await callApiRef.current("inventory", "POST", payload);
        return response;
      } catch (error) {
        console.log("Create inventory error", error);
        throw error;
      }
    },
    []
  );

  return {
    inventory,
    loading,
    refreshing,
    loadingMore,
    hasMore,
    page,
    fetchInventory,
    loadMore,
    onRefresh,
    createInventory,
  };
};

export default useInventory;

 