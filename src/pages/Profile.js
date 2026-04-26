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
        await profile.init(); 
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

    const fileInput = overlay.querySelector("#avatar-input");
    const fileName = overlay.querySelector(".file-upload__name");

    fileInput.addEventListener("change", () => {
      fileName.textContent = fileInput.files[0]
        ? fileInput.files[0].name
        : "No file selected";
    });

    overlay.querySelector("#save").addEventListener("click", async () => {
      const file = fileInput.files[0];

      const newUsername = overlay.querySelector("#username").value.trim();
      const newEmail = overlay.querySelector("#email").value.trim();
      const newPassword = overlay.querySelector("#password").value.trim();

      const updates = {};

      // avatar update
      if (file) {
        await profile.changeAvatar(file);
      }

      // compare against current user
      if (newUsername !== currentUser.username) {
        updates.username = newUsername;
      }

      if (newEmail !== currentUser.email) {
        updates.email = newEmail;
      }

      if (newPassword.length > 0) {
        updates.password = newPassword;
      }

      if (Object.keys(updates).length > 0) {
        await profile.saveProfile(updates);
      }

      overlay.remove();

      // refresh UI with new data
      await profile.init();
      await render(app);
    });
  }

  // ─── EVENTS ────────────────────────────────

  app.querySelector("#edit-btn").addEventListener("click", openEditModal);

  app.querySelector("#logout-btn").addEventListener("click", async () => {
    auth.logout();
    await render(app);
    window.location.hash = "#/Discovery";
  });
}