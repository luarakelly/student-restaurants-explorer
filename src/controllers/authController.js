/**
 * Auth controller — manages state and business logic
 */

import {
  registerRequest,
} from "../services/authService.js";

export default function createAuthController() {

  // ─────────────────────────────────────────────
  // REGISTER
  // ─────────────────────────────────────────────
  async function register(payload) {
    return await registerRequest(payload);
  }

  return {
    register,
  };
}