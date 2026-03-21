export function Router() {
  /**
  * Route definitions.
  * Each route maps a hash pattern to a page loader function.
  *
  * @type {Array<{path: string, load: Function}>}
  */
  const routes = [
    { path: "#/", load: () => import("./pages/Home.js") },
    { path: "#/restaurants", load: () => import("./pages/Restaurants.js") },
    { path: "#/map", load: () => import("./pages/Map.js") },
  ];

  /**
  * Resolve the current hash to a matching route.
  * Supports dynamic segments: #/restaurant?id=123
  *
  * @returns {object|null} Matching route or null
  */
  const resolve = () => {
    const hash = window.location.hash || "#/";
    const path = hash.split("?")[0];
    return routes.find(r => r.path === path) || null;
  };

  /**
  * Navigate to a new hash route programmatically.
  *
  * @param {string} hash - Target hash e.g. "#/restaurants"
  */
  const handleRoute = async () => {
    const app = document.getElementById("app");
    const route = resolve();
    if (!route) {
      app.innerHTML = "<p>404 — Page not found</p>";
      return;
    }

    try {
      const module = await route.load();
      await module.default(app);
    } catch (err) {
      console.error("Route load failed:", err);
      app.innerHTML = "<p>Something went wrong loading this page.</p>";
    }
  };

  /**
  * Initialise the router. Call once on app startup.
  */
  const initRouter = () => {
    window.addEventListener("hashchange", handleRoute);
    handleRoute();
  };

  return { initRouter };
}