import { useState, useCallback, useRef } from "react";
import useCallApi from "./useCallApi";

const useTasks = () => {
  const { callApi } = useCallApi();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const isLoadingRef = useRef(false);
  const callApiRef = useRef(callApi);

  // Keep callApi ref updated
  callApiRef.current = callApi;

  const fetchTasks = useCallback(
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
        const response = await callApiRef.current("tasks", "GET", null, {
        page: pageNum,
          limit: 10,
      });

      if (response?.success && response?.data) {
        const newTasks = response.data.tasks || [];
        const pagination = response.data.pagination;

        if (isRefresh || pageNum === 1) {
          setTasks(newTasks);
        } else {
            setTasks((prev) => [...prev, ...newTasks]);
        }

          // Logic to determine if there are more items
          if (newTasks.length < 10) {
          setHasMore(false);
          } else if (
            pagination &&
            pagination.currentPage >= pagination.totalPages
          ) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }
        setPage(pageNum);
      }
    } catch (error) {
      console.log("Fetch tasks error", error);
        setHasMore(false);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
        isLoadingRef.current = false;
    }
    },
    [] // Remove callApi from dependencies, using ref instead
  );

  const loadMore = useCallback(() => {
    if (!isLoadingRef.current && hasMore && !loading && !loadingMore) {
      fetchTasks(page + 1);
    }
  }, [fetchTasks, hasMore, loading, loadingMore, page]);

  const onRefresh = useCallback(() => {
    fetchTasks(1, true);
  }, [fetchTasks]);

  const updateTaskStatus = useCallback(
    async (taskId, status, notes = null) => {
    try {
      setLoading(true);
        const payload = {
        status,
      };
      
      // Only include notes if provided
      if (notes !== null && notes !== undefined && notes !== "") {
        payload.notes = notes;
      }
      
        const response = await callApiRef.current(`tasks/${taskId}/status`, "PATCH", payload);
      return response;
    } catch (error) {
      console.log("Update task status error", error);
      throw error;
    } finally {
      setLoading(false);
    }
    },
    [] // Remove callApi from dependencies, using ref instead
  );

  const createTask = useCallback(
    async (payload) => {
    try {
      setLoading(true);
        const response = await callApiRef.current("tasks", "POST", payload);
      return response;
    } catch (error) {
      console.log("Create task error", error);
      throw error;
    } finally {
      setLoading(false);
    }
    },
    [] // Remove callApi from dependencies, using ref instead
  );

  return {
    tasks,
    loading,
    refreshing,
    loadingMore,
    hasMore,
    page,
    fetchTasks,
    loadMore,
    onRefresh,
    updateTaskStatus,
    createTask,
  };
};

export default useTasks;
