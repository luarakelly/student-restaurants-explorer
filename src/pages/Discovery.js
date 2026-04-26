/**
 * Discovery page — owns all state for the restaurant list,
 * search filters, and map. Composes SearchBox, RestaurantCard, MapPanel,
 * MenuCard and Modal components and wires them together.
 */

import discovery from "../controllers/discoveryController.js";
import auth from "../controllers/authController.js";
import { sortRestaurantsByDistance, filterRestaurants, isMobile } from "../utils.js";

import { SearchBox, bindSearchFiltersEvent } from "../components/SearchBox.js";
import { openModal, ModalHeader } from "../components/Modal.js";
import { MenuCard, bindMenuCardTabs } from "../components/MenuCard.js";
import { RestaurantCard, bindRestaurantCardEvent } from "../components/RestaurantCard.js";
import { MapPanel, bindMapPanel } from "../components/MapPanel.js";

export default async function render(app) {

  // ─── Load restaurants ─────────────────────────────────────────────────────
  // Use cached data if available, otherwise fetch fresh from API.

  let restaurants = discovery.getLocalRestaurants();

  if (!restaurants) {
    app.innerHTML = `<p class="list-loading">Loading restaurants...</p>`;
    restaurants = await discovery.init();
  }

  // ─── State ────────────────────────────────────────────────────────────────

  /** The _id of the currently selected restaurant card. */
  let activeId = null;

  /**
   * Base restaurant array — always sorted by distance once location is known.
   * filterRestaurants() always reads from this array so distance order is
   * preserved even when filters are applied.
   *
   * Starts as a copy of the raw API array.
   * Replaced by sortRestaurantsByDistance() once geolocation resolves.
   *
   */
  let sortedRestaurants = [...restaurants];

  /**
   * Array of favorited restaurant _ids.
   * Pre-populated from the user's saved favouriteRestaurant on the API.
   * The API supports one favourite at a time — stored as an array to keep
   * the UI flexible for future multi-favourite support.
   */
  const favouriteId = discovery.getLocalFavourite();
  let favorites = favouriteId ? [favouriteId] : [];

  /** Whether the mobile map view is active. */
  let showMap = false;

  /**
   * Current filter state. Updated by bindSearchFiltersEvent on every change.
   */
  let filters = {
    search: "",
    city: "",
    company: "",
    favorites: false
  };

  // ─── Layout ───────────────────────────────────────────────────────────────
  // MapPanel() renders a slot container only — the actual Leaflet node is
  // injected into the correct slot by mapInstance.mountTo() after init.

  app.innerHTML = `
    <div class="discovery">
      <aside class="sidebar">
        <div id="header"></div>
        <div id="list" class="discovery-list custom-scrollbar"></div>
        <div id="map-mobile-wrap" class="discovery-map-mobile">
          ${MapPanel()}
        </div>
      </aside>
      <section class="content">
        ${MapPanel()}
      </section>
    </div>
    <div class="view-toggle">
      <button id="view-toggle-btn" class="view-toggle__btn">
        &#128506; Map
      </button>
    </div>
  `;

  const header = app.querySelector("#header");
  const list = app.querySelector("#list");
  const mapMobileWrap = app.querySelector("#map-mobile-wrap");
  const desktopContent = app.querySelector(".content");
  const toggleBtn = app.querySelector("#view-toggle-btn");

  header.innerHTML = SearchBox(restaurants);

 // ─── Toggle ───────────────────────────────────────────────────────────────

/**
 * Switches between list and map view on mobile by toggling a CSS class
 * on the discovery container. CSS handles all visibility.
 * On desktop the map always stays in .content — class has no effect.
 */
function applyToggle() {
  const discoveryEl = app.querySelector(".discovery");

  if (!isMobile()) {
    // ─── Desktop — always show list, mount map to desktop slot ───────
    showMap = false;
    discoveryEl.classList.remove("discovery--map");

    if (mapInstance) {
      mapInstance.mountTo(desktopContent.querySelector("#map-slot"));
    }
    return;
  }

  // ─── Mobile — toggle class and update button label ────────────────
  discoveryEl.classList.toggle("discovery--map", showMap);
  toggleBtn.innerHTML = showMap ? "&#128203; List" : "&#128506; Map";

  if (!mapInstance) return;

  if (showMap) {
    mapInstance.mountTo(mapMobileWrap.querySelector("#map-slot"));
  } else {
    mapInstance.mountTo(desktopContent.querySelector("#map-slot")); // ← was document.querySelector which could grab the wrong slot
  }
}

toggleBtn.addEventListener("click", () => {
  showMap = !showMap;
  applyToggle();
});

window.addEventListener("resize", applyToggle);

  // ─── Render list ──────────────────────────────────────────────────────────

  /**
   * Re-renders the restaurant list based on current filter and favorite state.
   * First item is always the nearest restaurant that passes the active filters.
   */
  function renderList() {
  const data = filterRestaurants(sortedRestaurants, filters, favorites);
  const isLoggedIn = !!auth.getToken(); // ── fresh check on every render

  list.innerHTML = data.length
    ? data.map((r, i) => RestaurantCard(
      r,
      r._id === activeId,
      favorites.includes(r._id),
      i === 0,
      isLoggedIn 
    )).join("")
    : `<p class="list-empty">No restaurants found.</p>`;
  }

  // ─── Menu modal helper ────────────────────────────────────────────────────

  /**
   * Opens the menu modal for a given restaurant id.
   * Fetches the daily menu from the API, then renders the modal.
   * Weekly menu is fetched lazily inside bindMenuCardTabs on tab click.
   */
  async function openMenuFor(id) {
    const restaurant = restaurants.find(r => r._id === id);

    // Show loading state in modal while daily menu fetches
    const overlay = openModal(
      ModalHeader(restaurant.name, restaurant.address.toUpperCase()) +
      `<p class="menu-loading">Loading menu...</p>`
    );

    try {
      // Fetch daily menu immediately
      const daily = await discovery.getDailyMenu(id);

      // Replace loading state with real menu content
      overlay.querySelector(".modal__content").innerHTML =
        ModalHeader(restaurant.name, restaurant.address.toUpperCase()) +
        MenuCard(restaurant, daily);

      // Bind tabs — weekly is fetched lazily on tab click
      bindMenuCardTabs(
        overlay,
        restaurant._id,
        daily,
        () => discovery.getWeeklyMenu(id)
      );

    } catch (err) {
      overlay.querySelector(".modal__content").innerHTML =
        ModalHeader(restaurant.name, restaurant.address.toUpperCase()) +
        `<p class="menu-empty">Failed to load menu.</p>`;
    }
  }

  // ─── Event registers ──────────────────────────────────────────────────────

  // Delegated once on the list container — no need to re-bind after re-renders.
  bindRestaurantCardEvent(list, {
    /** id - The _id of the clicked restaurant. */
    onSelect: (id) => {
      activeId = id;
      renderList();
    },

    /**
     * Toggle favourite for a restaurant.
     * API supports only one favourite at a time — selecting a new one
     * replaces the previous. If logged in, persists to API.
     * If not logged in, favourite is session-only (resets on reload).
     */
    onFavorite: async (id) => {
      if (favorites.includes(id)) {
        // ─── Remove favourite ──────────────────────
        favorites = favorites.filter(fav => fav !== id);

        // If logged in, clear favourite on API by sending empty string
        if (auth.getToken()) {
          try {
            await discovery.saveFavourite("");
          } catch (err) {
            console.error("Failed to clear favourite:", err);
          }
        }
      } else {
        // ─── Set new favourite ─────────────────────
        // API supports only one favourite — replace existing
        favorites = [id];

        // If logged in, persist to API
        if (auth.getToken()) {
          try {
            await discovery.saveFavourite(id);
          } catch (err) {
            console.error("Failed to save favourite:", err);
          }
        }
      }

      renderList();
    },

    /** id - The _id of the restaurant whose menu was requested. */
    onMenu: (id) => openMenuFor(id)
  });

  // Fires immediately with default filters — triggers the initial renderList.
  bindSearchFiltersEvent(app, (nextFilters) => {
    filters = nextFilters;
    renderList();
  });

  // ─── Map init ─────────────────────────────────────────────────────────────
  // Initialise after layout so the body-attached map node has a real size.
  // Mount immediately into the desktop slot — mobile uses it only when toggled.

  let mapInstance;

  requestAnimationFrame(() => {
    mapInstance = bindMapPanel(restaurants, {
      onMarkerClick: (id) => {
        activeId = id;
        renderList();

        // On mobile, switch back to list so the highlighted card is visible.
        if (showMap) {
          showMap = false;
          applyToggle();
        }
      },

      onMenu: (id) => openMenuFor(id),

      // ─── Re-sort base array by distance once user location is known ───
      // restaurants stays as the original API array for map markers.
      // sortedRestaurants is replaced with the distance-sorted version
      // so filterRestaurants always preserves nearest-first order.
      onLocationFound: ({ lat, lng }) => {
        console.log("User location:", lat, lng); 
        sortedRestaurants = sortRestaurantsByDistance(restaurants, lat, lng);
        console.log("Sorted order:", sortedRestaurants.map(r => r.name)); 

        // Update the map marker icons to reflect the new nearest restaurant
        if (sortedRestaurants.length > 0) {
          mapInstance.updateNearestMarker(sortedRestaurants[0]._id);
        }

        renderList();
      }
      
    });

    // Default mount: desktop slot.
    mapInstance.mountTo(desktopContent.querySelector("#map-slot"));

    // Now safe to apply the initial toggle state.
    applyToggle();
  });
}