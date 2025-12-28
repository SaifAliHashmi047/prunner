// Selectors for accessing user state
export const selectUserRole = (state) => state.user.userRole;
export const selectSelectedAccountType = (state) => state.user.selectedAccountType;
export const selectIsAuthenticated = (state) => state.user.isAuthenticated;
export const selectUserProfile = (state) => state.user.userProfile;
