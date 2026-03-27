/**
 * @fileoverview MenuCard component. Renders the daily/weekly menu content
 * and external maps link in footer. Receives all data as parameters.
 */

/**
 * Renders diet badge pills from a comma-separated diets string.
 *
 * @param {string} dietsStr - Comma-separated diet codes e.g. "G, M, L".
 * @returns {string} HTML string of badge spans.
 */
function DietBadges(dietsStr = "") {
  return dietsStr.split(",")
    .map(d => d.trim())
    .filter(Boolean)
    .map(d => `<span class="diet-badge diet-badge--${d}">${d}</span>`)
    .join("");
}

/**
 * Renders a single menu item card.
 *
 * @param {object}  course               - A course object from the menu data.
 * @param {string}  course.name          - Course name.
 * @param {string}  [course.diets]       - Comma-separated diet codes.
 * @param {object}  [course.price]      - "price": "3,10 € / 7,20 € / 10,05 €", single price string.
 * @returns {string} HTML string for the menu item card.
 */
function MenuItemCard(course) {
  const priceHTML = 
    `<div class="price-group">
        <span class="price-group__label">Price</span>
        <span class="price-group__value">${course.price ?? ""}</span>
    </div>`;

  return `
    <div class="menu-item-card">
      <div class="menu-item-card__emoji">&#127869;</div>
      <div class="menu-item-card__body">
        <div class="menu-item-card__name">${course.name}</div>
        <div class="menu-item-card__prices">${priceHTML}</div>
      </div>
      <div class="menu-item-card__badges">${DietBadges(course.diets)}</div>
    </div>
  `;
}

/**
 * Renders all courses for today's menu.
 *
 * @param {object}   daily         - The daily menu data object.
 * @param {object[]} daily.courses - Array of course objects.
 * @returns {string} HTML string of daily menu item cards.
 */
function renderDaily(daily) {
  return daily.courses.map(c => MenuItemCard(c)).join("");
}

/**
 * Renders the full weekly menu grouped by day.
 *
 * @param {object}   weekly      - The weekly menu data object.
 * @param {object[]} weekly.days - Array of day objects.
 * @returns {string} HTML string of day sections with menu item cards.
 */
function renderWeekly(weekly) {
  return weekly.days.map(day => `
    <div class="menu-day">
      <div class="menu-day__title">${day.date}</div>
      ${day.courses.map(c => MenuItemCard(c)).join("")}
    </div>
  `).join("");
}

/**
 * Renders the full MenuCard HTML — tabs, scrollable item list, and footer.
 * Pass the return value directly into openModal().
 *
 * @param {object}   restaurant                    - The restaurant object.
 * @param {string}   restaurant._id                - Unique identifier.
 * @param {object}   restaurant.location           - Geo location object.
 * @param {number[]} restaurant.location.coordinates - [longitude, latitude].
 * @param {object}   daily                         - Daily menu data.
 * @returns {string} HTML string for the full menu card content.
 */
export function MenuCard(restaurant, daily) {
  const [lng, lat] = restaurant.location.coordinates;
  const mapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;

  return `
    <div class="menu-modal__tabs">
      <div class="menu-tabs-pill">
        <button class="menu-tab active" data-view="daily">Daily Menu</button>
        <button class="menu-tab" data-view="weekly">Weekly View</button>
      </div>
    </div>

    <div id="menu-body-${restaurant._id}" class="menu-modal__body custom-scrollbar">
      ${renderDaily(daily)}
    </div>

    <div class="menu-modal__footer">
      <a class="btn btn--outline-teal" href="${mapsUrl}" target="_blank" rel="noopener noreferrer">
        &#128506; Get Route
      </a>
    </div>
  `;
}

/**
 * Binds the Daily/Weekly tab toggle inside an already-open modal overlay.
 * Must be called after openModal() returns the overlay element.
 *
 * @param {HTMLElement} overlay      - The modal overlay element returned by openModal().
 * @param {string}      restaurantId - The restaurant _id used to scope the body element.
 * @param {object}      daily        - Daily menu data passed down from the page.
 * @param {object}      weekly       - Weekly menu data passed down from the page.
 */
export function bindMenuCardTabs(overlay, restaurantId, daily, weekly) {
  const tabs = overlay.querySelectorAll(".menu-tab");
  const body = overlay.querySelector(`#menu-body-${restaurantId}`);

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      body.innerHTML = tab.dataset.view === "daily"
        ? renderDaily(daily)
        : renderWeekly(weekly);
    });
  });
}