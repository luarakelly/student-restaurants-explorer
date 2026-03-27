/**
 * @fileoverview Generic modal system. Renders an overlay with a header
 * and a content area. Reusable by any feature that needs a modal.
 */

/**
 * Builds the modal header HTML.
 *
 * @param {string} title    - The main title text.
 * @param {string} subtitle - The subtitle text shown below the title.
 * @returns {string} HTML string for the modal header.
 */
export function ModalHeader(title, subtitle) {
  return `
    <div class="menu-modal__header">
      <div class="menu-modal__title-wrap">
        <div class="menu-modal__title">${title}</div>
        <div class="menu-modal__location">&#128205; ${subtitle}</div>
      </div>
      <button class="menu-modal__close" aria-label="Close">&#10005;</button>
    </div>
  `;
}

/**
 * Opens a modal overlay and injects the provided HTML content into it.
 * Closes on overlay click, Escape key, or clicking the close/back buttons.
 *
 * @param {string} contentHTML - Full HTML string to render inside the modal.
 * @returns {HTMLElement} The overlay element (useful for querying children after open).
 */
export function openModal(contentHTML) {
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";
  overlay.innerHTML = `
    <div class="modal modal--menu">
      ${contentHTML}
    </div>
  `;

  document.body.appendChild(overlay);

  const close = () => {
    overlay.remove();
    document.removeEventListener("keydown", onEsc);
  };

  const onEsc = (e) => { if (e.key === "Escape") close(); };

  overlay.addEventListener("click", (e) => { if (e.target === overlay) close(); });
  document.addEventListener("keydown", onEsc);
  overlay.querySelector(".menu-modal__close")?.addEventListener("click", close);

  return overlay;
}