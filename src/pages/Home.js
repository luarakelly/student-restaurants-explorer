/**
 * Home page — landing page for the Student Restaurant Explorer.
 */

import Login from "../components/Login.js";

/**
 * Renders the Home landing page into the app root element.
 * app - The root element to render the page into.
 */
export default function render(app) {
  app.innerHTML = `
    <div class="home">

      <!-- ═══ HERO ═══ -->
      <section class="hero">
        <div class="hero__grain"></div>

        <div class="hero__content">
          <div class="hero__eyebrow">
            <span class="hero__dot"></span>
            Student Restaurant Explorer
          </div>

          <h1 class="hero__title">
            Find your next<br/>
            <em class="hero__title-em">great meal</em><br/>
            on campus.
          </h1>

          <p class="hero__desc">
            Browse student restaurants near you, explore daily and weekly menus,
            compare prices for students, staff and guests — all in one place.
          </p>

          <div class="hero__actions">
            <a href="#/Discovery" class="btn btn--hero-primary">
              &#127869; Explore Restaurants
            </a>
            <button id="open-login" class="btn btn--hero-ghost">
              Login
            </button>
          </div>
        </div>

        <div class="hero__visual">
          <div class="hero__card hero__card--1">
            <div class="hero__card-icon">&#127957;</div>
            <div class="hero__card-text">
              <strong>Autumn Harvest Bowl</strong>
              <span>Quinoa, roasted squash, kale</span>
            </div>
            <div class="hero__card-price">3,10 €</div>
          </div>

          <div class="hero__card hero__card--2">
            <div class="hero__card-icon">&#127869;</div>
            <div class="hero__card-text">
              <strong>Woodland Mushroom Stew</strong>
              <span>Fresh thyme, crusty bread</span>
            </div>
            <div class="hero__card-price">3,10 €</div>
          </div>

          <div class="hero__card hero__card--3">
            <div class="hero__card-icon">&#127831;</div>
            <div class="hero__card-text">
              <strong>Orchard Apple Crumble</strong>
              <span>Oats, vanilla bean cream</span>
            </div>
            <div class="hero__card-price">3,10 €</div>
          </div>

          <div class="hero__badge">
            <span class="hero__badge-num">6+</span>
            <span class="hero__badge-label">Restaurants<br/>near you</span>
          </div>
        </div>
      </section>

      <!-- ═══ FEATURES ═══ -->
      <section class="features">
        <div class="features__label">Why use it</div>
        <h2 class="features__title">Everything you need,<br/>to find your next lunch.</h2>

        <div class="features__grid">

          <div class="feature-card">
            <div class="feature-card__icon">&#128205;</div>
            <h3 class="feature-card__title">Find nearby restaurants</h3>
            <p class="feature-card__desc">
              See all student restaurants on an interactive map sorted by distance from your location.
            </p>
          </div>

          <div class="feature-card">
            <div class="feature-card__icon">&#128197;</div>
            <h3 class="feature-card__title">Daily &amp; weekly menus</h3>
            <p class="feature-card__desc">
              Check what's cooking today or plan your meals for the whole week ahead.
            </p>
          </div>

          <div class="feature-card">
            <div class="feature-card__icon">&#127991;</div>
            <h3 class="feature-card__title">Diet &amp; price info</h3>
            <p class="feature-card__desc">
              Student, staff and guest prices clearly shown. Diet badges for gluten-free, vegan and more.
            </p>
          </div>

          <div class="feature-card">
            <div class="feature-card__icon">&#10084;</div>
            <h3 class="feature-card__title">Save your favourites</h3>
            <p class="feature-card__desc">
              Bookmark the restaurants you love and filter to them instantly whenever you need.
            </p>
          </div>

        </div>
      </section>

      <!-- ═══ CTA ═══ -->
      <section class="cta">
        <div class="cta__inner">
          <div class="cta__grain"></div>
          <h2 class="cta__title">Hungry right now?</h2>
          <p class="cta__desc">See what's available near you today.</p>
          <a href="#/Discovery" class="btn btn--hero-primary">
            &#127869; Find a Restaurant
          </a>
        </div>
      </section>

    </div>
  `;

  document.querySelector("#open-login").addEventListener("click", () => {
    Login(async () => {
        await render(app);
        window.location.hash = "#/profile"; 
      });
  });
}