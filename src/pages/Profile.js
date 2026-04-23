/**
 * @fileoverview Profile page — manages user data, preferences,
 * favorites and profile image with edit mode support.
 */

export default function render(app) {
  // ─── State ────────────────────────────────────────────────────────────────

  let isEditing = false;

  let profile = {
    name: "Laura Hyttynen",
    email: "laura@example.com",
    preferences: {
      vegetarian: false,
      vegan: false,
      glutenFree: false
    },
    avatar: null
  };

  let favorites = new Set();

  // ─── Layout ───────────────────────────────────────────────────────────────

  app.innerHTML = `
    <div class="profile">
      <section class="profile__header">
        <div class="profile__avatar">
          <img id="avatar-img" src="https://via.placeholder.com/120" />
          <input type="file" id="avatar-input" accept="image/*" hidden />
          <button id="avatar-btn" class="btn btn--secondary">Change Photo</button>
        </div>

        <div class="profile__info">
          <input id="name" placeholder="Name" />
          <input id="email" placeholder="Email" />

          <div class="profile__actions">
            <button id="edit-btn" class="btn btn--primary">Edit</button>
          </div>
        </div>
      </section>

      <section class="profile__preferences">
        <h3>Preferences</h3>
        <label><input type="checkbox" id="veg" /> Vegetarian</label>
        <label><input type="checkbox" id="vegan" /> Vegan</label>
        <label><input type="checkbox" id="gf" /> Gluten-free</label>
      </section>

      <section class="profile__favorites">
        <h3>Favorite Restaurants</h3>
        <div id="favorites-list" class="favorites-list"></div>
      </section>
    </div>
  `;

  const avatarInput = app.querySelector("#avatar-input");
  const avatarImg = app.querySelector("#avatar-img");
  const avatarBtn = app.querySelector("#avatar-btn");
  const favoritesList = app.querySelector("#favorites-list");

  // ─── Render ───────────────────────────────────────────────────────────────

  function renderFavorites() {
    const data = null;
  }

  function renderPreferences() {
    const veg = app.querySelector("#veg");
    const vegan = app.querySelector("#vegan");
    const gf = app.querySelector("#gf");

    veg.checked = profile.preferences.vegetarian;
    vegan.checked = profile.preferences.vegan;
    gf.checked = profile.preferences.glutenFree;

    veg.disabled = !isEditing;
    vegan.disabled = !isEditing;
    gf.disabled = !isEditing;
  }

  function renderProfile() {
    const nameInput = app.querySelector("#name");
    const emailInput = app.querySelector("#email");
    const editBtn = app.querySelector("#edit-btn");

    nameInput.value = profile.name;
    emailInput.value = profile.email;

    nameInput.disabled = !isEditing;
    emailInput.disabled = !isEditing;

    avatarImg.src = profile.avatar || "https://via.placeholder.com/120";
    avatarBtn.style.display = isEditing ? "inline-flex" : "none";

    editBtn.textContent = isEditing ? "Save" : "Edit";

    renderPreferences();
    renderFavorites();
  }

  // ─── Init ─────────────────────────────────────────────────────────────────

  renderProfile();
}