// tailwind.config.js
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'custom-green': '#35A788',
                'custom-gray': '#E0E0E0',
                'custom-blue': '#374D95',
                'custom-lightblue': '#5B73C2',
                'custom-melon': '#DAA49A',
            },
        },
    },
    plugins: [],
}
