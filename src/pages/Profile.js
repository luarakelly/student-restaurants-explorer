import profile from "../controllers/profileController.js";
import auth from "../controllers/authController.js";
import { openModal, ModalHeader } from "../components/Modal.js";
import Login from "../components/Login.js";

export default async function render(app) {
  const user = profile.getLocalUser();

  // ─── NOT LOGGED IN ─────────────────────────────
  if (!user) {
    Login();

    app.innerHTML = `
      <div class="profile--locked">
        <h2>Please log in to view your profile</h2>
        <button id="login-btn" class="btn btn--primary">Login</button>
      </div>
    `;

    app.querySelector("#login-btn").addEventListener("click", Login);
    return;
  }

  // ─── RENDER UI ────────────────────────────────
  app.innerHTML = `
    <div class="profile">

      <section class="profile__header">

        <div class="profile__avatar">
          <img id="avatar" src="${user.avatar}" />
        </div>

        <div class="profile__info">
          <button id="logout-btn" class="profile__logout">
            Logout
          </button>

          <h2 id="username">${user.username}</h2>
          <p id="email">${user.email}</p>

          <button id="edit-btn">Edit Profile</button>
        </div>

      </section>

      <section class="profile__preferences">
        <h3>Preferences</h3>
        <p id="prefs-text">No preferences selected</p>
      </section>

      <section class="profile__favorites">
        <h3>Favorites</h3>
        <div id="favorites-list"></div>
      </section>

    </div>
  `;

  // ─── EVENTS ────────────────────────────────

  // Logout
  app.querySelector("#logout-btn").addEventListener("click", () => {
    auth.logout();

    app.innerHTML = `
      <div class="profile--locked">
        <h2>You have been logged out</h2>
        <button id="login-btn" class="btn btn--primary">Login</button>
      </div>
    `;

    app.querySelector("#login-btn").addEventListener("click", Login);
  });
}