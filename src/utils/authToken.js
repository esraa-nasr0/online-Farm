import Cookies from "js-cookie";

/**
 * Saves the authentication token in cookies
 * @param {string} token - The authentication token to save
 */
export const setToken = (token) => {
  Cookies.set("token", token, {
    expires: 7,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });
};

/**
 * Retrieves the authentication token from cookies
 * @returns {string|null} The authentication token or null if not found
 */
export const getToken = () => {
  return Cookies.get("token") || null;
};

/**
 * Removes the authentication token from cookies
 */
export const clearToken = () => {
  Cookies.remove("token");
};

