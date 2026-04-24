/**
 * Auth controller — manages state and business logic
 */

import {
  loginRequest,
  registerRequest,
  fetchCurrentUserRequest,
  updateUserRequest,
  uploadAvatarRequest
} from "../services/authService.js";

export default function authController() {
  // ─────────────────────────────────────────────
  // LOGIN
  // ─────────────────────────────────────────────
  async function login(credentials) {
    const data = await loginRequest(credentials);
    return data;
  }

  // ─────────────────────────────────────────────
  // REGISTER
  // ─────────────────────────────────────────────
  async function register(payload) {
    return await registerRequest(payload);
  }

  return {
    login,
    register,
  };
}