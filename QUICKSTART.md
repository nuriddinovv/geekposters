# Quick Start Guide

## Running the Website

Since this is a vanilla HTML/CSS/JavaScript project, you have several options:

### Option 1: Direct File Opening (Simplest)
1. Open the `geekpostersweb` folder in File Explorer
2. Right-click on `index.html`
3. Select "Open with" → Your favorite browser

**Note**: This method works for basic functionality but may have limitations with some features.

### Option 2: Using VS Code Live Server (Recommended)
1. Install the "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"
4. Your site opens at `http://localhost:5500`

### Option 3: Using Python (if installed)
```bash
cd d:\geekpostersweb
python -m http.server 8000
```
Then visit: `http://localhost:8000`

### Option 4: Using Node.js (if installed)
```bash
cd d:\geekpostersweb
npx http-server
```

## Testing the Website

Once running, test these features:

- ✓ Navigation bar with logo
- ✓ Hero section
- ✓ Product grid with 8 sample posters
- ✓ Filter by category (All, Abstract, Typography, Minimal)
- ✓ Add products to cart
- ✓ Cart modal slides in from right
- ✓ Update quantities in cart
- ✓ Cart total updates automatically
- ✓ Contact form
- ✓ Responsive mobile layout

## Customization Checklist

- [ ] Replace `assets/logo.svg` with your actual GeekPosters logo
- [ ] Update product images in `js/products.js` with real poster URLs
- [ ] Customize product listings and prices
- [ ] Add your company colors if desired
- [ ] Set up email handling for contact form
- [ ] Connect to payment gateway for checkout
- [ ] Deploy to hosting (Netlify, Vercel, GitHub Pages, or traditional hosting)

## Key Files to Customize

| File | Purpose |
|------|---------|
| `index.html` | Add/modify sections, navigation, meta tags |
| `css/style.css` | Colors, fonts, layout, responsive breakpoints |
| `js/products.js` | Product database - add your items here |
| `js/cart.js` | Cart logic (usually no changes needed) |
| `js/main.js` | App interactions and event handlers |
| `assets/logo.svg` | Your store logo |

## Deployment Options

### Free Hosting
- **GitHub Pages**: Push to GitHub repo, enable Pages
- **Netlify**: Drag & drop folder or connect to Git
- **Vercel**: Similar to Netlify, optimized for web projects
- **Surge.sh**: Terminal deployment command

### Paid Hosting
- Traditional web hosting (GoDaddy, Bluehost, etc.)
- Cloud platforms (AWS, Azure, Google Cloud)

## Support

For any questions about customization, refer to:
- `README.md` for project overview
- Code comments in each JavaScript file
- CSS comments explaining the styling sections
