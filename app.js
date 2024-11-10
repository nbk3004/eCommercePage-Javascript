document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("modalCart");
    const cartLink = document.getElementById("cartLink");
    const closeBtn = document.getElementsByClassName("modal-cart-close")[0];
    const searchInput = document.querySelector(".navbar--search");
    const productList = document.querySelector(".products--list");
    const cartDisplay = modal.querySelector("p");
    const cartItems = []; // Initialize an empty cart array
  
    const clearCartButton = document.querySelector(".modal-cart-clear");
    const closeCartButton = document.querySelector(".modal-cart-close-btn");
  
    // Open cart modal function
    function openCartModal() {
      modal.style.display = "block";
      setTimeout(() => modal.classList.add("show"), 10);
      updateCartDisplay();
    }
  
    // Close cart modal function
    function closeCartModal() {
      modal.classList.remove("show");
      setTimeout(() => (modal.style.display = "none"), 300);
    }
  
    // Cart modal event listeners
    cartLink.onclick = openCartModal;
    closeBtn.onclick = closeCartModal;
    closeCartButton.onclick = closeCartModal; // Close Cart button
    window.onclick = (event) => {
      if (event.target === modal) closeCartModal();
    };
  
    // Function to update cart display and calculate total price
    function updateCartDisplay() {
      if (cartItems.length === 0) {
        cartDisplay.textContent = "Your cart is empty.";
      } else {
        // Create list of items
        const itemsList = cartItems
          .map((item) => `<li>${item.name} - ${item.price}</li>`)
          .join("");
  
        // Calculate total price
        const totalPrice = cartItems.reduce((total, item) => {
          const price = parseFloat(item.price.replace("$", ""));
          return total + price;
        }, 0).toFixed(2);
  
        // Display items and total price
        cartDisplay.innerHTML = `<ul>${itemsList}</ul><p><strong>Total: $${totalPrice}</strong></p>`;
      }
    }
  
    // Confirmation message for adding a product to the cart
    function displayConfirmation(productName) {
      const confirmation = document.createElement("div");
      confirmation.className = "confirmation-message";
      confirmation.textContent = `${productName} has been added to the cart.`;
      document.body.appendChild(confirmation);
  
      setTimeout(() => confirmation.remove(), 3000);
    }
  
    // Add product to cart
    const addToCartButtons = document.querySelectorAll(".product--buy");
    addToCartButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        const product = event.target.closest(".product.card");
        const productName = product.querySelector(".product--name").textContent;
        const productPrice = product.querySelector(".product--price").textContent;
  
        cartItems.push({ name: productName, price: productPrice });
        displayConfirmation(productName);
        updateCartDisplay();
      });
    });
  
    // Search functionality
    searchInput.addEventListener("input", () => {
      const query = searchInput.value.toLowerCase();
      Array.from(productList.children).forEach((product) => {
        const productName = product.querySelector(".product--name").textContent.toLowerCase();
        product.style.display = productName.includes(query) ? "" : "none";
      });
    });
  
    // Function to clear cart
    function clearCart() {
      cartItems.length = 0; // Clear all items from cartItems array
      updateCartDisplay(); // Update display to show empty cart
    }
  
    // Event listener for "Clear Cart" button
    clearCartButton.addEventListener("click", clearCart);
  });
  