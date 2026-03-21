# 🍽️ Student Restaurant Explorer

> A lightweight web app for discovering student restaurants, browsing daily and weekly menus, and finding the nearest lunch spot — with ease.

Built with a modular vanilla JavaScript architecture, focusing on **performance**, **simplicity**, and a clean user experience across desktop and mobile.

---

## ✨ Overview

**Student Restaurant Explorer** helps users quickly find what to eat and where. Whether you're checking today's menu, exploring options on a map, or saving your favorite spots — the app brings everything into one place.

Users can browse **anonymously** or **create an account** for a more personalized experience.

---

## 🚀 Features

### 👤 For All Users

- 🏬 Browse student restaurants
- 📋 View daily and weekly menus
- 🗺️ Explore restaurants on an interactive map
- 🔍 Filter restaurants by city, provider, and more
- ℹ️ View detailed restaurant information

### 🔐 For Registered Users

- ⭐ Save favorite restaurants
- 👤 Manage personal profile and preferences
- 🖼️ Upload and update profile picture
- 🧭 Get routes to restaurants via map navigation
- 📍 Automatically detect and highlight the nearest restaurant

---

## 🏗️ Architecture

The app follows a **modular, component-based structure** using vanilla JavaScript:

```
src/
├── pages/          # Route-based views (Home, Restaurants, Map, Login, Profile)
├── components/     # Reusable UI elements (cards, navbar, map pins, etc.)
├── services/       # API handling (auth, restaurants, user, routing)
├── utils/          # Shared helpers (storage, geolocation)
└── styles/         # Organized CSS by component and page
```

---

## 🧠 Core Concepts

| Concept | Description |
|--------|-------------|
| **Client-side routing** | Navigation without full page reloads |
| **Separation of concerns** | Clean split between views, services, and utilities |
| **Local storage** | Persistent preferences and session handling |
| **Geolocation** | Nearest restaurant detection based on user position |
| **Reusable components** | Clean and modular UI building blocks |

---

## 🎯 Use Case

Designed primarily for **students** who want a fast and simple way to:

- 🍜 Decide where to eat
- 📱 Check menus on the go
- 🗺️ Navigate to nearby restaurants

---

## 🛠️ Tech Stack

- **Vanilla JavaScript** — no framework dependencies
- **HTML5 / CSS3** — semantic markup and modular styles
- **Browser Geolocation API** — location-aware features
- **Map Integration** — interactive restaurant exploration
- **LocalStorage** — lightweight client-side persistence

---

## 📦 Getting Started

```bash
# Clone the repository
git clone https://github.com/luarakelly/student-restaurant-explorer.git

# Navigate into the project
cd student-restaurant-explorer

# Open in your browser (no build step required)
open index.html
```

> No build tools or package managers required — just open and go.

---

<p align="center">Made for hungry students everywhere</p>