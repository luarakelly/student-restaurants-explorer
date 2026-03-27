/**
 * @fileoverview MapPanel component. Renders the Leaflet map and markers
 * for a list of restaurants. Receives all data as parameters.
 */

/**
 * Renders the map container HTML.
 * Legend and map div are siblings so Leaflet does not interfere with the legend.
 *
 * @returns {string} HTML string for the map container.
 */
export function MapPanel() {
  return `
    <div class="map-panel">
      <div id="map" class="map-panel__map"></div>
      <div class="map-legend">
        <div class="legend-item">
          <div class="legend-dot legend-dot--nearest"></div>
          Nearest choice
        </div>
        <div class="legend-item">
          <div class="legend-dot legend-dot--available"></div>
          Available restaurants
        </div>
      </div>
    </div>
  `;
}

/**
 * Initialises the Leaflet map and places a marker for each restaurant.
 * Must be called after MapPanel() HTML is in the DOM.
 *
 * @param {object[]} restaurants                              - Array of restaurant objects.
 * @param {object}   handlers                                 - Event handler callbacks.
 * @param {function(id: string): void} handlers.onMarkerClick - Called with the restaurant _id when a marker is clicked.
 * @param {function(id: string): void} handlers.onMenu        - Called when "View Menu" is clicked in a popup.
 */
export function bindMapPanel(restaurants, { onMarkerClick, onMenu }) {
  const map = L.map("map");

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);

  const nearestIcon = L.divIcon({
    html: `<div class="map-marker map-marker--nearest"></div>`,
    className: "",
    iconAnchor: [8, 8]
  });

  const availableIcon = L.divIcon({
    html: `<div class="map-marker map-marker--available"></div>`,
    className: "",
    iconAnchor: [8, 8]
  });

  const markers = [];

  restaurants.forEach((r, i) => {
    const [lng, lat] = r.location.coordinates;
    const mapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;

    const marker = L.marker([lat, lng], { icon: i === 0 ? nearestIcon : availableIcon })
      .addTo(map)
      .bindPopup(`
        <div class="map-popup">
          <div class="map-popup__name">${r.name}</div>
          <div class="map-popup__address">${r.address}, ${r.city}</div>
          <div class="map-popup__actions">
            <button class="btn btn--primary map-popup__menu" data-id="${r._id}">
              &#127869; View Menu
            </button>
            <a class="btn btn--secondary map-popup__route" href="${mapsUrl}" target="_blank" rel="noopener noreferrer">
              &#10148;
            </a>
          </div>
        </div>
      `)
      .on("click", () => onMarkerClick(r._id));

    markers.push(marker);
  });

  // Bind popup menu button via event delegation on the map container.
  // Popup buttons are injected into the DOM dynamically by Leaflet
  // Listen on the map container popup events.
  document.getElementById("map").addEventListener("click", (e) => {
    const btn = e.target.closest(".map-popup__menu");
    if (btn) onMenu?.(btn.dataset.id);
  });

  const group = L.featureGroup(markers);
  map.fitBounds(group.getBounds().pad(0.2));
}