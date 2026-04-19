import { products } from "./products.js";

function renderProducts() {
  const productGrid = document.getElementById("collection");
  if (!productGrid) return;

  products.forEach((product) => {
    const article = document.createElement("article");
    article.className = "product";
    article.setAttribute("data-product-id", product.id);
    article.innerHTML = `
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
    productGrid.appendChild(article);
  });
}

renderProducts();

const logoButton = document.querySelector(".logo");
if (logoButton) {
  logoButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

const scrollTopButton = document.getElementById("scrollTop");

if (scrollTopButton) {
  const updateScrollTopVisibility = () => {
    const nearBottom =
      window.scrollY + window.innerHeight >= document.body.scrollHeight - 120;
    scrollTopButton.classList.toggle("show", nearBottom);
  };

  window.addEventListener("scroll", updateScrollTopVisibility);
  window.addEventListener("resize", updateScrollTopVisibility);

  scrollTopButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  updateScrollTopVisibility();
}

// const favorites = new Set();

// document.addEventListener("click", (event) => {
//   const target = event.target;
//   const button = target.closest
//     ? target.closest(".heart-btn")
//     : target.parentElement?.closest(".heart-btn");
//   if (!button) return;

//   event.preventDefault();

//   const product = button.closest(".product");
//   const productId = product.getAttribute("data-product-id");

//   if (favorites.has(productId)) {
//     favorites.delete(productId);
//     button.classList.remove("active");
//     button.textContent = "🤍";
//   } else {
//     favorites.add(productId);
//     button.classList.add("active");
//     button.textContent = "❤️";
//   }

//   updateFavoritesModal();
// });

function updateFavoritesModal() {
  const favoritesModal = document.getElementById("favorites-modal");
  const contentContainer = document.getElementById("favorites-content");

  if (favorites.size === 0) {
    contentContainer.innerHTML =
      '<p class="favorites-empty">Chưa có mục yêu thích nào. Nhấn vào tim để thêm bó hoa bạn thích.</p>';
  } else {
    const favoriteProducts = Array.from(document.querySelectorAll(".product"))
      .filter((p) => favorites.has(p.getAttribute("data-product-id")))
      .map((p) => {
        const productId = p.getAttribute("data-product-id");
        const originalProduct =
          products.find((item) => item.id === productId) || {};
        return {
          id: productId,
          price: originalProduct.price,
          image: originalProduct.image,
        };
      });

    let tableHTML = `
      <table class="favorites-table">
        <thead>
          <tr>
            <th></th>
            <th>Sản phẩm</th>
            <th>Giá</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
    `;

    favoriteProducts.forEach((product) => {
      tableHTML += `
        <tr data-product-id="${product.id}">
          <td>
            <div class="table-product-image">
                <img
                    src="${product.image}"
                    alt="${product.id}"
                    onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1525310072745-f49212b5ac6d';"
                />
            </div>
          </td>
          <td><span class="product-price">${product.price}</span></td>
          <td></td>
          <td>
            <button class="delete-favorite-btn" title="Remove from favorites">
              🗑️
            </button>
          </td>
        </tr>
      `;
    });

    tableHTML += `
        </tbody>
      </table>
    `;

    contentContainer.innerHTML = tableHTML;

    // Add event listeners to delete buttons
    contentContainer.querySelectorAll(".delete-favorite-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const row = btn.closest("tr");
        const productId = row.getAttribute("data-product-id");
        favorites.delete(productId);
        updateFavoritesModal();
      });
    });
  }
}

const modalTriggers = document.querySelectorAll("[data-modal-target]");
const modalClosers = document.querySelectorAll(".modal-close");
const modalOverlays = document.querySelectorAll(".modal-overlay");
let lastFocusedElement = null;

function openModal(modal, trigger) {
  if (!modal) return;
  lastFocusedElement = trigger || document.activeElement;
  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  const closeButton = modal.querySelector(".modal-close");
  if (closeButton) {
    closeButton.focus();
  }
}

function closeModal(modal) {
  if (!modal) return;
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  if (lastFocusedElement) {
    lastFocusedElement.focus();
  }
}

modalTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const targetId = trigger.getAttribute("data-modal-target");
    const modal = document.getElementById(targetId);
    // Close all other modals before opening this one
    modalOverlays.forEach((overlay) => {
      if (overlay.id !== targetId && overlay.classList.contains("show")) {
        closeModal(overlay);
      }
    });
    openModal(modal, trigger);
  });
});

modalClosers.forEach((button) => {
  button.addEventListener("click", () => {
    const modal = button.closest(".modal-overlay");
    closeModal(modal);
  });
});

modalOverlays.forEach((overlay) => {
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) {
      closeModal(overlay);
    }
  });
});
