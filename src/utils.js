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