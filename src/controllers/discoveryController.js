/**
 * Discovery controller responsibilities:
 * - Fetch and cache restaurants
 * - Fetch daily and weekly menus per restaurant
 * - Sync restaurants to localStorage
 */

import {
  fetchRestaurantsRequest,
  fetchRestaurantRequest,
  fetchDailyMenuRequest,
  fetchWeeklyMenuRequest
} from "../services/discoveryService.js";

const RESTAURANTS_KEY = "restaurants";

function discoveryController() {

  // ─────────────────────────────────────────────
  // GET CACHED RESTAURANTS
  // ─────────────────────────────────────────────
  function getLocalRestaurants() {
    const raw = localStorage.getItem(RESTAURANTS_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  // ─────────────────────────────────────────────
  // INIT / FETCH ALL RESTAURANTS
  // ─────────────────────────────────────────────
  async function init() {
    const data = await fetchRestaurantsRequest();

    // API returns { restaurants: [...] }
    const restaurants = data.restaurants ?? data;

    localStorage.setItem(RESTAURANTS_KEY, JSON.stringify(restaurants));

    return restaurants;
  }

  // ─────────────────────────────────────────────
  // GET SINGLE RESTAURANT
  // ─────────────────────────────────────────────
  async function getRestaurant(id) {
    return await fetchRestaurantRequest(id);
  }

  // ─────────────────────────────────────────────
  // GET DAILY MENU
  // ─────────────────────────────────────────────
  async function getDailyMenu(id, lang = "en") {
    return await fetchDailyMenuRequest(id, lang);
  }

  // ─────────────────────────────────────────────
  // GET WEEKLY MENU
  // ─────────────────────────────────────────────
  async function getWeeklyMenu(id, lang = "en") {
    return await fetchWeeklyMenuRequest(id, lang);
  }

  return {
    init,
    getRestaurant,
    getDailyMenu,
    getWeeklyMenu,
    getLocalRestaurants
  };
}

const discovery = discoveryController();
export default discovery;