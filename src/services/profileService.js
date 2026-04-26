/**
 * Profile API service — handles ONLY HTTP requests
 */

const API_URL = "https://media2.edu.metropolia.fi/restaurant/api/v1";

// ─────────────────────────────────────────────
// GET CURRENT USER
// ─────────────────────────────────────────────
export async function fetchCurrentUserRequest(token) {
  const res = await fetch(`${API_URL}/users/token`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const data = await res.json();
  console.log("FETCH CURRENT USER RESPONSE:", data);

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch user");
  }

  return data;
}