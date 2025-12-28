import { useSelector } from 'react-redux';
import { selectUserRole, selectSelectedAccountType } from '../store/selectors';

// Custom hook to easily access user role data
export const useUserRole = () => {
  const userRole = useSelector(selectUserRole);
  const selectedAccountType = useSelector(selectSelectedAccountType);

  return {
    userRole,
    selectedAccountType,
    isSubcontractor: userRole === 'subcontractor',
    isForklift: userRole === 'forklift',
  };
};
