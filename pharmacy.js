const cartItems = [];
const cartTable = document.getElementById('cart-items');
const totalDisplay = document.getElementById('cart-total');
const medicineContainer = document.getElementById('medicine-container');

// Fetch and render medicines
fetch('pharmacy.json')
    .then(response => response.json())
    .then(data => renderMedicines(data.pharmacyPage.categories))
    .catch(console.error);

// Function to render medicines
function renderMedicines(categories) {
    categories.forEach(category => {
        const section = document.createElement('section');
        section.innerHTML = `<h2>${category.name}</h2>`;
        category.medicines.forEach(medicine => {
            const item = document.createElement('div');
            item.classList.add('medicine-item');
            item.innerHTML = `
                <img src="${medicine.image}" alt="${medicine.name}">
                <div class="medicine-details">
                    <p>${medicine.name} - $${medicine.price}</p>
                    <input type="number" min="1" value="1">
                    <button class="cart-btn" data-name="${medicine.name}" data-price="${medicine.price}">Add to Cart</button>
                </div>
            `;
            section.appendChild(item);
        });
        medicineContainer.appendChild(section);
    });

    // Add event listeners for "Add to Cart" buttons
    document.querySelectorAll('.cart-btn').forEach(button => {
        button.addEventListener('click', () => addToCart(button));
    });
}

// Add item to the cart
function addToCart(button) {
    const name = button.dataset.name;
    const price = parseFloat(button.dataset.price);
    const quantity = parseInt(button.previousElementSibling.value);

    if (quantity > 0) {
        const existingItem = cartItems.find(item => item.name === name);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cartItems.push({ name, price, quantity });
        }
        updateCart();
    } else {
        alert('Please enter a valid quantity!');
    }
}

// Update cart display
function updateCart() {
    cartTable.innerHTML = '';
    let total = 0;

    cartItems.forEach(item => {
        total += item.price * item.quantity;
        cartTable.insertAdjacentHTML('beforeend', `
            <tr>
                <td>${item.name}</td>
                <td>$${item.price}</td>
                <td>
                    <button class="decrease" data-name="${item.name}">-</button>
                    <span>${item.quantity}</span>
                    <button class="increase" data-name="${item.name}">+</button>
                </td>
                <td>$${(item.price * item.quantity).toFixed(2)}</td>
            </tr>
        `);
    });

    totalDisplay.textContent = `Total: $${total.toFixed(2)}`;

    // Add event listeners to increase/decrease buttons
    document.querySelectorAll('.increase').forEach(button => {
        button.addEventListener('click', () => updateQuantity(button.dataset.name, 1));
    });
    document.querySelectorAll('.decrease').forEach(button => {
        button.addEventListener('click', () => updateQuantity(button.dataset.name, -1));
    });
}

// Update the quantity of an item in the cart
function updateQuantity(name, change) {
    const item = cartItems.find(item => item.name === name);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            const index = cartItems.indexOf(item);
            cartItems.splice(index, 1); // Remove item if quantity is 0 or less
        }
        updateCart();
    }
}

// Clear Cart Button
document.getElementById('clear-cart').addEventListener('click', () => {
    cartItems.length = 0;
    updateCart();
});

// Buy Now Button
document.getElementById('buy-now-btn').addEventListener('click', () => {
    if (cartItems.length) {
        // Save cart items to localStorage before navigating to the payment page
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        window.location.href = 'payment.html';  // Redirect to the payment page
    } else {
        alert('Your cart is empty!');
    }
});

// Save Favorites Button
document.getElementById('save-favorites').addEventListener('click', () => {
    if (cartItems.length > 0) {
        localStorage.setItem('favoriteCart', JSON.stringify(cartItems));
        alert('Favorites saved successfully!');
    } else {
        alert('Your cart is empty! Add items to save as favorites.');
    }
});

// Load Favorites Button
document.getElementById('load-favorites').addEventListener('click', () => {
    const favoriteCart = JSON.parse(localStorage.getItem('favoriteCart'));
    if (favoriteCart && favoriteCart.length > 0) {
        cartItems.length = 0; // Clear current cart
        cartItems.push(...favoriteCart); // Load favorites into cart
        updateCart(); // Update cart display
        alert('Favorites applied to your cart!');
    } else {
        alert('No favorites found. Please save a favorite cart first.');
    }
});
