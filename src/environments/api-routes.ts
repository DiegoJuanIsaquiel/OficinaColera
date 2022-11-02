export const apiRoutes = {
  auth: {
    login: '/auth/local',
  },
  users: {
    list: '/users',
    get: '/users/{userId}',
    create: '/users',
    update: '/users/{userId}',
    me: '/users/me',
  },
  userPassword: {
    forgotPassword: '/users/password/forgot/email/{email}',
    resetPassword: '/users/password/reset/{resetPasswordCode}',
  },
} as const;
