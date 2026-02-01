'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { products } from './data/products';
import { translations } from './data/translations';
import Image from 'next/image';

const DEFAULT_LANGUAGE = 'ru';

const filterOptions = [
    { key: 'all', labelKey: 'allProducts' },
    { key: 'car', labelKey: 'car' },
    { key: 'musical', labelKey: 'musical' },
    { key: 'gaming', labelKey: 'gaming' },
    { key: '3d', labelKey: '3d' },
    { key: 'anime', labelKey: 'anime' }
];

const formatPrice = (price) => {
    const numeric = Math.round(Number(price) || 0).toString();
    const formatted = numeric.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return `${formatted} UZS`;
};

const IconGlobe = ({ className }) => (
    <svg
        viewBox="0 0 24 24"
        className={className}
        aria-hidden="true"
        focusable="false"
    >
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18" />
        <path d="M12 3a15 15 0 0 1 0 18" />
        <path d="M12 3a15 15 0 0 0 0 18" />
    </svg>
);

const IconInstagram = ({ className }) => (
    <svg
        viewBox="0 0 24 24"
        className={className}
        aria-hidden="true"
        focusable="false"
    >
        <rect x="4" y="4" width="16" height="16" rx="4" />
        <circle cx="12" cy="12" r="3.5" />
        <circle cx="17" cy="7" r="1" className="icon-fill" />
    </svg>
);

const IconTelegram = ({ className }) => (
    <svg
        viewBox="0 0 24 24"
        className={className}
        aria-hidden="true"
        focusable="false"
    >
        <path d="M21 4L3 11l7 2 2 7 9-16z" />
        <path d="M10 13l3 3" />
    </svg>
);

const IconMail = ({ className }) => (
    <svg
        viewBox="0 0 24 24"
        className={className}
        aria-hidden="true"
        focusable="false"
    >
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 7l9 6 9-6" />
    </svg>
);

const IconPhone = ({ className }) => (
    <svg
        viewBox="0 0 24 24"
        className={className}
        aria-hidden="true"
        focusable="false"
    >
        <path d="M5.5 4h4l2 5-3 2a12 12 0 0 0 5 5l2-3 5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 4 6a2 2 0 0 1 2-2z" />
    </svg>
);

export default function Home() {
    const [currentFilter, setCurrentFilter] = useState('all');
    const [cartItems, setCartItems] = useState([]);
    const [cartOpen, setCartOpen] = useState(false);
    const [lightbox, setLightbox] = useState({ open: false, image: null, title: '' });
    const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
    const [language, setLanguage] = useState(DEFAULT_LANGUAGE);
    const [notification, setNotification] = useState(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const languageSwitcherRef = useRef(null);
    const notificationTimers = useRef({ exit: null, clear: null });

    const t = (key) => {
        if (!key) return '';
        return (
            translations[language]?.[key] ??
            translations.en?.[key] ??
            key
        );
    };

    const filteredProducts = useMemo(() => {
        if (currentFilter === 'all') return products;
        return products.filter((product) => product.category === currentFilter);
    }, [currentFilter]);

    const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);
    const cartTotal = cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    useEffect(() => {
        const storedLanguage = localStorage.getItem('geekposters-language');
        if (storedLanguage && translations[storedLanguage]) {
            setLanguage(storedLanguage);
        }

        const storedCart = localStorage.getItem('geekposters-cart');
        if (storedCart) {
            try {
                const parsed = JSON.parse(storedCart);
                if (Array.isArray(parsed)) {
                    setCartItems(parsed);
                }
            } catch (error) {
                console.error('Failed to parse stored cart', error);
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('geekposters-language', language);
    }, [language]);

    useEffect(() => {
        localStorage.setItem('geekposters-cart', JSON.stringify(cartItems));
    }, [cartItems]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                setLightbox((prev) => (prev.open ? { ...prev, open: false } : prev));
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        const handleDocumentClick = (event) => {
            if (
                languageSwitcherRef.current &&
                !languageSwitcherRef.current.contains(event.target)
            ) {
                setLanguageMenuOpen(false);
            }
        };

        document.addEventListener('click', handleDocumentClick);
        return () => document.removeEventListener('click', handleDocumentClick);
    }, []);

    useEffect(() => {
        return () => {
            if (notificationTimers.current.exit) {
                clearTimeout(notificationTimers.current.exit);
            }
            if (notificationTimers.current.clear) {
                clearTimeout(notificationTimers.current.clear);
            }
        };
    }, []);

    useEffect(() => {
        document.body.classList.toggle('mobile-menu-open', mobileMenuOpen);
        return () => {
            document.body.classList.remove('mobile-menu-open');
        };
    }, [mobileMenuOpen]);

    const showNotification = (message) => {
        if (notificationTimers.current.exit) {
            clearTimeout(notificationTimers.current.exit);
        }
        if (notificationTimers.current.clear) {
            clearTimeout(notificationTimers.current.clear);
        }

        setNotification({ message, leaving: false });

        notificationTimers.current.exit = setTimeout(() => {
            setNotification((prev) =>
                prev ? { ...prev, leaving: true } : prev
            );
        }, 3000);

        notificationTimers.current.clear = setTimeout(() => {
            setNotification(null);
        }, 3300);
    };

    const addToCart = (product) => {
        setCartItems((prev) => {
            const existingItem = prev.find((item) => item.id === product.id);
            if (existingItem) {
                return prev.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });

        const productName = product.name || t(product.nameKey);
        showNotification(`${productName} ${t('addedToCart')}`);
    };

    const removeFromCart = (productId) => {
        setCartItems((prev) => prev.filter((item) => item.id !== productId));
    };

    const updateQuantity = (productId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }
        setCartItems((prev) =>
            prev.map((item) =>
                item.id === productId ? { ...item, quantity } : item
            )
        );
    };

    const handleCheckout = () => {
        if (cartItems.length === 0) {
            showNotification(t('cartIsEmpty'));
            return;
        }
        showNotification(t('checkoutComingSoon'));
    };

    const handleContactSubmit = async (event) => {
        event.preventDefault();

        const formElements = event.currentTarget.elements;
        const name = formElements[0]?.value ?? '';
        const phone = formElements[1]?.value ?? '';
        const message = formElements[2]?.value ?? '';

        const botToken = '8210824009:AAEIjAFz8L9nMRxPGyXE7SaXK4A80cYTsos';
        const chatId = '-5011938065';

        const telegramMessage = `
📬 *New Contact Form Submission*

👤 *Name:* ${name}
📱 *Phone:* ${phone}
💬 *Message:*
${message}
`;

        const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: telegramMessage,
                    parse_mode: 'Markdown'
                })
            });

            if (response.ok) {
                showNotification(t('messageReceived'));
                event.currentTarget.reset();
            } else {
                showNotification('Error sending message. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            showNotification(t('messageReceived'));
            event.currentTarget.reset();
        }
    };

    const notificationStyle = notification
        ? {
              position: 'fixed',
              top: '80px',
              right: '20px',
              backgroundColor: '#000',
              color: '#fff',
              padding: '16px 24px',
              borderRadius: '4px',
              zIndex: 999,
              animation: notification.leaving
                  ? 'slideOutRight 0.3s ease'
                  : 'slideInRight 0.3s ease'
          }
        : null;

    return (
        <>
            <nav className="navbar">
                <div className="container">
                    <a href="#" className="logo">
                        <Image
                            src="/assets/logo.svg"
                            alt="GeekPosters Logo"
                            className="logo-img"
                            height={40}
                            width={40}
                        />
                        <span className="logo-text">GeekPosters</span>
                    </a>
                    <div
                        id="mobileMenu"
                        className={`nav-links${mobileMenuOpen ? ' mobile-open' : ''}`}
                    >
                        <button
                            className="mobile-menu-close"
                            type="button"
                            aria-label="Close menu"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            &times;
                        </button>
                        <a
                            href="#shop"
                            className="nav-link"
                            data-i18n="shop"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {t('shop')}
                        </a>
                        <a
                            href="#about"
                            className="nav-link"
                            data-i18n="about"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {t('about')}
                        </a>
                        <a
                            href="#contact"
                            className="nav-link"
                            data-i18n="contact"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {t('contact')}
                        </a>
                        <button
                            className="cart-toggle"
                            id="cartToggle"
                            aria-label={t('cart')}
                            onClick={() => {
                                setCartOpen(true);
                                setMobileMenuOpen(false);
                            }}
                        >
                            <span className="cart-icon">🛒</span>
                            <span className="cart-count" id="cartCount">
                                {cartCount}
                            </span>
                        </button>
                    </div>
                    <div className="nav-actions">
                        <div
                            className="language-switcher"
                            ref={languageSwitcherRef}
                        >
                            <button
                                className="language-toggle"
                                id="languageToggle"
                                aria-label="Language selector"
                                aria-haspopup="listbox"
                                aria-expanded={languageMenuOpen}
                                aria-controls="languageMenu"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    setLanguageMenuOpen((open) => !open);
                                }}
                            >
                                <IconGlobe className="icon icon-stroke" />
                            </button>
                            <div
                                className={`language-menu${
                                    languageMenuOpen ? ' active' : ''
                                }`}
                                id="languageMenu"
                            >
                                {['uz', 'ru', 'en'].map((lang) => (
                                    <button
                                        key={lang}
                                        className={`language-option${
                                            language === lang ? ' active' : ''
                                        }`}
                                        data-lang={lang}
                                        onClick={() => {
                                            if (translations[lang]) {
                                                setLanguage(lang);
                                            }
                                            setLanguageMenuOpen(false);
                                            setMobileMenuOpen(false);
                                        }}
                                    >
                                        {lang === 'uz'
                                            ? "O'zbekcha"
                                            : lang === 'ru'
                                              ? 'Русский'
                                              : 'English'}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <button
                            className="mobile-menu-toggle"
                            type="button"
                            aria-label="Open menu"
                            aria-expanded={mobileMenuOpen}
                            aria-controls="mobileMenu"
                            onClick={() => setMobileMenuOpen(true)}
                        >
                            <span></span>
                            <span></span>
                            <span></span>
                        </button>
                    </div>
                </div>
            </nav>
            <div
                className={`mobile-menu-overlay${mobileMenuOpen ? ' active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
            ></div>

            <main id="main">
                <section className="hero">
                    <div className="container">
                        <h1 data-i18n="heroTitle">{t('heroTitle')}</h1>
                        <p data-i18n="heroSubtitle">{t('heroSubtitle')}</p>
                        <a href="#shop" className="cta-button" data-i18n="browseCollection">
                            {t('browseCollection')}
                        </a>
                    </div>
                </section>

                <section id="shop" className="products">
                    <div className="container">
                        <h2 data-i18n="ourCollection">{t('ourCollection')}</h2>

                        <div className="filters">
                            {filterOptions.map((filter) => (
                                <button
                                    key={filter.key}
                                    className={`filter-btn${
                                        currentFilter === filter.key
                                            ? ' active'
                                            : ''
                                    }`}
                                    data-filter={filter.key}
                                    data-i18n={filter.labelKey}
                                    aria-pressed={currentFilter === filter.key}
                                    onClick={() => setCurrentFilter(filter.key)}
                                >
                                    {filter.labelKey === 'allProducts'
                                        ? t('allProducts')
                                        : t(filter.labelKey)}
                                </button>
                            ))}
                        </div>

                        <div className="products-grid" id="productsGrid">
                            {filteredProducts.map((product) => {
                                const productName =
                                    product.name || t(product.nameKey);
                                return (
                                    <div key={product.id} className="product-card">
                                        <div
                                            className="product-image"
                                            onClick={() =>
                                                setLightbox({
                                                    open: true,
                                                    image: `/${product.image}`,
                                                    title: productName
                                                })
                                            }
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <Image
                                                src={`/${product.image}`}
                                                alt={productName}
                                                loading="lazy"
                                                width={300}
                                                height={400}
                                                quality={70}
                                                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 45vw, 350px"
                                            />
                                        </div>
                                        <div className="product-info">
                                            <div className="product-category">
                                                {t(product.categoryKey)}
                                            </div>
                                            <div className="product-name">{productName}</div>
                                            <div className="product-description">
                                                {t(product.descriptionKey)}
                                            </div>
                                            <div className="product-footer">
                                                <div className="product-price">
                                                    {formatPrice(product.price)}
                                                </div>
                                                <button
                                                    className="add-to-cart-btn"
                                                    data-i18n="addToCart"
                                                    onClick={() => addToCart(product)}
                                                >
                                                    {t('addToCart')}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                <section id="about" className="about">
                    <div className="container">
                        <h2 data-i18n="aboutTitle">{t('aboutTitle')}</h2>
                        <p data-i18n="aboutDescription">{t('aboutDescription')}</p>

                        <div className="services-grid">
                            <div className="service-card">
                                <p data-i18n="deliveryInfo">{t('deliveryInfo')}</p>
                            </div>
                            <div className="service-card">
                                <p data-i18n="customDesignInfo">{t('customDesignInfo')}</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="contact" className="contact">
                    <div className="container">
                        <h2 data-i18n="contactTitle">{t('contactTitle')}</h2>
                        <form className="contact-form" id="contactForm" onSubmit={handleContactSubmit}>
                            <input
                                type="text"
                                data-i18n-placeholder="contactName"
                                placeholder={t('contactName')}
                                aria-label={t('contactName')}
                                required
                            />
                            <input
                                type="tel"
                                data-i18n-placeholder="contactPhone"
                                placeholder={t('contactPhone')}
                                aria-label={t('contactPhone')}
                                required
                            />
                            <textarea
                                data-i18n-placeholder="contactMessage"
                                placeholder={t('contactMessage')}
                                aria-label={t('contactMessage')}
                                rows="5"
                                required
                            ></textarea>
                            <button
                                type="submit"
                                className="submit-btn"
                                data-i18n="sendMessage"
                            >
                                {t('sendMessage')}
                            </button>
                        </form>
                    </div>
                </section>
            </main>

            <footer className="footer">
                <div className="container">
                    <p data-i18n="allRightsReserved">{t('allRightsReserved')}</p>
                    <div className="social-links">
                        <a
                            href="https://www.instagram.com/geekposters/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="social-link"
                            title="Instagram"
                        >
                            <IconInstagram className="icon icon-stroke" />
                        </a>
                        <a
                            href="https://t.me/geekposter"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="social-link"
                            title="Telegram"
                        >
                            <IconTelegram className="icon icon-stroke" />
                        </a>
                        <a
                            href="mailto:yuldashev1230@icloud.com"
                            className="social-link"
                            title="Email"
                        >
                            <IconMail className="icon icon-stroke" />
                        </a>
                        <a
                            href="tel:+998990215770"
                            className="social-link"
                            title="Phone"
                        >
                            <IconPhone className="icon icon-stroke" />
                        </a>
                    </div>
                </div>
            </footer>

            <div
                className={`poster-lightbox${lightbox.open ? ' active' : ''}`}
                id="posterLightbox"
                role="dialog"
                aria-modal="true"
                aria-hidden={!lightbox.open}
                onClick={(event) => {
                    if (event.target === event.currentTarget) {
                        setLightbox((prev) => ({ ...prev, open: false }));
                    }
                }}
            >
                <div className="lightbox-content">
                    <button
                        className="lightbox-close"
                        id="closeLightbox"
                        aria-label="Close poster"
                        onClick={() => setLightbox((prev) => ({ ...prev, open: false }))}
                    >
                        &times;
                    </button>
                    {lightbox.image ? (
                        <img
                            id="lightboxImage"
                            src={lightbox.image}
                            alt={lightbox.title}
                            className="lightbox-image"
                            loading="lazy"
                            decoding="async"
                        />
                    ) : null}
                    <div className="lightbox-info">
                        <h3 id="lightboxTitle">{lightbox.title}</h3>
                    </div>
                </div>
            </div>

            <div
                className={`cart-modal${cartOpen ? ' active' : ''}`}
                id="cartModal"
                role="dialog"
                aria-modal="true"
                aria-hidden={!cartOpen}
                onClick={(event) => {
                    if (event.target === event.currentTarget) {
                        setCartOpen(false);
                    }
                }}
            >
                <div className="cart-content">
                    <div className="cart-header">
                        <h2 data-i18n="shoppingCart">{t('shoppingCart')}</h2>
                        <button
                            className="close-cart"
                            id="closeCart"
                            aria-label="Close cart"
                            onClick={() => setCartOpen(false)}
                        >
                            &times;
                        </button>
                    </div>
                    <div className="cart-items" id="cartItems">
                        {cartItems.length === 0 ? (
                            <p className="empty-cart" data-i18n="yourCartEmpty">
                                {t('yourCartEmpty')}
                            </p>
                        ) : (
                            cartItems.map((item) => (
                                <div key={item.id} className="cart-item">
                                    <div className="cart-item-info">
                                        <div className="cart-item-name">{item.name}</div>
                                        <div className="cart-item-price">
                                            {formatPrice(item.price)}
                                        </div>
                                    </div>
                                    <div className="cart-item-quantity">
                                        <button
                                            className="quantity-btn"
                                            onClick={() =>
                                                updateQuantity(item.id, item.quantity - 1)
                                            }
                                        >
                                            −
                                        </button>
                                        <span>{item.quantity}</span>
                                        <button
                                            className="quantity-btn"
                                            onClick={() =>
                                                updateQuantity(item.id, item.quantity + 1)
                                            }
                                        >
                                            +
                                        </button>
                                    </div>
                                    <button
                                        className="remove-btn"
                                        onClick={() => removeFromCart(item.id)}
                                    >
                                        ×
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                    <div className="cart-footer">
                        <div className="cart-total">
                            <strong data-i18n="total">{t('total')}</strong>:
                            <span id="cartTotal">{formatPrice(cartTotal)}</span>
                        </div>
                        <button
                            className="checkout-btn"
                            id="checkoutBtn"
                            data-i18n="proceedCheckout"
                            disabled={cartItems.length === 0}
                            onClick={handleCheckout}
                        >
                            {t('proceedCheckout')}
                        </button>
                    </div>
                </div>
            </div>

            {notification && (
                <div style={notificationStyle} aria-live="polite">
                    {notification.message}
                </div>
            )}
        </>
    );
}
