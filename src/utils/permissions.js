import { PERMISSIONS } from '../constants/rbac.constants';

/**
 * Checks if the cached permissions list includes a specific permission
 * @param {string[]} permissions - The cached permissions array from AuthContext
 * @param {string} permission - The permission to check
 * @returns {boolean}
 */
export const hasPermission = (permissions = [], permission) => {
  return permissions.includes(permission);
};

export const canManageNews = (permissions) => hasPermission(permissions, PERMISSIONS.MANAGE_NEWS);
export const canManageProducts = (permissions) => hasPermission(permissions, PERMISSIONS.MANAGE_PRODUCTS);
export const canManagePopulation = (permissions) => hasPermission(permissions, PERMISSIONS.MANAGE_POPULATION);
export const canManageAdministrators = (permissions) => hasPermission(permissions, PERMISSIONS.MANAGE_ADMINISTRATORS);
