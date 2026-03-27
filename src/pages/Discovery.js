/**
 * @fileoverview Discovery page — owns all state for the restaurant list,
 * search filters, and (future) map. Composes SearchBox and RestaurantCard
 * components and wires them together.
 */

import { restaurantsData } from "./mockupData/restaurantsData.js";
import { dailyMenuData } from "./mockupData/dailyMenuData.js";
import { weeklyMenusData } from "./mockupData/weeklyMenuData.js";

import { SearchBox, bindSearchFiltersEvent } from "../components/SearchBox.js";
import { openModal, ModalHeader } from "../components/Modal.js";
import { MenuCard, bindMenuCardTabs } from "../components/MenuCard.js";
import { RestaurantCard, bindRestaurantCardEvent } from "../components/RestaurantCard.js";
import { MapPanel, bindMapPanel } from "../components/MapPanel.js";

/**
 * Renders the Discovery page into the app root element.
 *
 * @param {HTMLElement} app - The root element to render the page into.
 */
export default function render(app) {
  const restaurants = restaurantsData;

  // ─── State ────────────────────────────────────────────────────────────────

  /** @type {string|null} The _id of the currently selected restaurant card. */
  let activeId = null;

  /** @type {Set<string>} Set of favorited restaurant _ids. */
  let favorites = new Set();

  /**
   * Current filter state. Updated by bindSearchFiltersEvent on every change.
   *
   * @type {{ search: string, city: string, company: string, favorites: boolean }}
   */
  let filters = {
    search: "",
    city: "",
    company: "",
    favorites: false
  };

  // ─── Layout ───────────────────────────────────────────────────────────────

  app.innerHTML = `
    <div class="discovery">
      <aside class="sidebar">
        <div id="header"></div>
        <div id="list" class="discovery-list custom-scrollbar"></div>
      </aside>
      <section class="content">
        ${MapPanel()}
      </section>
    </div>
  `;

  const header = app.querySelector("#header");
  const list = app.querySelector("#list");

  header.innerHTML = SearchBox(restaurants);

  // ─── Filtering ────────────────────────────────────────────────────────────

  /**
   * Returns a filtered copy of the restaurants array based on current filter state.
   * Pure — reads filters and favorites but does not mutate them.
   *
   * @returns {Array<object>} Filtered list of restaurant objects.
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

  // ─── Render ───────────────────────────────────────────────────────────────

  /**
   * Re-renders the restaurant list based on current filter and favorite state.
   * The first card in the filtered result always receives the "NEAREST" tag —
   * distance sorting will be implemented later.
   */
  function renderList() {
    const data = filterRestaurants();

    list.innerHTML = data.length
      ? data.map((r, i) => RestaurantCard(r, r._id === activeId, favorites.has(r._id), i === 0)).join("")
      : `<p class="list-empty">No restaurants found.</p>`;
  }

  // ─── Event registers ──────────────────────────────────────────────────────

  // Delegated once on the list container — no need to re-bind after re-renders.
  bindRestaurantCardEvent(list, {
    /** @param {string} id - The _id of the clicked restaurant. */
    onSelect: (id) => {
      activeId = id;
      renderList();
    },

    /** @param {string} id - The _id of the restaurant to toggle. */
    onFavorite: (id) => {
      favorites.has(id) ? favorites.delete(id) : favorites.add(id);
      renderList();
    },

    /** @param {string} id - The _id of the restaurant whose menu was requested. */
    onMenu: (id) => {
      const restaurant = restaurants.find(r => r._id === id);

      const overlay = openModal(
        ModalHeader(restaurant.name, restaurant.address.toUpperCase()) +
        MenuCard(restaurant, dailyMenuData, weeklyMenusData)
      );

      bindMenuCardTabs(overlay, restaurant._id, dailyMenuData, weeklyMenusData);
    }
  });

  // Fires immediately with default filters - triggers the initial renderList.
  bindSearchFiltersEvent(app, (nextFilters) => {
    filters = nextFilters;
    renderList();
  });

  // after layout, bind the map — passes same index=0 nearest logic
  requestAnimationFrame(() => {
    bindMapPanel(restaurants, {
      onMarkerClick: (id) => {
        activeId = id;
        renderList();
      },
      onMenu: (id) => {
        const restaurant = restaurants.find(r => r._id === id);
        const overlay = openModal(
          ModalHeader(restaurant.name, restaurant.address.toUpperCase()) +
          MenuCard(restaurant, dailyMenuData, weeklyMenusData)
        );
        bindMenuCardTabs(overlay, restaurant._id, dailyMenuData, weeklyMenusData);
      }
    });
  });
}