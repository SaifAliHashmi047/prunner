import { useState, useCallback, useRef } from "react";
import useCallApi from "./useCallApi";

const useHsLogs = () => {
  const { callApi } = useCallApi();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loadingStatusUpdate, setLoadingStatusUpdate] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const isLoadingRef = useRef(false);
  const callApiRef = useRef(callApi);
  callApiRef.current = callApi;

  const fetchHsLogs = useCallback(
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
        const response = await callApiRef.current("hs-logs", "GET", null, {
          page: pageNum,
          limit: 10,
        });

        if (response?.success && response?.data) {
          const list = response.data.hsLogs || [];
          const pagination = response.data.pagination;

          if (isRefresh || pageNum === 1) {
            setLogs(list);
          } else {
            setLogs(prev => [...prev, ...list]);
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
        console.log("Fetch HS logs error", error);
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

  const createHsLog = useCallback(
    async payload => {
      try {
        setLoadingCreate(true);
        const response = await callApiRef.current("hs-logs", "POST", payload);
        return response;
      } catch (error) {
        throw error;
      } finally {
        setLoadingCreate(false);
      }
    },
    []
  );

  const updateHsLogStatus = useCallback(
    async (hsLogId, status, notes) => {
      try {
        setLoadingStatusUpdate(true);
        const payload = {
          status,
          notes: notes || "",
        };
        const response = await callApiRef.current(
          `hs-logs/${hsLogId}/status`,
          "PATCH",
          payload
        );
        return response;
      } catch (error) {
        throw error;
      } finally {
        setLoadingStatusUpdate(false);
      }
    },
    []
  );

  const updateHsLog = useCallback(
    async (hsLogId, payload) => {
      try {
        setLoadingUpdate(true);
        const response = await callApiRef.current(
          `hs-logs/${hsLogId}`,
          "PUT",
          payload
        );
        return response;
      } catch (error) {
        throw error;
      } finally {
        setLoadingUpdate(false);
      }
    },
    []
  );

  const deleteHsLog = useCallback(
    async hsLogId => {
      try {
        setLoadingDelete(true);
        const response = await callApiRef.current(
          `hs-logs/${hsLogId}`,
          "DELETE"
        );
        return response;
      } catch (error) {
        throw error;
      } finally {
        setLoadingDelete(false);
      }
    },
    []
  );

  const loadMore = useCallback(() => {
    if (!isLoadingRef.current && hasMore && !loading && !loadingMore) {
      fetchHsLogs(page + 1);
    }
  }, [fetchHsLogs, hasMore, loading, loadingMore, page]);

  const onRefresh = useCallback(() => {
    fetchHsLogs(1, true);
  }, [fetchHsLogs]);

  return {
    logs,
    loading,
    refreshing,
    loadingMore,
    loadingCreate,
    loadingUpdate,
    loadingDelete,
    loadingStatusUpdate,
    hasMore,
    page,
    fetchHsLogs,
    loadMore,
    onRefresh,
    createHsLog,
    updateHsLogStatus,
    updateHsLog,
    deleteHsLog,
  };
};

export default useHsLogs;


