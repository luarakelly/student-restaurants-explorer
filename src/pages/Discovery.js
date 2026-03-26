import { restaurantsData } from "./mockupData/restaurantsData.js";
import { SearchBar } from "../components/SearchBar.js";

export default function render(app) {
  const restaurants = restaurantsData;

  // 1. Render skeleton
  app.innerHTML = `
    <div class="discovery">
      <aside class="sidebar">
        <div id="header"></div>
        <div id="list"></div>
      </aside>
      <section class="content">
        <div id="map"></div>
      </section>
    </div>
  `;

  // 2. Query DOM
  const header = app.querySelector("#header");

  // 3. Inject component
  header.innerHTML = SearchBar(restaurants);
}