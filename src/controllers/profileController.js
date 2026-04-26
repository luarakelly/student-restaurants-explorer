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

const USER_KEY = "user";

function profileController() {

  // ─────────────────────────────────────────────
  // GET LOCAL USER
  // ─────────────────────────────────────────────
  function getLocalUser() {
    return JSON.parse(localStorage.getItem(USER_KEY));
  }

  return {
    getLocalUser
  };
}

const profile = profileController();
export default profile;