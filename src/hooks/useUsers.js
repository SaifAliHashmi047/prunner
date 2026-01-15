import { useState, useCallback, useRef } from 'react';
import useCallApi from './useCallApi';
import { toastError } from '../services/utilities/toast/toast';
import { useAppSelector } from '../services/store/hooks';
import { setUserData } from '../services/store/slices/userSlice';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useUsers = () => {
  const { callApi } = useCallApi();
  const { user } = useAppSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
const dispatch = useDispatch();
  const isLoadingRef = useRef(false);

  const fetchUsers = useCallback(async (pageNum = 1, isRefresh = false) => {
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
      // Using endpoint 'user/all' as indicated by user's manual change
      const response = await callApi("user/all", "GET", {}, {
        page: pageNum,
        limit: 10
      });

      if (response?.success && response?.data) {
        const list = response.data.users || [];
        const pagination = response.data.pagination;

        if (isRefresh || pageNum === 1) {
          setUsers(list);
        } else {
          setUsers(prev => [...prev, ...list]);
        }

        // Logic to determine if there are more items
        // If we received fewer items than requested (10), we are at the end.
        if (list.length < 10) {
          setHasMore(false);
        }
        else if (pagination && pagination.currentPage >= pagination.totalPages) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }
        setPage(pageNum);
      }
    } catch (error) {
      console.log("Fetch users error", error);
      setHasMore(false);

      // toastError handled by useCallApi usually, but we can ensure
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
      isLoadingRef.current = false;
    }
  }, [callApi]); // removed loading states from dependency to prevent recreation loops

  const loadMore = () => {
    if (!isLoadingRef.current && hasMore) {
      fetchUsers(page + 1);
    }
  };

  const onRefresh = () => {
    fetchUsers(1, true);
  };
const getLoggedInUser = useCallback(async () => {
    try {
      if (user?._id) {
        const response = await callApi(`user/${user._id}`);
        console.log("response", response);

        if (response?.data) {
          dispatch(setUserData(response.data));
          await AsyncStorage.setItem("user", JSON.stringify(response.data));
        }
      }
    } catch (error) {
      console.log("Error fetching user data", error);
    } 
  
}, [callApi]);
  return {
    users,
    loading,
    refreshing,
    loadingMore,
    hasMore,
    fetchUsers,
    getLoggedInUser,
    loadMore,
    onRefresh
  };
};

export default useUsers;
