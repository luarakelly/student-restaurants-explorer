export default async function render(app) {
  app.innerHTML = `
    <div class="home page page--with-bottom-nav">

      <div class="bg bg--home"></div>

      <section class="home__hero">
        <div class="home__content">
          <p class="home__eyebrow">&#127891; Built for students</p>

          <h1>Find your next <span>great lunch</span></h1>

          <p class="home__subtitle">
            Discover nearby restaurants and menus instantly.
          </p>

          <div class="home__actions">
            <a href="#/Discovery" class="btn btn--primary">Browse</a>
            <a href="#/login" class="btn btn--ghost">Login</a>
          </div>
        </div>

        <div id="preview" class="home__preview"></div>
      </section>

    </div>
  `;
}