/**
 * HealthOS Core System Roles
 */
export const ROLES = {
  PUBLIC: 'PUBLIC',
  PATIENT: 'PATIENT',
  HOSPITAL: 'HOSPITAL',
  AUTHORITY: 'AUTHORITY',
  ADMIN: 'ADMIN',
};

/**
 * HealthOS Permission Hierarchy
 */
export const PERMISSIONS = {
  // Public
  VIEW_PUBLIC_HOSPITALS: 'VIEW_PUBLIC_HOSPITALS',
  VIEW_EMERGENCY_INFO: 'VIEW_EMERGENCY_INFO',

  // Patient
  BOOK_APPOINTMENT: 'BOOK_APPOINTMENT',
  REQUEST_EMERGENCY: 'REQUEST_EMERGENCY',
  VIEW_PATIENT_RECORDS: 'VIEW_PATIENT_RECORDS',
  USE_AI_ASSISTANT: 'USE_AI_ASSISTANT',

  // Hospital
  MANAGE_BEDS: 'MANAGE_BEDS',
  MANAGE_DOCTORS: 'MANAGE_DOCTORS',
  MANAGE_APPOINTMENTS: 'MANAGE_APPOINTMENTS',
  HANDLE_HOSPITAL_EMERGENCY: 'HANDLE_HOSPITAL_EMERGENCY',
  VIEW_HOSPITAL_ANALYTICS: 'VIEW_HOSPITAL_ANALYTICS',

  // Authority & Admin
  MONITOR_NETWORK: 'MONITOR_NETWORK',
  MONITOR_CAPACITY: 'MONITOR_CAPACITY',
  MANAGE_HOSPITAL_REGISTRATION: 'MANAGE_HOSPITAL_REGISTRATION',
  VIEW_AGGREGATED_ALERTS: 'VIEW_AGGREGATED_ALERTS',
  SYSTEM_SETTINGS: 'SYSTEM_SETTINGS',
};

/**
 * Default role to permissions mapping
 */
export const ROLE_PERMISSIONS = {
  [ROLES.PUBLIC]: [
    PERMISSIONS.VIEW_PUBLIC_HOSPITALS,
    PERMISSIONS.VIEW_EMERGENCY_INFO,
  ],
  [ROLES.PATIENT]: [
    PERMISSIONS.VIEW_PUBLIC_HOSPITALS,
    PERMISSIONS.VIEW_EMERGENCY_INFO,
    PERMISSIONS.BOOK_APPOINTMENT,
    PERMISSIONS.REQUEST_EMERGENCY,
    PERMISSIONS.VIEW_PATIENT_RECORDS,
    PERMISSIONS.USE_AI_ASSISTANT,
  ],
  [ROLES.HOSPITAL]: [
    PERMISSIONS.MANAGE_BEDS,
    PERMISSIONS.MANAGE_DOCTORS,
    PERMISSIONS.MANAGE_APPOINTMENTS,
    PERMISSIONS.HANDLE_HOSPITAL_EMERGENCY,
    PERMISSIONS.VIEW_HOSPITAL_ANALYTICS,
  ],
  [ROLES.AUTHORITY]: [
    PERMISSIONS.MONITOR_NETWORK,
    PERMISSIONS.MONITOR_CAPACITY,
    PERMISSIONS.MANAGE_HOSPITAL_REGISTRATION,
    PERMISSIONS.VIEW_AGGREGATED_ALERTS,
  ],
  [ROLES.ADMIN]: [
    PERMISSIONS.MONITOR_NETWORK,
    PERMISSIONS.MONITOR_CAPACITY,
    PERMISSIONS.MANAGE_HOSPITAL_REGISTRATION,
    PERMISSIONS.VIEW_AGGREGATED_ALERTS,
    PERMISSIONS.SYSTEM_SETTINGS,
  ],
};

/**
 * Permission check helper
 */
export function hasRole(userRole, requiredRole) {
  if (!userRole) return requiredRole === ROLES.PUBLIC;
  if (Array.isArray(requiredRole)) {
    return requiredRole.includes(userRole);
  }
  return userRole === requiredRole;
}

/**
 * Specific permission check helper
 */
export function hasPermission(userRole, permission) {
  if (!userRole) {
    return ROLE_PERMISSIONS[ROLES.PUBLIC].includes(permission);
  }
  const userPermissions = ROLE_PERMISSIONS[userRole] || [];
  return userPermissions.includes(permission);
}

/**
 * Route access permission evaluator
 */
export function canAccessRoute(userRole, routePath) {
  if (routePath.startsWith('/patient')) {
    return userRole === ROLES.PATIENT;
  }
  if (routePath.startsWith('/hospital')) {
    return userRole === ROLES.HOSPITAL;
  }
  if (routePath.startsWith('/admin')) {
    return userRole === ROLES.ADMIN || userRole === ROLES.AUTHORITY;
  }
  return true; // Public or auth routes
}
