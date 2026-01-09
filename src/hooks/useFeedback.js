import { useState, useCallback, useRef } from "react";
import useCallApi from "./useCallApi";

const useFeedback = ( ) => {
  const { callApi } = useCallApi();
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const isLoadingRef = useRef(false);
  const callApiRef = useRef(callApi);

  // Keep callApi ref updated
  callApiRef.current = callApi;

  const fetchFeedback = useCallback(
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
        const response = await callApiRef.current("feedback/my-feedback", "GET", null, {
          page: pageNum,
          limit: 10,
        });

        if (response?.success && response?.data) {
          // Handle different response structures
          const list =
            response.data.sites ||
            response.data.feedback ||
            response.data.feedbacks ||
            [];
          const pagination = response.data.pagination;

          if (isRefresh || pageNum === 1) {
            setFeedback(list);
          } else {
            setFeedback((prev) => [...prev, ...list]);
          }

          // Logic to determine if there are more items
          if (list.length < 10) {
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
        console.log("Fetch feedback error", error);
        setHasMore(false);
      } finally {
        setLoading(false);
        setRefreshing(false);
        setLoadingMore(false);
        isLoadingRef.current = false;
      }
    },
    [ ] // Only endpoint in dependencies, using ref for callApi
  );

  const loadMore = useCallback(() => {
    if (!isLoadingRef.current && hasMore && !loading && !loadingMore) {
      fetchFeedback(page + 1);
    }
  }, [fetchFeedback, hasMore, loading, loadingMore, page]);

  const onRefresh = useCallback(() => {
    fetchFeedback(1, true);
  }, [fetchFeedback]);

  return {
    feedback,
    loading,
    refreshing,
    loadingMore,
    hasMore,
    page,
    fetchFeedback,
    loadMore,
    onRefresh,
  };
};

export default useFeedback;

