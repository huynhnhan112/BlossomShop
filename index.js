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
        class="product-id-badge"
        title="Product ID"
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

function setupProductRevealAnimation() {
  const productGrid = document.getElementById("collection");
  if (!productGrid) return;

  const productCards = Array.from(productGrid.querySelectorAll(".product"));
  if (!productCards.length) return;

  const templateColumns = getComputedStyle(productGrid).gridTemplateColumns;
  const columnCount = Math.max(1, templateColumns.split(" ").filter(Boolean).length);
  const revealGroups = new Map();

  productCards.forEach((card, index) => {
    const groupIndex = Math.floor(index / columnCount);
    card.dataset.revealGroup = String(groupIndex);
    card.classList.add("is-pending-reveal");
    card.style.transitionDelay = `${50 + groupIndex * 90}ms`;

    const groupCards = revealGroups.get(groupIndex) || [];
    groupCards.push(card);
    revealGroups.set(groupIndex, groupCards);
  });

  const revealCard = (card) => {
    card.classList.remove("is-pending-reveal");
    card.classList.add("is-revealed");
  };

  if (!("IntersectionObserver" in window)) {
    productCards.forEach(revealCard);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const groupIndex = Number(entry.target.dataset.revealGroup);
        const cardsToReveal = revealGroups.get(groupIndex) || [entry.target];

        cardsToReveal.forEach((card) => {
          revealCard(card);
          observer.unobserve(card);
        });
      });
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -12% 0px",
    },
  );

  productCards.forEach((card) => observer.observe(card));
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

function setupProductPreview() {
  const productGrid = document.getElementById("collection");
  const previewModal = document.getElementById("product-preview-modal");
  const previewImage = document.getElementById("preview-image");
  if (!productGrid || !previewModal || !previewImage) return;

  productGrid.addEventListener("click", (event) => {
    if (event.target.closest(".product-id-badge")) return;

    const productCard = event.target.closest(".product");
    if (!productCard) return;

    const productId = Number(productCard.getAttribute("data-product-id"));
    const selectedProduct = products.find(
      (product) => product.id === productId,
    );
    if (!selectedProduct) return;

    previewImage.src = selectedProduct.image;
    previewImage.alt = `Product ${selectedProduct.id}`;
    showModal(previewModal);
  });
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

    const closeButton = event.target.closest("[data-modal-close]");
    if (closeButton) {
      const targetModal = closeButton.closest(".modal-overlay");
      hideModal(targetModal);
      return;
    }

    if (event.target.classList.contains("modal-overlay")) {
      hideModal(event.target);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    const openedModal = document.querySelector(".modal-overlay.show");
    hideModal(openedModal);
  });
}

function init() {
  renderProductList();
  setupProductRevealAnimation();
  scrollToTop();
  setupProductPreview();
  modalToggleEvents();
}

init();