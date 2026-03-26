/**
 * Renders a single restaurant card as an HTML string.
 *
 * @param {object}  r              - The restaurant data object.
 * @param {string}  r._id          - Unique identifier.
 * @param {string}  r.name         - Restaurant name.
 * @param {string}  r.company      - Operating company name.
 * @param {string}  r.address      - Street address.
 * @param {string}  r.city         - City name.
 * @param {string}  r.phone        - Phone number.
 * @param {object}  r.location     - GeoJSON location object.
 * @param {number[]} r.location.coordinates - [longitude, latitude] pair.
 * @param {boolean} active         - Whether this card is currently selected.
 * @param {boolean} favorited      - Whether this restaurant is in the user's favorites.
 * @param {boolean} [nearest=false] - Whether to show the "NEAREST" tag (always the first card).
 * @returns {string} HTML string for the restaurant card.
 */
export function RestaurantCard(r, active, favorited, nearest = false) {
  const [lng, lat] = r.location.coordinates;
  return `
    <div class="restaurant-card ${active ? "active" : ""}" data-id="${r._id}">

      ${nearest ? `<div class="nearest-tag">NEAREST</div>` : ""}

      <div class="card-top">
        <div class="card-title">${r.name}</div>
        <button class="favorite-btn ${favorited ? "active" : ""}" data-fav="${r._id}" title="Save to favorites">
          ${favorited ? "&#10084;&#65039;" : "&#129293;"}
        </button>
      </div>

      <div class="card-company">
        <span class="card-meta__icon">&#127970;</span>
        ${r.company}
      </div>

      <div class="card-meta">
        <span class="card-meta__icon">&#128205;</span>
        ${r.address}, ${r.city}
      </div>

      <div class="card-meta">
        <span class="card-meta__icon">&#128222;</span>
        ${r.phone}
      </div>

      <div class="card-actions">
        <button class="btn btn--primary btn-menu" data-id="${r._id}">
          &#127869; VIEW MENU
        </button>
        <a
          class="btn btn--secondary btn--route"
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.google.com/maps?q=${lat},${lng}"
          title="Get directions"
        >
          &#10148;
        </a>
      </div>

    </div>
  `;
}

/**
 * Binds a single delegated click listener to the restaurant list element.
 * Handles card selection, favorite toggling, and menu opening
 * without needing to re-bind after every re-render.
 *
 * @param {HTMLElement} listEl          - The container element holding all restaurant cards.
 * @param {object}      handlers        - Event handler callbacks.
 * @param {function(id: string): void} handlers.onSelect   - Called when a card body is clicked.
 * @param {function(id: string): void} handlers.onFavorite - Called when the favorite button is clicked.
 * @param {function(id: string): void} handlers.onMenu     - Called when the "View Menu" button is clicked.
 */
export function bindRestaurantCardEvent(listEl, { onSelect, onFavorite, onMenu }) {
  listEl.addEventListener("click", (e) => {
    const card = e.target.closest(".restaurant-card");
    if (!card) return;

    const id = card.dataset.id;

    // Use closest() so clicks on the emoji inside the <button> still register.
    if (e.target.closest(".favorite-btn")) {
      onFavorite?.(id);
      return;
    }

    if (e.target.closest(".btn-menu")) {
      onMenu?.(id);
      return;
    }

    // Let the <a> handle navigation natively without also selecting the card.
    if (e.target.closest(".btn--route")) {
      return;
    }

    onSelect?.(id);
  });
}