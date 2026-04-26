import { router } from "./src/Router.js"; // take the singleton
import { renderNavbar } from "./src/components/Navbar.js";
import { renderBottomNav } from "./src/components/BottomNav.js";
import profile from "./src/controllers/profileController.js";

/**
 * Application entry point.
 * Verifies user credentioal, renders persistent UI (navbar) then starts the router.
 * Uses Single Page Application (SPA) pattern to avoid full page reloads.
 */
function App() {
  const init = async () => {
    // Fetch user if existent
    await profile.init();

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