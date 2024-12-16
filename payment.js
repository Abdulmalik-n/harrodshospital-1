// Retrieve cart items from localStorage
const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
const orderItemsTable = document.getElementById('order-items');
const totalPriceElement = document.getElementById('total-price');
const payButton = document.getElementById('pay-button');
const confirmationMessage = document.getElementById('confirmation-message');
const deliveryDateElement = document.getElementById('delivery-date');

// Function to render the order summary
function renderOrderSummary() {
    let total = 0;
    orderItemsTable.innerHTML = ''; // Clear previous items

    cartItems.forEach(item => {
        const row = document.createElement('tr');
        const totalItemPrice = item.price * item.quantity;
        total += totalItemPrice;

        row.innerHTML = `
            <td>${item.name}</td>
            <td>$${item.price}</td>
            <td>${item.quantity}</td>
            <td>$${totalItemPrice.toFixed(2)}</td>
        `;
        orderItemsTable.appendChild(row);
    });

    totalPriceElement.textContent = total.toFixed(2);
}

// Utility functions for validation
function isValidName(name) {
    return /^[a-zA-Z\s]+$/.test(name);
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
    return /^\d{10}$/.test(phone);
}

function isValidCardNumber(cardNumber) {
    return /^\d{16}$/.test(cardNumber);
}

function isValidExpiryDate(expiryDate) {
    const [month, year] = expiryDate.split('/');
    const now = new Date();
    const currentYear = now.getFullYear() % 100; // Get last two digits of the year
    const currentMonth = now.getMonth() + 1;

    if (!month || !year || isNaN(month) || isNaN(year)) return false;
    if (month < 1 || month > 12) return false;
    if (year < currentYear || (year == currentYear && month < currentMonth)) return false;

    return true;
}

function isValidCVV(cvv) {
    return /^\d{3}$/.test(cvv);
}

// Event listener for the "Pay" button
payButton.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent form submission

    // Retrieve form values
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const city = document.getElementById('city').value.trim();
    const street = document.getElementById('street').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const cardNumber = document.getElementById('card-number').value.trim();
    const expiryDate = document.getElementById('expiry-date').value.trim();
    const cvv = document.getElementById('cvv').value.trim();

    // Validation checks
    if (!isValidName(name)) {
        alert("Please enter a valid name (letters and spaces only).");
        return;
    }

    if (!isValidEmail(email)) {
        alert("Please enter a valid email address.");
        return;
    }

    if (!city) {
        alert("Please enter your city.");
        return;
    }

    if (!street) {
        alert("Please enter your street.");
        return;
    }

    if (!isValidPhone(phone)) {
        alert("Please enter a valid 10-digit phone number.");
        return;
    }

    if (!isValidCardNumber(cardNumber)) {
        alert("Please enter a valid 16-digit card number.");
        return;
    }

    if (!isValidExpiryDate(expiryDate)) {
        alert("Please enter a valid expiry date in MM/YY format.");
        return;
    }

    if (!isValidCVV(cvv)) {
        alert("Please enter a valid 3-digit CVV.");
        return;
    }

    // If all fields are valid, calculate delivery date
    const currentDate = new Date();
    const deliveryDate = new Date(currentDate.setDate(currentDate.getDate() + 3)); // Example: 3 days from now

    // Display confirmation message with delivery date
    confirmationMessage.style.display = 'block';
    deliveryDateElement.textContent = deliveryDate.toDateString(); // Format delivery date

    // Optionally, clear the cart
    localStorage.removeItem('cartItems');
});

// Call render function to display the order details when the page loads
renderOrderSummary();
