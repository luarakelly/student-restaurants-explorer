import profile from "../controllers/profileController.js";
import auth from "../controllers/authController.js";
import { openModal, ModalHeader } from "../components/Modal.js";
import Login from "../components/Login.js";

export default async function render(app) {
  const IMG_PATH = "https://media2.edu.metropolia.fi/restaurant/uploads/";

  // always fresh user per render
  let user = profile.getLocalUser();

  // ─── NOT LOGGED IN ─────────────────────────────
  if (!user) {
    app.innerHTML = `
      <div class="profile--locked">
        <h2>Please log in to view your profile</h2>
        <button id="login-btn" class="btn btn--primary">Login</button>
      </div>
    `;

    app.querySelector("#login-btn").addEventListener("click", () => {
      Login(async () => {
        await render(app);
        window.location.hash = "#/profile"; 
      });
    });
    return;
  }

  // ─── RENDER UI ────────────────────────────────
  app.innerHTML = `
    <div class="profile">

      <section class="profile__header">

        <div class="profile__avatar">
          <img src="${IMG_PATH + user.avatar}" />
        </div>

        <div class="profile__info">
          <h2>${user.username}</h2>
          <p>${user.email}</p>
        </div>

        <div class="profile__actions">
          <button id="edit-btn" class="btn btn--secondary btn--small">Edit</button>
          <button id="logout-btn" class="btn btn--ghost btn--small profile__logout">Logout</button>
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

  // ─── EDIT MODAL ──────────────────────────────
  function openEditModal() {
    const currentUser = profile.getLocalUser();

    const overlay = openModal(`
      ${ModalHeader("Edit Profile", "Update your account")}

      <div class="modal__form">

        <div class="modal__field">
          <label>Avatar</label>
          <div class="file-upload">
            <input id="avatar-input" type="file" accept="image/*" />
            <label for="avatar-input" class="file-upload__btn">
              Choose image
            </label>
            <span class="file-upload__name">No file selected</span>
          </div>
        </div>

        <div class="modal__field">
          <label>Username</label>
          <input id="username" value="${currentUser.username}" />
        </div>

        <div class="modal__field">
          <label>Email</label>
          <input id="email" value="${currentUser.email}" />
        </div>

        <div class="modal__field">
          <label>Password</label>
          <input id="password" type="password" placeholder="New password" />
        </div>

        <button id="save" class="btn btn--primary btn--full">
          Save Changes
        </button>

      </div>
    `);
  }

  // ─── EVENTS ────────────────────────────────

  app.querySelector("#edit-btn").addEventListener("click", openEditModal);

  app.querySelector("#logout-btn").addEventListener("click", async () => {
    auth.logout();
    await render(app);
    window.location.hash = "#/Discovery";
  });
}