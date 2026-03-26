export function SearchBox(restaurants) {
  const cities = [...new Set(restaurants.map(r => r.city))];
  const companies = [...new Set(restaurants.map(r => r.company))];

  return `
    <div class="discovery-header">

      <div class="search-row">
        <div class="search-box">
          <span class="search-box__icon">&#128269;</span>
          <input
            id="search"
            placeholder="Search Restaurants..."
          />
          <datalist id="suggestions">
            ${restaurants.map(r => `<option value="${r.name}">`).join("")}
          </datalist>
        </div>
      </div>

      <div class="filters">
        <button class="filter-chip active" id="filter-all">All</button>

        <select id="city-filter">
          <option value="">City </option>
          ${cities.map(c => `<option value="${c}">${c}</option>`).join("")}
        </select>

        <select id="company-filter">
          <option value="">Company </option>
          ${companies.map(c => `<option value="${c}">${c}</option>`).join("")}
        </select>

        <button class="filter-favorites" id="filter-fav">
          &#10084; Favorites
        </button>
      </div>

    </div>
  `;
}

export function bindSearchFiltersEvent(app, onChange) {
  const searchEl = app.querySelector("#search");
  const cityEl = app.querySelector("#city-filter");
  const companyEl = app.querySelector("#company-filter");
  const favBtn = app.querySelector("#filter-fav");
  const allBtn = app.querySelector("#filter-all");

  let showFavorites = false;

  function emit() {
    onChange({
      search: searchEl.value.trim(),
      city: cityEl.value,
      company: companyEl.value,
      favorites: showFavorites
    });
  }

  // Input events
  searchEl.addEventListener("input", emit);
  cityEl.addEventListener("change", emit);
  companyEl.addEventListener("change", emit);

  // Favorites toggle
  favBtn.addEventListener("click", () => {
    showFavorites = !showFavorites;
    favBtn.classList.toggle("active");
    emit();
  });

  // Reset (All)
  allBtn.addEventListener("click", () => {
    searchEl.value = "";
    cityEl.value = "";
    companyEl.value = "";
    showFavorites = false;

    favBtn.classList.remove("active");

    emit();
  });

  // Initial emit
  emit();
}