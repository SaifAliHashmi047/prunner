import { useState, useCallback } from "react";
import useCallApi from "./useCallApi";

const useTasks = () => {
  const { callApi } = useCallApi();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchTasks = useCallback(async (pageNum, isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else if (pageNum === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const response = await callApi("tasks", "GET", null, {
        page: pageNum,
        limit: 10
      });

      if (response?.success && response?.data) {
        const newTasks = response.data.tasks || [];
        const pagination = response.data.pagination;

        if (isRefresh || pageNum === 1) {
          setTasks(newTasks);
        } else {
          setTasks(prev => [...prev, ...newTasks]);
        }

        if (pagination && pagination.currentPage >= pagination.totalPages) {
          setHasMore(false);
        } else if (newTasks.length === 0) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }
        setPage(pageNum);
      }
    } catch (error) {
      console.log("Fetch tasks error", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  }, [callApi]);

  const updateTaskStatus = useCallback(async (taskId, status, notes) => {
    try {
      setLoading(true);
      const response = await callApi(`tasks/${taskId}/status`, "PATCH", {
        status,
        notes
      });
      return response;
    } catch (error) {
      console.log("Update task status error", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [callApi]);

  const createTask = useCallback(async (payload) => {
    try {
      setLoading(true);
      const response = await callApi("tasks", "POST", payload);
      return response;
    } catch (error) {
      console.log("Create task error", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [callApi]);

  return {
    tasks,
    loading,
    refreshing,
    loadingMore,
    hasMore,
    page,
    fetchTasks,
    updateTaskStatus,
    createTask
  };
};

export default useTasks;
