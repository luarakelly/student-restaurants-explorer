import { router } from "../Router.js";

const navRoutes = router.routes.filter(route => route.showInNav);

export const renderNavbar = (container) => {
  const renderNav = () => {
    const currentHash = window.location.hash.split("?")[0] || "#/";

    container.innerHTML = `
      <nav class="navbar">

        <a class="navbar__brand" href="#/">
          Student Restaurant Explorer
        </a>

        <div class="navbar__nav">
          ${navRoutes.map(route => {
            const isActive = currentHash === route.path;

            return `
              <a 
                href="${route.path}" 
                class="nav__item nav__item--desktop ${isActive ? "is-active" : ""}"
              >
                <img src="src/assets/icons/${route.icon}.svg" width="18" height="18" alt="" />
                <span class="nav__label">${route.labelKey}</span>
              </a>
            `;
          }).join("")}
        </div>

      </nav>
    `;
  };

  renderNav();
  router.handleSubscribe(renderNav);
};