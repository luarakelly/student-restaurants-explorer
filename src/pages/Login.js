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

  
}