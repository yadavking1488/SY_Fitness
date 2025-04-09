// Cart functionality
const CART_KEY = 'fitness_store_cart';

function getCartItems() {
    const cart = localStorage.getItem(CART_KEY);
    return cart ? JSON.parse(cart) : [];
}

function saveCartItems(items) {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
}

function addToCart(product) {
    try {
        const cartItems = getCartItems();
        const existingItem = cartItems.find(item => item.name === product.name);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cartItems.push({
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            });
        }
        
        saveCartItems(cartItems);
        updateCartCount();
        return true;
    } catch (error) {
        console.error('Error adding to cart:', error);
        return false;
    }
}

function updateCartCount() {
    try {
        const cartItems = getCartItems();
        const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        const cartCounts = document.querySelectorAll('.cart-count');
        
        cartCounts.forEach(count => {
            count.textContent = totalItems;
        });
        
        // If we're on the cart page, refresh the display
        if (document.getElementById('cart-items-container')) {
            renderCartItems();
            updateTotals();
        }
        
        return totalItems;
    } catch (error) {
        console.error('Error updating cart count:', error);
        return 0;
    }
}

function renderCartItems() {
    try {
        const container = document.getElementById('cart-items-container');
        if (!container) return;
        
        const cartItems = getCartItems();
        container.innerHTML = '';
        
        if (cartItems.length === 0) {
            container.innerHTML = '<p>Your cart is empty</p>';
            return;
        }
        
        cartItems.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.dataset.price = item.price;
            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}" width="120">
                <div class="item-details">
                    <h3>${item.name}</h3>
                    <p>${item.name.includes('Dumbbell') ? 'Premium rubber coated' : 
                       item.name.includes('Treadmill') ? 'Foldable with 12 programs' : 
                       item.name.includes('Yoga') ? 'Non-slip, extra thick' : 
                       'Heart rate monitor & sleep tracker'}</p>
                    <div class="item-controls">
                        <input type="number" value="${item.quantity}" min="1" class="quantity">
                        <span class="price">$${(item.price * item.quantity).toFixed(2)}</span>
                        <button class="remove-btn" data-name="${item.name}">Remove</button>
                    </div>
                </div>
            `;
            container.appendChild(itemElement);
        });

        // Add event listeners for new elements
        document.querySelectorAll('.remove-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                removeFromCart(e.target.dataset.name);
            });
        });

        document.querySelectorAll('.quantity').forEach(input => {
            input.addEventListener('input', (e) => {
                const itemName = e.target.closest('.cart-item').querySelector('h3').textContent;
                updateCartItemQuantity(itemName, parseInt(e.target.value));
            });
        });
    } catch (error) {
        console.error('Error rendering cart items:', error);
    }
}

function removeFromCart(productName) {
    try {
        const cartItems = getCartItems().filter(item => item.name !== productName);
        saveCartItems(cartItems);
        updateCartCount();
        return true;
    } catch (error) {
        console.error('Error removing from cart:', error);
        return false;
    }
}

function updateCartItemQuantity(productName, newQuantity) {
    try {
        const cartItems = getCartItems();
        const item = cartItems.find(item => item.name === productName);
        if (item) {
            item.quantity = newQuantity;
            saveCartItems(cartItems);
            updateCartCount();
        }
        return true;
    } catch (error) {
        console.error('Error updating cart quantity:', error);
        return false;
    }
}

// Initialize cart count when page loads
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
});
