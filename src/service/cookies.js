const TOKEN_COOKIE_KEY = 'auth_token';
const USER_COOKIE_KEY = 'auth_user';

const isBrowser = typeof window !== 'undefined';

const encodeValue = (value) => encodeURIComponent(value);
const decodeValue = (value) => decodeURIComponent(value || '');

export const setCookie = (key, value, days = 7) => {
  if (!isBrowser) return;

  const expires = new Date(
    Date.now() + days * 24 * 60 * 60 * 1000
  ).toUTCString();
  document.cookie = `${key}=${encodeValue(value)}; expires=${expires}; path=/; SameSite=Lax`;
};

export const getCookie = (key) => {
  if (!isBrowser) return null;

  const name = `${key}=`;
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const trimmed = cookie.trim();
    if (trimmed.startsWith(name)) {
      return decodeValue(trimmed.slice(name.length));
    }
  }

  return null;
};

export const removeCookie = (key) => {
  if (!isBrowser) return;
  document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax`;
};

export const setAuthCookies = ({ token, user }) => {
  if (token) {
    setCookie(TOKEN_COOKIE_KEY, token);
  }

  if (user) {
    setCookie(USER_COOKIE_KEY, JSON.stringify(user));
  }
};

export const clearAuthCookies = () => {
  removeCookie(TOKEN_COOKIE_KEY);
  removeCookie(USER_COOKIE_KEY);
};

export const getTokenFromCookie = () => getCookie(TOKEN_COOKIE_KEY);

export const getUserFromCookie = () => {
  const user = getCookie(USER_COOKIE_KEY);
  if (!user) return null;

  try {
    return JSON.parse(user);
  } catch {
    return null;
  }
};
