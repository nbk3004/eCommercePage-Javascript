
document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("modalCart");
    const cartLink = document.getElementById("cartLink");
    const closeBtn = document.getElementsByClassName("modal-cart-close")[0];
    const searchInput = document.querySelector(".navbar--search");
    const productList = document.querySelector(".products--list");
    const cartDisplay = modal.querySelector("p");
    const cartItems = []; // Initialize an empty cart array

    const sortDropdown = document.getElementById("sort"); 
    const clearCartButton = document.querySelector(".modal-cart-clear");
    const closeCartButton = document.querySelector(".modal-cart-close-btn");



    // Open cart 
    function openCartModal() {
      modal.style.display = "block";
      setTimeout(() => modal.classList.add("show"), 10);
      updateCartDisplay();
    }

    // Close cart 
    function closeCartModal() {
      modal.classList.remove("show");
      setTimeout(() => (modal.style.display = "none"), 300);
    }

    // click cart
    cartLink.onclick = openCartModal;
    closeBtn.onclick = closeCartModal;
    closeCartButton.onclick = closeCartModal; 
    window.onclick = (event) => {
      if (event.target === modal) closeCartModal();
    };

    // Update cart display
    function updateCartDisplay() {
      if (cartItems.length === 0) {
        cartDisplay.textContent = "Your cart is empty.";
      } else {
        const itemsList = cartItems
          .map((item, index) => {
            return `<li>
                ${item.name} - ${item.price} 
                <button class="quantity-btn" data-index="${index}" data-type="minus">-</button>
                <span>Quantity: ${item.quantity}</span>
                <button class="quantity-btn" data-index="${index}" data-type="plus">+</button>
                <button class="remove-item" data-index="${index}">Remove</button>
              </li>`;
          })
          .join("");

        const totalPrice = cartItems.reduce((total, item) => {
          const price = parseFloat(item.price.replace("$", ""));
          return total + price * item.quantity; 
        }, 0).toFixed(2);

        cartDisplay.innerHTML = `<ul>${itemsList}</ul><p><strong>Total: $${totalPrice}</strong></p>`;

        // buttons (plus, minus)
        const quantityButtons = document.querySelectorAll(".quantity-btn");
        quantityButtons.forEach((button) => {
          button.addEventListener("click", (event) => {
            const index = event.target.getAttribute("data-index");
            const type = event.target.getAttribute("data-type");
            changeCartItemQuantity(index, type); 
          });
        });

        // remove buttons
        const removeButtons = document.querySelectorAll(".remove-item");
        removeButtons.forEach((button) => {
          button.addEventListener("click", (event) => {
            const index = event.target.getAttribute("data-index");
            removeItemFromCart(index); 
          });
        });
      }
    }

    // Change cart item quantity + and -
    function changeCartItemQuantity(index, type) {
      let cartItem = cartItems[index];

      if (cartItem) {
        if (type === 'plus') {
          cartItem.quantity += 1; // Increase 
        } else if (type === 'minus') {
          cartItem.quantity -= 1; // Decrease 
          if (cartItem.quantity <= 0) {
            removeItemFromCart(index); // Remove 
          }
        }
      }
      updateCartDisplay(); // Update 
    }

    // Remove 
    function removeItemFromCart(index) {
      cartItems.splice(index, 1);  // Remove
      updateCartDisplay();          // Update 
    }

    // Confirm
    function displayConfirmation(productName) {
      const confirmation = document.createElement("div");
      confirmation.className = "confirmation-message";
      confirmation.textContent = `${productName} has been added to the cart.`;
      document.body.appendChild(confirmation);

      setTimeout(() => confirmation.remove(), 3000);
    }

    // Add product 
    const addToCartButtons = document.querySelectorAll(".product--buy");
    addToCartButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        const product = event.target.closest(".product.card");
        const productName = product.querySelector(".product--name").textContent;
        const productPrice = product.querySelector(".product--price").textContent;

        // Check if product already exists in the cart
        const existingProductIndex = cartItems.findIndex(item => item.name === productName);
        if (existingProductIndex >= 0) {
          // If product exists, increase its quantity
          cartItems[existingProductIndex].quantity += 1;
        } else {
          // If product doesn't exist, add it to the cart with quantity 1
          cartItems.push({ name: productName, price: productPrice, quantity: 1 });
        }

        displayConfirmation(productName);
        updateCartDisplay(); // Refresh 
      });
    });


    // Search 
    searchInput.addEventListener("input", () => {
      const query = searchInput.value.toLowerCase();
      Array.from(productList.children).forEach((product) => {
        const productName = product.querySelector(".product--name").textContent.toLowerCase();
        product.style.display = productName.includes(query) ? "" : "none";
      });
    });

    // clear cart
    function clearCart() {
      cartItems.length = 0; // Clear all 
      updateCartDisplay(); // Update 
    }

    // Event listener for "Clear Cart" button
    clearCartButton.addEventListener("click", clearCart);

    // sort by price
    function sortProducts(order) {
      const productsArray = Array.from(productList.children);

      productsArray.sort((a, b) => {
        const priceA = parseFloat(a.querySelector(".product--price").textContent.replace("$", ""));
        const priceB = parseFloat(b.querySelector(".product--price").textContent.replace("$", ""));

        return order === "asc" ? priceA - priceB : priceB - priceA;
      });

      // Append sorted 
      productList.innerHTML = "";
      productsArray.forEach((product) => productList.appendChild(product));
    }

    // Event listener for sort dropdown
    sortDropdown.addEventListener("change", (event) => {
      sortProducts(event.target.value);
    });
  });
