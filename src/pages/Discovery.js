/**
 * Discovery page — owns all state for the restaurant list,
 * search filters, and map. Composes SearchBox, RestaurantCard, MapPanel,
 * MenuCard and Modal components and wires them together.
 */

import discovery from "../controllers/discoveryController.js";

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
  /** Set of favorited restaurant _ids. */
  let favorites = [];
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
  function isMobile() {
    return window.innerWidth < 650;
  }

  /**
   * Switches between list and map view on mobile by moving the single map
   * instance between the mobile and desktop slots.
   * 
   * TODO use CSS for styles
   */
  function applyToggle() {
    if (!isMobile()) {
      showMap = false;

      list.style.display = "";
      mapMobileWrap.style.display = "none";
      toggleBtn.style.display = "none";

      if (mapInstance) {
        mapInstance.mountTo(desktopContent.querySelector("#map-slot"));
      }

      return;
    }

    // Mobile behavior TODO: Move to CSS file
    toggleBtn.style.display = "block";

    list.style.display = showMap ? "none" : "";
    mapMobileWrap.style.display = showMap ? "flex" : "none";
    toggleBtn.innerHTML = showMap ? "&#128203; List" : "&#128506; Map";

    if (!mapInstance) return;

    if (showMap) {
      mapInstance.mountTo(mapMobileWrap.querySelector("#map-slot"));
    } else {
      mapInstance.mountTo(document.querySelector("#map-slot"));
    }
  }

  toggleBtn.addEventListener("click", () => {
    showMap = !showMap;
    applyToggle();
  });

  window.addEventListener("resize", applyToggle);

  // ─── Filtering ────────────────────────────────────────────────────────────

  /**
   * Returns a filtered copy of the restaurants array based on current filter state.
   * Pure — reads filters and favorites but does not mutate them.
   */
  function filterRestaurants() {
    let res = [...restaurants];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      res = res.filter(r => r.name.toLowerCase().includes(q));
    }

    if (filters.city) {
      res = res.filter(r => r.city === filters.city);
    }

    if (filters.company) {
      res = res.filter(r => r.company === filters.company);
    }

    if (filters.favorites) {
      res = res.filter(r => favorites.has(r._id));
    }

    return res;
  }

  // ─── Render list ──────────────────────────────────────────────────────────

  /**
   * Re-renders the restaurant list based on current filter and favorite state.
   * The first card in the filtered result always receives the "NEAREST" tag —
   * TODO: implement distance sorting (from closest to furthers) for restaurants list.
   */
  function renderList() {
    const data = filterRestaurants();

    list.innerHTML = data.length
      ? data.map((r, i) => RestaurantCard(r, r._id === activeId, favorites.has(r._id), i === 0)).join("")
      : `<p class="list-empty">No restaurants found.</p>`;
  }

  // ─── Menu modal helper ────────────────────────────────────────────────────

  /**
   * Opens the menu modal for a given restaurant id.
   * Fetches the daily menu from the API, then renders the modal.
   * Weekly menu is fetched lazily inside bindMenuCardTabs on tab click.
   * Shared by both the list card and the map popup.
   *
   * id - The restaurant _id.
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
        () => discovery.getWeeklyMenu(id) // passed as a function, called only when weekly tab is clicked
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

    /** id - The _id of the restaurant to toggle. */
    onFavorite: (id) => {
      favorites.has(id) ? favorites.delete(id) : favorites.add(id);
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
      onMenu: (id) => openMenuFor(id)
    });

    // Default mount: TODO verify screen size to define mount.
    mapInstance.mountTo(desktopContent.querySelector("#map-slot"));

    // Now safe to apply the initial toggle state.
    applyToggle();
  });
}