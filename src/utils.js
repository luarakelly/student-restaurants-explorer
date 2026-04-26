/**
 * Utility functions — shared helpers used across the app.
 */

// ─────────────────────────────────────────────
// HAVERSINE DISTANCE
// ─────────────────────────────────────────────

/**
 * Calculates the distance in km between two lat/lng points
 * using the Haversine formula.
 *
 * lat1 - Latitude of point 1.
 * lng1 - Longitude of point 1.
 * lat2 - Latitude of point 2.
 * lng2 - Longitude of point 2.
 * return distance in kilometres.
 */
export function haversineDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ─────────────────────────────────────────────
// SORT RESTAURANTS BY DISTANCE
// ─────────────────────────────────────────────

/**
 * Returns a new array of restaurants sorted by distance from a given point.
 * Does not mutate the original array.
 *
 * restaurants - Array of restaurant objects.
 * lat         - User latitude.
 * lng         - User longitude.
 * returns sorted array of restaurants, nearest first.
 */
export function sortRestaurantsByDistance(restaurants, lat, lng) {
  return [...restaurants].sort((a, b) => {
    const [aLng, aLat] = a.location.coordinates;
    const [bLng, bLat] = b.location.coordinates;
    return (
      haversineDistance(lat, lng, aLat, aLng) -
      haversineDistance(lat, lng, bLat, bLng)
    );
  });
}

// ─────────────────────────────────────────────
// isMobile
// ─────────────────────────────────────────────
/**
 * Returns true if the viewport width is below the mobile breakpoint.
 */
export function isMobile(breakpoint = 650) {
  return window.innerWidth < breakpoint;
}

// ─────────────────────────────────────────────
// FILTERING
// ─────────────────────────────────────────────
/**
 * Returns a filtered copy of a restaurant array based on the given filter state.
 * Preserves the input array order — sorting is the caller's responsibility.
 * Pure — does not mutate the input array.
 */
export function filterRestaurants(restaurants, filters, favorites) {
  let res = [...restaurants];

  if (filters.search) {
    const q = filters.search.toLowerCase();
    res = res.filter(r => r.name.toLowerCase().includes(q));
  }

  if (filters.city) {
    res = res.filter(r => r.city === filters.city);
  }

  if (filters.company) {
    res = res.filter(r => r.company === filters.company);
  }

  if (filters.favorites) {
    res = res.filter(r => favorites.includes(r._id));
  }

  return res;
}