export default async function render(app) {
  app.innerHTML = `
    <div class="home page page--with-bottom-nav">

      <div class="bg bg--home"></div>

      <section class="home__hero">
        <div class="home__content">
          <p class="home__eyebrow">🎓 Built for students</p>

          <h1>Find your next <span>great lunch</span></h1>

          <p class="home__subtitle">
            Discover nearby restaurants and menus instantly.
          </p>

          <input id="search" placeholder="Search..." />

          <div class="home__actions">
            <a href="#/restaurants" class="btn btn--primary">Browse</a>
            <a href="#/map" class="btn btn--ghost">Map</a>
          </div>
        </div>

        <div id="preview" class="home__preview"></div>
      </section>

    </div>
  `;
}