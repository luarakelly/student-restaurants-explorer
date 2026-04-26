/**
 * Profile controller responsibilities:
 * - Fetch user
 * - Update profile
 * - Upload avatar
 * - Sync localStorage
 */

import {
  fetchCurrentUserRequest,
} from "../services/profileService.js";

import auth from "./authController.js";

const USER_KEY = "user";

function profileController() {

  // ─────────────────────────────────────────────
  // GET LOCAL USER
  // ─────────────────────────────────────────────
  function getLocalUser() {
    return JSON.parse(localStorage.getItem(USER_KEY));
  }

  // ─────────────────────────────────────────────
  // INIT / FETCH USER
  // ─────────────────────────────────────────────
  async function init() {
    const token = auth.getToken();
    if (!token) return null;

    const user = await fetchCurrentUserRequest(token);

    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  return {
    init,
    getLocalUser
  };
}

const profile = profileController();
export default profile;