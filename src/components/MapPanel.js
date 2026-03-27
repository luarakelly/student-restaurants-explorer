/**
 * @fileoverview MapPanel component. Renders the Leaflet map and markers
 * for a list of restaurants. Receives all data as parameters.
 *
 * Uses a single persistent map instance that is physically moved between
 * the desktop and mobile containers via mountTo(), rather than creating
 * two separate map instances.
 */

/**
 * Renders a map slot container HTML.
 * The actual Leaflet map node is injected into this slot by mountTo().
 *
 * @returns {string} HTML string for the map slot.
 */
export function MapPanel() {
  return `
    <div class="map-panel">
      <div id="map-slot" class="map-panel__map"></div>
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
 * Initialises a single Leaflet map instance and returns a mountTo() function
 * that physically moves the map DOM node between containers.
 *
 * Moving a DOM node does not destroy it — markers, zoom level, and open
 * popups all survive. invalidateSize() corrects tile rendering after each move.
 *
 * @param {object[]} restaurants                               - Array of restaurant objects.
 * @param {object}   handlers                                  - Event handler callbacks.
 * @param {function(id: string): void} handlers.onMarkerClick  - Called with restaurant _id when a marker is clicked.
 * @param {function(id: string): void} handlers.onMenu         - Called when "View Menu" is clicked in a popup.
 * @returns {{ mountTo: function(HTMLElement): void }} Object with mountTo method.
 */
export function bindMapPanel(restaurants, { onMarkerClick, onMenu }) {
  // Create the map node independently — not tied to any layout slot yet.
  const mapEl = document.createElement("div");
  mapEl.style.width = "100%";
  mapEl.style.height = "100%";

  // Temporarily attach to body so Leaflet can measure a real size.
  document.body.appendChild(mapEl);

  const map = L.map(mapEl);

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

  // Delegated listener on the map node — survives container moves.
  mapEl.addEventListener("click", (e) => {
    const btn = e.target.closest(".map-popup__menu");
    if (btn) onMenu?.(btn.dataset.id);
  });

  return {
    /**
     * Moves the map DOM node into a new parent container and tells
     * Leaflet to remeasure its size.
     *
     * @param {HTMLElement} container - The element to move the map into.
     */
    mountTo(container) {
      container.appendChild(mapEl);
      map.invalidateSize();

      const group = L.featureGroup(markers);
      if (markers.length > 1) {
        map.fitBounds(group.getBounds().pad(0.2));
      } else if (markers.length === 1) {
        map.setView(group.getBounds().getCenter(), 15);
      }
    }
  };
}