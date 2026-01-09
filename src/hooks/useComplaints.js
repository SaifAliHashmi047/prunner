import { useState, useCallback, useRef } from 'react';
import useCallApi from './useCallApi';

const useComplaints = () => {
  const { callApi } = useCallApi();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const isLoadingRef = useRef(false);

  const fetchComplaints = useCallback(async (pageNum = 1, isRefresh = false) => {
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
      const response = await callApi("complain/my-complains", "GET", {}, {
        page: pageNum,
        limit: 10
      });

      if (response?.success && response?.data) {
        const list = response.data.complains || response.data.complaints || []; // Checking both just in case
        const pagination = response.data.pagination;

        if (isRefresh || pageNum === 1) {
          setComplaints(list);
        } else {
          setComplaints(prev => [...prev, ...list]);
        }

        if (list.length < 10) {
          setHasMore(false);
        } else if (pagination && pagination.currentPage >= pagination.totalPages) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }
        setPage(pageNum);
      }
    } catch (error) {
      console.log("Fetch complaints error", error);
      setHasMore(false);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
      isLoadingRef.current = false;
    }
  }, [callApi]);

  const loadMore = () => {
    if (!isLoadingRef.current && hasMore) {
      fetchComplaints(page + 1);
    }
  };

  const onRefresh = () => {
    fetchComplaints(1, true);
  };

  const createComplaint = useCallback(async (payload) => {
    try {
      setLoading(true);
      const response = await callApi("complain", "POST", payload);
      return response;
    } catch (error) {
      console.log("Create complaint error", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [callApi]);

  return {
    complaints,
    loading,
    refreshing,
    loadingMore,
    hasMore,
    fetchComplaints,
    loadMore,
    onRefresh,
    createComplaint
  };
};

export default useComplaints;
