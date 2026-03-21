import { router } from "../../Router.js"; // shared singleton

const navRoutes = router.routes.filter(route => route.showInNav);

/**
 * Render the desktop navigation bar into a container.
 *
 * @param {HTMLElement} container - The element where the navbar will be rendered
 */
export const renderNavbar = (container) => {
  /**
   * Internal render function — sets the active tab based on current route
   */
  const renderNav = () => {
    const currentHash = window.location.hash.split("?")[0] || "#/";

    container.innerHTML = `
      <nav class="navbar">
        <a class="navbar__logo" href="#/">
          <img src="src/assets/icons/logo.svg" width="85" height="85" alt="Student Restaurant Explorer" />
        </a>
        <ul class="navbar__links">
          ${navRoutes.map(route => `
            <li>
              <a href="${route.path}" class="${currentHash === route.path ? "active" : ""}">
                <img src="src/assets/icons/${route.icon}.svg" width="20" height="20" alt="" aria-hidden="true" />
                <span>${route.labelKey}</span>
              </a>
            </li>
          `).join("")}
        </ul>
      </nav>
    `;
  };

  renderNav();
  router.handleSubscribe(renderNav); // subscribes to the shared router
};