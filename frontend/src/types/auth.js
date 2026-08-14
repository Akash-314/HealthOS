import { ROLES } from './roles';

/**
 * User Profile Type Definition Stub
 */
export const DEFAULT_USER_PROFILE = {
  id: '',
  email: '',
  fullName: '',
  role: ROLES.PUBLIC,
  avatarUrl: null,
  phoneNumber: '',
  createdAt: null,
};

/**
 * Auth Session State Type Definition Stub
 */
export const DEFAULT_SESSION_STATE = {
  user: null,
  session: null,
  isAuthenticated: false,
  isLoading: true,
  role: ROLES.PUBLIC,
};
