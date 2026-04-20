import { products } from "./products.js";

function scrollToTopSmooth() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function createProductList(product) {
  return `
    <div class="product-visual">
      <img
        src="${product.image}"
        alt="${product.id}"
        class="product-image"
        onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1525310072745-f49212b5ac6d';"
      />
      <span class="price-badge">${product.price}</span>
      <button
        type="button"
        class="heart-btn"
        title="Add to favorites"
      >
        ${product.id}
      </button>
    </div>
  `;
}

function renderProductList() {
  const productGrid = document.getElementById("collection");
  if (!productGrid) return;

  products.forEach((product) => {
    const productCard = document.createElement("article");
    productCard.className = "product";
    productCard.setAttribute("data-product-id", product.id);
    productCard.innerHTML = createProductList(product);
    productGrid.appendChild(productCard);
  });
}

function showScrollTopButton() {
  return (
    window.scrollY + window.innerHeight >= document.body.scrollHeight - 120
  );
}

function showScrollTop(button) {
  button.classList.toggle("show", showScrollTopButton());
}

function clickScrollToTop(targetElement) {
  if (!targetElement) return;
  targetElement.addEventListener("click", scrollToTopSmooth);
}

function scrollToTop() {
  const logoButton = document.querySelector(".logo");
  const scrollTopButton = document.getElementById("scrollTop");

  clickScrollToTop(logoButton);
  if (!scrollTopButton) return;

  const syncVisibility = () => showScrollTop(scrollTopButton);
  window.addEventListener("scroll", syncVisibility);
  window.addEventListener("resize", syncVisibility);
  clickScrollToTop(scrollTopButton);
  syncVisibility();
}

function showModal(modal) {
  if (!modal) return;
  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function hideModal(modal) {
  if (!modal) return;
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

function modalToggleEvents() {
  document.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-modal-target]");
    if (trigger) {
      const targetId = trigger.getAttribute("data-modal-target");
      const modal = document.getElementById(targetId);
      showModal(modal);
      return;
    }

    if (event.target.classList.contains("modal-overlay")) {
      hideModal(event.target);
    }
  });
}

function init() {
  renderProductList();
  scrollToTop();
  modalToggleEvents();
}

init();