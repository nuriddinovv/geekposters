# GeekPosters - A3 Minimalist Poster Store

A modern, minimalist online store for selling A3 wall posters. Built with vanilla HTML, CSS, and JavaScript for optimal performance and simplicity.

## Features

- **Minimalist Design**: Clean black and white aesthetic
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile devices
- **Product Filtering**: Browse by category (Abstract, Typography, Minimal)
- **Shopping Cart**: Add/remove items with persistent storage using localStorage
- **Product Grid**: Beautiful grid layout showcasing poster designs
- **Contact Form**: Get in touch with customers
- **Smooth Animations**: Elegant transitions and interactions

## Project Structure

```
geekpostersweb/
├── index.html           # Main HTML file
├── css/
│   └── style.css       # Complete styling (minimalist design)
├── js/
│   ├── main.js         # Main application logic
│   ├── products.js     # Product database
│   └── cart.js         # Shopping cart functionality
└── assets/
    └── logo.svg        # GeekPosters logo
```

## Getting Started

1. **Open the website**: Simply open `index.html` in your web browser
2. **No build process required**: This is a vanilla web project with no dependencies
3. **Customize products**: Edit the `products` array in `js/products.js`
4. **Modify styling**: Update `css/style.css` to change colors, fonts, or layout

## Customization

### Adding Products

Edit `js/products.js` and add items to the `products` array:

```javascript
{
    id: 9,
    name: 'Your Poster Name',
    category: 'abstract', // or 'typography', 'minimal'
    price: 24.99,
    description: 'Poster description',
    image: 'path/to/image.jpg'
}
```

### Changing Colors

Modify the color values in `css/style.css`. Current palette:
- Black: `#000`
- White: `#fff`
- Light Gray: `#f9f9f9`, `#f5f5f5`
- Dark Gray: `#666`, `#999`
- Border Gray: `#ddd`

### Adding Your Logo

Replace `assets/logo.svg` with your store logo and ensure it maintains the same filename and path reference in `index.html`.

## Features to Implement

- [ ] Replace placeholder images with actual poster images
- [ ] Connect payment gateway (Stripe, PayPal)
- [ ] Add product detail pages
- [ ] Implement user accounts and order history
- [ ] Add email notifications
- [ ] Set up inventory management
- [ ] Add product reviews and ratings

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- No build tools required
- Minimal JavaScript - only ~3KB combined
- CSS Grid and Flexbox for layouts
- Lazy loading for images
- LocalStorage for cart persistence

## Technologies Used

- HTML5
- CSS3 (Grid, Flexbox, Animations)
- Vanilla JavaScript (ES6+)
- LocalStorage API
- SVG Graphics

## Notes

- Product images use placeholder URLs (via.placeholder.com) - replace with actual poster images
- The checkout system is a placeholder - integrate with a payment processor
- Contact form currently logs to console - set up backend for email handling

## License

© 2025 GeekPosters. All rights reserved.
