/**
 * Config file that manages API endpoints
 *
 * This file exports 'apiUrl' which is used
 * across the application for making API calls
 * The value of 'apiUrl' is determined by the environment
 * in which the application is running.
 *
 * So, if it's production the 'apiUrl' will be set to the domain url
 * where the back-end is hosted. And if it's in development environment
 * it defaults to 'localhost:3000'
 *
 *
 */

export const apiUrl =
  process.env.NODE_ENV === "production"
    ? "https://dirtyburgerproject.com:3000"
    : "http://localhost:3000";
