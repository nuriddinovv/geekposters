// Main Application Logic
let currentFilter = 'all';

// Format price in UZS currency
function formatPrice(price) {
    return price.toLocaleString('uz-UZ') + ' UZS';
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    renderProducts(products);
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Filter buttons
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentFilter = this.dataset.filter;
            filterProducts();
        });
    });

    // Cart modal
    const cartToggle = document.getElementById('cartToggle');
    const cartModal = document.getElementById('cartModal');
    const closeCart = document.getElementById('closeCart');

    cartToggle.addEventListener('click', function() {
        cartModal.classList.add('active');
    });

    closeCart.addEventListener('click', function() {
        cartModal.classList.remove('active');
    });

    cartModal.addEventListener('click', function(e) {
        if (e.target === cartModal) {
            cartModal.classList.remove('active');
        }
    });

    // Checkout button
    const checkoutBtn = document.getElementById('checkoutBtn');
    checkoutBtn.addEventListener('click', handleCheckout);

    // Contact form
    const contactForm = document.getElementById('contactForm');
    contactForm.addEventListener('submit', handleContactSubmit);

    // Poster lightbox
    const posterLightbox = document.getElementById('posterLightbox');
    const closeLightbox = document.getElementById('closeLightbox');

    closeLightbox.addEventListener('click', function() {
        posterLightbox.classList.remove('active');
    });

    posterLightbox.addEventListener('click', function(e) {
        if (e.target === posterLightbox) {
            posterLightbox.classList.remove('active');
        }
    });

    // Close lightbox on ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            posterLightbox.classList.remove('active');
        }
    });
}

// Render products to the grid
function renderProducts(productsToRender) {
    const productsGrid = document.getElementById('productsGrid');
    
    productsGrid.innerHTML = productsToRender.map(product => `
        <div class="product-card">
            <div class="product-image" onclick="openPosterLightbox('${product.image}', '${product.name || t(product.nameKey)}')\" style="cursor: pointer;">
                <img src="${product.image}" alt="${product.name || t(product.nameKey)}" loading="lazy">
            </div>
            <div class="product-info">
                <div class="product-category">${t(product.categoryKey)}</div>
                <div class="product-name">${product.name || t(product.nameKey)}</div>
                <div class="product-description">${t(product.descriptionKey)}</div>
                <div class="product-footer">
                    <div class="product-price">${formatPrice(product.price)}</div>
                    <button class="add-to-cart-btn" onclick="addToCart(${product.id})" data-i18n="addToCart">Add</button>
                </div>
            </div>
        </div>
    `).join('');
    
    // Update the Add to Cart buttons text
    const addButtons = document.querySelectorAll('[data-i18n="addToCart"]');
    addButtons.forEach(btn => {
        btn.textContent = t('addToCart');
    });
}

// Filter products
function filterProducts() {
    let filtered = products;
    
    if (currentFilter !== 'all') {
        filtered = products.filter(product => product.category === currentFilter);
    }
    
    renderProducts(filtered);
}

// Open poster in lightbox
function openPosterLightbox(imageSrc, posterName) {
    const posterLightbox = document.getElementById('posterLightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxTitle = document.getElementById('lightboxTitle');
    
    lightboxImage.src = imageSrc;
    lightboxTitle.textContent = posterName;
    posterLightbox.classList.add('active');
}

// Add product to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        cart.addItem(product);
        
        // Show feedback
        showNotification(`${t(product.nameKey)} ${t('addedToCart')}`);
    }
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background-color: #000;
        color: #fff;
        padding: 16px 24px;
        border-radius: 4px;
        z-index: 999;
        animation: slideInRight 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Handle checkout
function handleCheckout() {
    if (cart.items.length === 0) {
        showNotification(t('cartIsEmpty'));
        return;
    }

    // For now, show a simple checkout message
    showNotification(t('checkoutComingSoon'));
    
    // In a real application, you would redirect to a payment processor
    // window.location.href = '/checkout';
}

// Handle contact form submission
function handleContactSubmit(e) {
    e.preventDefault();
    
    const formElements = e.target.elements;
    const name = formElements[0].value;
    const phone = formElements[1].value;
    const message = formElements[2].value;
    
    // Telegram Bot credentials
    const botToken = '8210824009:AAEIjAFz8L9nMRxPGyXE7SaXK4A80cYTsos';
    const chatId = '-5011938065';
    
    // Format message
    const telegramMessage = `
📬 *New Contact Form Submission*

👤 *Name:* ${name}
📱 *Phone:* ${phone}
💬 *Message:*
${message}
`;
    
    // Send to Telegram
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            chat_id: chatId,
            text: telegramMessage,
            parse_mode: 'Markdown'
        })
    })
    .then(response => {
        if (response.ok) {
            showNotification(t('messageReceived'));
            e.target.reset();
        } else {
            showNotification('Error sending message. Please try again.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showNotification(t('messageReceived'));
        e.target.reset();
    });
}
