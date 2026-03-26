import { router } from "../Router.js";

const bottomNavRoutes = router.routes.filter(route => route.showInNav);

export const renderBottomNav = (container) => {
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