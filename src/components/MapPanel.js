/**
 * MapPanel component. Renders the Leaflet map and markers
 * for a list of restaurants. Receives all data as parameters.
 *
 * Uses a single persistent map instance that is physically moved between
 * the desktop and mobile containers via mountTo(), rather than creating
 * two separate map instances.
 */

import { getUserPosition } from "../services/geolocationService.js";

// ─────────────────────────────────────────────
// MAP PANEL HTML
// ─────────────────────────────────────────────

/**
 * Renders a map slot container HTML.
 * The actual Leaflet map node is injected into this slot by mountTo().
 */
export function MapPanel() {
  return `
    <div class="map-panel">
      <div id="map-slot" class="map-panel__map"></div>
      <div class="map-legend">
        <div class="legend-item">
          <div class="legend-dot legend-dot--user"></div>
          Your location
        </div>
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

// ─────────────────────────────────────────────
// BIND MAP PANEL
// ─────────────────────────────────────────────

/**
 * Initialises a single Leaflet map instance and returns a mountTo() function
 * that physically moves the map DOM node between containers.
 *
 * Moving a DOM node does not destroy it — markers, zoom level, and open
 * popups all survive. invalidateSize() corrects tile rendering after each move.
 *
 * restaurants              - Array of restaurant objects.
 * handlers                 - Event handler callbacks.
 * handlers.onMarkerClick   - Called with restaurant _id when a marker is clicked.
 * handlers.onMenu          - Called when "View Menu" is clicked in a popup.
 * handlers.onLocationFound - Called with { lat, lng } once user location is known.
 */
export function bindMapPanel(restaurants, { onMarkerClick, onMenu, onLocationFound }) {

  // ─── Create map node ──────────────────────────────────────────────────────
  // Created independently — not tied to any layout slot yet.
  // Temporarily attached to body so Leaflet can measure a real size.

  const mapEl = document.createElement("div");
  mapEl.style.width = "100%";
  mapEl.style.height = "100%";
  document.body.appendChild(mapEl);

  const map = L.map(mapEl);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);

  // ─── Icons ────────────────────────────────────────────────────────────────

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

  const userIcon = L.divIcon({
    html: `<div class="map-marker map-marker--user"></div>`,
    className: "",
    iconAnchor: [8, 8]
  });

// ─── Restaurant markers ───────────────────────────────────────────────────
  // Store markers in a Map keyed by restaurant _id so we can update
  // individual marker icons later when the nearest changes.

  const markers = [];
  const markerMap = new Map(); // _id → Leaflet marker

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
    markerMap.set(r._id, marker); // ← store reference by id
  });

  // ─── Delegated popup menu listener ───────────────────────────────────────

  mapEl.addEventListener("click", (e) => {
    const btn = e.target.closest(".map-popup__menu");
    if (btn) onMenu?.(btn.dataset.id);
  });

  // ─── User location ────────────────────────────────────────────────────────

  getUserPosition()
    .then(({ lat, lng }) => {
      L.marker([lat, lng], { icon: userIcon })
        .addTo(map)
        .bindPopup(`
          <div class="map-popup">
            <div class="map-popup__name">&#128100; Your Location</div>
            <div class="map-popup__address">You are here</div>
          </div>
        `)
        .openPopup();

      onLocationFound?.({ lat, lng });
    })
    .catch((err) => {
      console.warn("Could not get user location:", err.message);
    });

  // ─── mountTo ──────────────────────────────────────────────────────────────

  return {
    mountTo(container) {
      container.appendChild(mapEl);
      map.invalidateSize();

      const group = L.featureGroup(markers);
      if (markers.length > 1) {
        map.fitBounds(group.getBounds().pad(0.2));
      } else if (markers.length === 1) {
        map.setView(group.getBounds().getCenter(), 15);
      }
    },

    /**
     * Updates marker icons so the nearest restaurant gets the orange pin
     * and all others get the teal pin.
     * Called by Discovery.js after sortedRestaurants is re-sorted.
     *
     * nearestId - The _id of the nearest restaurant.
     */
    updateNearestMarker(nearestId) {
      markerMap.forEach((marker, id) => {
        marker.setIcon(id === nearestId ? nearestIcon : availableIcon);
      });
    }
  };
}