import { useState, useCallback, useRef, useEffect } from "react";
import useCallApi from "./useCallApi";
import { setSelectedSite, setSites as setSitesInRedux } from "../services/store/slices/siteSlice";
import { useDispatch } from "react-redux";

const useSite = () => {
  const dispatch = useDispatch();
  const { callApi } = useCallApi();
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const isLoadingRef = useRef(false);
  useEffect(() => {
    if (sites?.length > 0) {
      dispatch(setSelectedSite(sites[0]));
      dispatch(setSitesInRedux(sites))
    }
  }, [sites]);
  // useEffect(() => {
  // fetchSites(1)
  // }, [ ]);
  const fetchSites =  
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
        const response = await callApi(
          "site",
          "GET",
          null,
          {
            page: pageNum,
            limit: 10,
          }
        );

        if (response?.success && response?.data) {
          const list = response.data.sites || [];
          const pagination = response.data.pagination;

          if (isRefresh || pageNum === 1) {
            setSites(list);
          } else {
            setSites((prev) => [...prev, ...list]);
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
        console.log("Error fetching sites", error);
        setHasMore(false);
      } finally {
        setLoading(false);
        setRefreshing(false);
        setLoadingMore(false);
        isLoadingRef.current = false;
      }
    }
    

  const loadMore = useCallback(() => {
    if (!isLoadingRef.current && hasMore && !loading && !loadingMore) {
      fetchSites(page + 1);
    }
  }, [fetchSites, hasMore, loading, loadingMore, page]);

  const onRefresh = useCallback(() => {
    fetchSites(1, true);
  }, [fetchSites]);

  // Legacy function for backward compatibility
  const getSites =  async () => {
    try {
      const response = await callApi("site", "GET");
      if (response?.success && response?.data) {
        return response.data.sites;
      }
      return null;
    } catch (error) {
      console.log("Error fetching sites", error);
      return null;
    }
  } 

  return {
    sites,
    loading,
    refreshing,
    loadingMore,
    hasMore,
    page,
    fetchSites,
    loadMore,
    onRefresh,
    getSites, // Keep for backward compatibility
  };
};

export default useSite;