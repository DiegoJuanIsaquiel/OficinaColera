export const environment = {
  production: true,
  hmr: false,
  keys: {
    token: 'TOKEN_PROXY_KEY',
    refreshToken: 'REFRESH_TOKEN_PROXY_KEY',
    user: 'USER_PROXY_KEY',
  },
  config: {
    redirectToWhenAuthenticated: '/pages/dashboard',
    redirectToWhenUnauthenticated: '/auth/login',
  },
  api: {
    baseUrl: 'http://localhost:3000',
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
  },
};
