export const environment = {
  production: true,
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
    baseUrl: 'http://127.0.0.1:3000',
    auth: {
      login: '/auth/local',
    },
    users: {
      me: '/users/me',
    },
  },
};
