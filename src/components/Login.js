/**
 * Auth modal — handles Login + Create Account
 */

import { openModal, ModalHeader } from "./Modal.js";
import auth  from "../controllers/authController.js"

export default function Login() {
  
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

  // ─── Login Submit ─────────────────────────
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
      const username = overlay.querySelector("#login-username").value;
      const password = overlay.querySelector("#login-password").value;

      if (!username || !password) {
        alert("Login failed. Please input your credentials.");
        return;
      } else if ((username  || password) < 5) {
        alert("Login failed. Please provide credentials with minimun 5 characters.");
        return;
      };


      await auth.login({ username, password });

      overlay.remove();
    } catch (err) {
      console.error("Login failed:", err);
      alert("Login failed. Please check your credentials.");
    }
  });

  // ─── Register Submit ──────────────────────
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = overlay.querySelector("#reg-username").value;
    const email = overlay.querySelector("#reg-email").value;
    const password = overlay.querySelector("#reg-password").value;

    await auth.register({ username, email, password });
    await auth.login({ username, password });

    overlay.remove();
  });
}