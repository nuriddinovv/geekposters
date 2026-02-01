import './globals.css';

export const metadata = {
    title: 'GeekPosters - Decorative A3 Wall Posters',
    description: 'Curated wall art for modern spaces'
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
