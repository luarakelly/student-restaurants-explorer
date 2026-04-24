/**
 * Auth API service — handles ONLY HTTP requests
 */

const API_URL = "https://media2.edu.metropolia.fi/restaurant/api/v1";

// ─────────────────────────────────────────────
// REGISTER
// ─────────────────────────────────────────────
export async function registerRequest({ username, email, password }) {
  const res = await fetch(`${API_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password })
  });

  const data = await res.json();
  console.log("REGISTER RESPONSE:", data);

  if (!res.ok) {
    throw new Error(data.message || "Registration failed");
  }

  return data;
}