/**
 * Render the top navigation bar into a container element.
 *
 * @param {HTMLElement} container - The #navbar element
 */
export const renderNavbar = (container) => {
    container.innerHTML = `
        <nav class="navbar">
            <a class="navbar__logo" href="#/">Student Restaurants</a>
            <ul class="navbar__links">
                <li><a href="#/">Home</a></li>
                <li><a href="#/restaurants">Restaurants</a></li>
                <li><a href="#/map">Map</a></li>
            </ul>
        </nav>
    `;
};