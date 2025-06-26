export const getAccessTokenFromCookie = () =>
  document.cookie
    .split("; ")
    .find((row) => row.startsWith("access_token="))
    ?.split("=")[1];

export const getRefreshTokenFromCookie = () =>
  document.cookie
    .split("; ")
    .find((row) => row.startsWith("refresh_token="))
    ?.split("=")[1];
