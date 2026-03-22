import { router } from "../Router.js"; // shared singleton — no Router() call

const bottomNavRoutes = router.routes.filter(route => route.showInNav);

/**
 * Render the mobile bottom navigation bar into a container.
 *
 * @param {HTMLElement} container - The element where the bottom nav will be rendered
 */
export const renderBottomNav = (container) => {
  /**
   * Internal render function — updates active tab based on current route
   */
  const renderNav = () => {
    const currentHash = window.location.hash.split("?")[0] || "#/";

    container.innerHTML = `
      <nav class="bottom-nav">
        ${bottomNavRoutes.map(route => `
          <a href="${route.path}" class="bottom-nav__tab ${currentHash === route.path ? "active" : ""}">
            <img src="src/assets/icons/${route.icon}.svg" width="20" height="20" alt="${route.labelKey}" />
            <span>${route.labelKey}</span>
          </a>
        `).join("")}
      </nav>
    `;
  };

  renderNav();
  router.handleSubscribe(renderNav); // subscribes to the shared router
};