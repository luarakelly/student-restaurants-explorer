/**
 * Auth modal — handles Login + Create Account
 */

import { openModal, ModalHeader } from "../components/Modal.js";

export default function render(app) {
  const overlay = openModal(`
    ${ModalHeader("Welcome", "Login or create an account")}

    <div class="auth">

      <!-- Tabs -->
      <div class="auth__tabs">
        <button id="tab-login" class="auth__tab auth__tab--active">Login</button>
        <button id="tab-register" class="auth__tab">Create Account</button>
      </div>

      <!-- Login Form -->
      <form id="login-form" class="auth__form">
        <input id="login-email" type="email" placeholder="Email" />
        <input id="login-password" type="password" placeholder="Password" />

        <button type="submit" class="btn btn--primary">
          Login
        </button>
      </form>

      <!-- Register Form -->
      <form id="register-form" class="auth__form hidden">
        <input id="reg-username" type="text" placeholder="Username" />
        <input id="reg-email" type="email" placeholder="Email" />
        <input id="reg-password" type="password" placeholder="Password" />

        <button type="submit" class="btn btn--primary">
          Create Account
        </button>
      </form>

    </div>
  `);

  // ─── Elements ─────────────────────────────
  const loginForm = overlay.querySelector("#login-form");
  const registerForm = overlay.querySelector("#register-form");

  const tabLogin = overlay.querySelector("#tab-login");
  const tabRegister = overlay.querySelector("#tab-register");

  // ─── Tab Switching ────────────────────────
  function showLogin() {
    loginForm.classList.remove("hidden");
    registerForm.classList.add("hidden");

    tabLogin.classList.add("auth__tab--active");
    tabRegister.classList.remove("auth__tab--active");
  }

  function showRegister() {
    registerForm.classList.remove("hidden");
    loginForm.classList.add("hidden");

    tabRegister.classList.add("auth__tab--active");
    tabLogin.classList.remove("auth__tab--active");
  }

  tabLogin.addEventListener("click", showLogin);
  tabRegister.addEventListener("click", showRegister);

}