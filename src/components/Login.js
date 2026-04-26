/**
 * Auth modal — handles Login + Create Account
 */

import { openModal, ModalHeader } from "./Modal.js";
import auth from "../controllers/authController.js";
import profile from "../controllers/profileController.js";

export default function Login(onSuccess) {
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
        <input id="login-username" type="text" placeholder="Username" />
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

  // ─── ELEMENTS ─────────────────────────────
  const loginForm = overlay.querySelector("#login-form");
  const registerForm = overlay.querySelector("#register-form");

  const tabLogin = overlay.querySelector("#tab-login");
  const tabRegister = overlay.querySelector("#tab-register");

  // ─── TAB SWITCH ───────────────────────────
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

  // ─── LOGIN SUBMIT ─────────────────────────
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = overlay.querySelector("#login-username").value.trim();
    const password = overlay.querySelector("#login-password").value.trim();

    if (!username || !password) {
      alert("Please fill in all fields.");
      return;
    }

    if (username.length < 5 || password.length < 5) {
      alert("Credentials must be at least 5 characters long.");
      return;
    }

    try {
      await auth.login({ username, password });
      await profile.init(); // ← wait for user to be saved to localStorage
      onSuccess?.();        // ← then navigate
      overlay.remove();
    } catch (err) {
      console.error("Login failed:", err);
      alert("Login failed. Please check your credentials.");
    }
  });

  // ─── REGISTER SUBMIT ──────────────────────
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = overlay.querySelector("#reg-username").value.trim();
    const email = overlay.querySelector("#reg-email").value.trim();
    const password = overlay.querySelector("#reg-password").value.trim();

    if (!username || !email || !password) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      await auth.register({ username, email, password });
      await auth.login({ username, password });
      await profile.init(); // ← same here
      onSuccess?.();
      overlay.remove();
    } catch (err) {
      console.error("Register failed:", err);
      alert("Registration failed.");
    }
  });
}