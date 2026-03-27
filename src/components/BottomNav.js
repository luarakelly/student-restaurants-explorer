import { router } from "../Router.js";

/** Routes that should appear in the bottom navigation bar. */
const bottomNavRoutes = router.routes.filter(route => route.showInNav);

/**
 * Renders the mobile bottom navigation bar into a container element.
 * Re-renders automatically when the route changes to update the active state.
 *
 * @param {HTMLElement} container - The element to render the bottom nav into.
 */
export const renderBottomNav = (container) => {
  /**
   * Builds and injects the nav HTML based on the current route.
   */
  const renderNav = () => {
    const currentHash = window.location.hash.split("?")[0] || "#/";

    container.innerHTML = `
      <nav class="bottom-nav">
        ${bottomNavRoutes.map(route => {
          const isActive = currentHash === route.path;

          return `
            <a 
              href="${route.path}" 
              class="nav__item nav__item--mobile ${isActive ? "is-active" : ""}"
            >
              <img src="src/assets/icons/${route.icon}.svg" width="20" height="20" alt="${route.labelKey}" />
              <span class="nav__label">${route.labelKey}</span>
            </a>
          `;
        }).join("")}
      </nav>
    `;
  };

  renderNav();
  router.handleSubscribe(renderNav);
};