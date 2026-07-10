export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  PROFILE_ADMIN: 'PROFILE_ADMIN',
  MARKETING_ADMIN: 'MARKETING_ADMIN',
};

export const PERMISSIONS = {
  MANAGE_ADMINISTRATORS: 'manage_administrators',
  MANAGE_NEWS: 'manage_news',
  MANAGE_PRODUCTS: 'manage_products',
  MANAGE_POPULATION: 'manage_population',
};

export const ROLE_PERMISSIONS = {
  SUPER_ADMIN: Object.values(PERMISSIONS),
  PROFILE_ADMIN: [
    PERMISSIONS.MANAGE_NEWS,
    PERMISSIONS.MANAGE_POPULATION,
  ],
  MARKETING_ADMIN: [
    PERMISSIONS.MANAGE_PRODUCTS,
  ],
};

export const ROLE_LABELS = {
  SUPER_ADMIN: "Super Admin",
  PROFILE_ADMIN: "Admin Profil",
  MARKETING_ADMIN: "Admin Marketing",
};

export const ROLE_BADGE_VARIANTS = {
  SUPER_ADMIN: "red",
  PROFILE_ADMIN: "blue",
  MARKETING_ADMIN: "green",
};
