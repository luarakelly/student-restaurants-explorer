import { router } from "./src/Router.js"; // take the singleton
import { renderNavbar } from "./src/components/shared/Navbar.js";
import { renderBottomNav } from "./src/components/shared/BottomNav.js";

/**
 * Application entry point.
 * Renders persistent UI (navbar) then starts the router.
 * Uses Single Page Application (SPA) pattern to avoid full page reloads.
 */
function App() {
  const init = () => {
    renderNavbar(document.getElementById("navbar"));
    renderBottomNav(document.getElementById("bottom-nav"));
    router.initRouter();
  };

  return { init };
}

// Start the app once the DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  App().init();
});