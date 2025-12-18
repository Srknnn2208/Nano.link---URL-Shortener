/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'neon-green': '#39FF14',
                'electric-magenta': '#FF00FF',
            },
            fontFamily: {
                mono: ['"Space Mono"', 'monospace'],
            },
            boxShadow: {
                'neon': '0 0 10px theme("colors.neon-green")',
                'magenta': '4px 4px 0 #FF00FF',
            },
            backgroundImage: {
                'grid-pattern': "linear-gradient(to right, #333 1px, transparent 1px), linear-gradient(to bottom, #333 1px, transparent 1px)",
            },
            backgroundSize: {
                'grid-size': '40px 40px',
            }
        },
    },
    plugins: [],
}
