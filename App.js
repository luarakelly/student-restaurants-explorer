import { Router } from "./src/Router.js";
import { renderNavbar } from "./src/components/shared/Navbar.js";
 
/**
 * Application entry point.
 * Renders persistent UI (navbar) then starts the router.
 * Use Single Page Application (SPA) pattern to avoid full page reloads.
 */
function App() {
  const router = Router();

  const init = () => {
    renderNavbar(document.getElementById("navbar"));
    router.initRouter();
  };

  return { init };
};

// Start the app once the DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  App().init();
});